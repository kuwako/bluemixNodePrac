var express = require('express');
var cfenv = require('cfenv');
var app = express();
app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();

app.get('/', function(req, res) {
  console.log('get');
  if (req.query.freeword) {
    var secret = require('./secret.js');
    var http = require('https');
    var url = secret.rakuten_url;
    var keyword = "&keyword=" + req.query.freeword;

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
  }

}).listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
});
