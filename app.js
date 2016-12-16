/*eslint-env node*/
var express = require('express');
const bodyParser = require('body-parser');

var cfenv = require('cfenv');
var app = express();
app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
app.use(bodyParser.urlencode({
  extended: true
}));
app.use(bodyParser.json());
app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
});

app.post('/', function(req, res) {
  console.log(req.body);
  console.log(req.body.name);
});
var secret = require('./secret.js');

var http = require('https');
var url = secret.rakuten_url;
var keyword = "&keyword=" + "ビール";

http.get(url, function(res) {
  var body = '';
  res.setEncoding('utf8');

  res.on('data', function(chunk) {
      body += chunk;
  });

  res.on('end', function(res) {
      ret = JSON.parse(body);
      console.log(ret.Items);
  });
}).on('error', function(e) {
  console.log(e.message);
});
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
