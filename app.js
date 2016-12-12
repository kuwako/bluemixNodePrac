/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var http = require('https');
var url = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222?applicationId=1018675735002256351&keyword=%E3%83%93%E3%83%BC%E3%83%AB&sort=%2reviewAverage&hits=10&page=1';
http.get(url, function(res) {
  var body = '';
  res.setEncoding('utf8');

  res.on('data', function(chunk) {
      body += chunk;
  });

  res.on('end', function(res) {
      ret = JSON.parse(body);
      console.log(ret);
  });
}).on('error', function(e) {
  console.log(e.message);
});

var secret = require('./secret.js');
var TradeoffAnalyticsV1 = require('watson-developer-cloud/tradeoff-analytics/v1');
var tradeoff_analytics = new TradeoffAnalyticsV1({
  username: secret.username,
  password: secret.password,
  headers: {
    'X-Watson-Learning-Opt-Out': 'true'
  }
});

var params = require('./problem.json');
tradeoff_analytics.dilemmas(params, function(error, resolution) {
  if (error) {
    console.log('error: ', error)
  } else {
    console.log(JSON.stringify(resolution, null, 2));
  }
});
