/**
 * Module dependencies.
 */

var Base = require('mocha').reporters.Base;
var fs = require('fs');
var path = require('path');
var TeamCityReporter = require('mocha-teamcity-reporter')
var mkdirp = require('mkdirp');
/**
 * Expose `ScreenshotReporter`.
 */

exports = module.exports = ScreenshotReporter;

/**
 * Initialize a new `ScreenshotReporter` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function ScreenshotReporter(runner) {
  Base.call(this, runner);
  // TODO: when mocha merges the following pull request (https://github.com/visionmedia/mocha/pull/1106/commits)
  // we will then be able to send in reporter options.  We can then dynamically call the "main" reporter instead
  // of hardcoding it to TeamCityReporter.  Furthermore, we can also parameterize the screenshots directory location
  TeamCityReporter.call(this, runner)

  runner.on('fail', function(test, err) {
	  browser.takeScreenshot().then(function (png) {
	    screenshotDir = path.resolve('screenshots');
	    makeScreenshotDirectory(screenshotDir);
      screenshotFile = path.join(screenshotDir, test.title + '.png');
	    writeScreenShot(png, screenshotFile);
	  });
  });
}

function makeScreenshotDirectory(directory) {
  mkdirp(directory, function(err) {
    if(err) {
      throw new Error('Could not create directory ' + directory);
    }
  });
}

function writeScreenShot(data, filename) {
  var stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}
