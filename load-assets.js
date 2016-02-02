var mkdirp = require('mkdirp'),
    fs = require('fs'),
    _ = require('lodash'),
    purl = require('purl'),
    http = require('http'),
    baseAssetsPath = './public/';

var resources = JSON.parse(fs.readFileSync('./resources.json'));

/**
 * Create assets dir
 * ------------------------------------------------------------
 */

_.forEach(resources, function(url) {

    var pathFragments = purl(url).pathname.replace('/', '').split('/'),
      filename = pathFragments.pop(),
      deepDirName = pathFragments.join('/'),
      destination = baseAssetsPath + deepDirName;

  // create destination directory
  mkdirp.sync(destination);

  var downloadDest = destination + '/' + filename;
  download(url, downloadDest, function(err) {
    if (!err) {
      // console.log('Download file ==> ' + url + ' success !');
      console.log('[You can access] http://localhost:' + process.env.PORT + '/' + downloadDest.replace(baseAssetsPath, ''));
    }
    else {
      console.log('[ERROR]', err);
    }
  });
});


/**
 * Helper for download file from url and write file to destination
 * ------------------------------------------------------------
 * http://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
 */

function download(url, dest, cb) {
  var file = fs.createWriteStream(dest);

  http
    .get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb || function(){});
      });
    })
    .on('error', function(err) {
      fs.unlink(dest);
      if (cb) {
        cb(err.message);
      }
    });
};