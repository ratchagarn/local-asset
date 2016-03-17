var express = require('express');
var router = express.Router();

var fs = require('fs');
var resources = JSON.parse(fs.readFileSync('./resources.json'));
var _ = require('lodash');
var purl = require('purl');
var _PORT = process.env.PORT || 6969;
var request = require('request');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/', homePage);
router.get('/download', function(req, res) {
  require('../load-assets.js');
  res.send('Please wait while downloading files. (See progress in your TERMINAL)');
});
router.get('/generate', generate);


/**
 * Router - home page
 * ------------------------------------------------------------
 */

function homePage(req, res, next) {
  var data = {
        title: 'Local assets',
        resources: []
      };


  _.forEach(resources, function(url) {
    data.resources.push('http://localhost:' + _PORT + purl(url).pathname);
  });

  res.render('index', data);
}


/**
 * Router - Generate
 * ------------------------------------------------------------
 */

function generate(req, res, next) {
  var targetURL = req.query.url,
      baseURL = targetURL;
  if (req.query.baseurl != null) {
    baseURL = req.query.baseurl;
  }

  request(targetURL, function (error, response, html) {

    if (!error && response.statusCode == 200) {

      var $ = cheerio.load(html),
          output = [];

      // fetch all css links
      $('link[rel="stylesheet"]').each(function(i, el) {
        var url = $(el).attr('href');
        if (isAbsoluteURL(url)) {
          output.push(url);
        }
        else if (url) {
          output.push(baseURL + url);
        }
      });

      // fetch all image
      $('img').each(function(i, el) {
        var url = $(el).attr('src');
        if (isAbsoluteURL(url)) {
          output.push(url);
        }
        else if (url) {
          output.push(baseURL + url);
        }
      });

      // fetch all scripts
      $('script').each(function(i, el) {
        var url = $(el).attr('src');
        if (isAbsoluteURL(url)) {
          output.push(url);
        }
        else if (url) {
          output.push(baseURL + url);
        }
      });

      for (var i = 0, len = output.length; i < len; i++) {
        if (/^\/\//.test(output[i])) {
          output[i] = output[i].replace(/\/\//, 'http://');
        }
      }

      output = output.join('|').replace(/https:\/\//g, 'http://').split('|');
      res.json(output);

    }
    else {
      res.send("<h1>Error ! Can't load HTML from url (" + baseURL + ")</h1>");
    }

  });
}


/**
 * Helper for add base url
 * ------------------------------------------------------------
 */

function isAbsoluteURL(url) {
  return /^(http:\/\/|https:\/\/|\/\/)/.test(url);
}

module.exports = router;