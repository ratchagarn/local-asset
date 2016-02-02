var express = require('express');
var router = express.Router();

var fs = require('fs');
var resources = JSON.parse(fs.readFileSync('./resources.json'));
var _ = require('lodash');
var purl = require('purl');
var _PORT = process.env.PORT || 6969;

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {
        title: 'Local assets',
        resources: []
      };


  _.forEach(resources, function(url) {
    data.resources.push('http://localhost:' + _PORT + purl(url).pathname);
  });

  res.render('index', data);
});

module.exports = router;
