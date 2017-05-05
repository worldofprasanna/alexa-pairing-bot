var Alexa = require('alexa-sdk');
var https = require('https');

var location = "Seattle";

var output = "";

var event;

var alexa;
var states = {
  SEARCHMODE: '_SEARCHMODE',
  TOPFIVE: '_TOPFIVE',
};

var startSearchHandlers = {
  'getProjectName': function () {
    console.log('Inside getProjectName');
    var projectName = this.event.request.intent.slots.project.value;
    console.log('Project URL :', projectName);
    var options = {
      host: 'cbsw88isjl.execute-api.us-west-2.amazonaws.com',
      path: '/prod/spark-create-blog',
      method: 'POST'
    };

    var req = https.request(options, function (res) {

      console.log('Invoking lambda to get URL');
      var response = '';

      res.on('data', function (d) {
        response += d;
        console.log('Response from lambda:', response)
      });

      res.on('end', function () {
        var url = JSON.parse(response).url;
        updateSlack(url, function (response) {

          console.log('Inside httpGet Response callback');
          var cardTitle = 'project url';
          var cardContent = 'URL: ' + url;
          alexa.emit(':tellWithCard', url, cardTitle, cardContent);
        });
      });

    });
    var data = '{"event": {"action":"create-website","value":"'+projectName+'"}}';
    req.write(data);
    req.end();
    req.on('error', function (e) {
      console.error(e);
    });
  }
};

var updateProjectHandler = {
  'updateProject': function(){
    var img = this.event.request.intent.slots.img.value;
    var options = {
      host: 'cbsw88isjl.execute-api.us-west-2.amazonaws.com',
      path: '/prod/spark-create-blog',
      method: 'POST'
    };

    var req = https.request(options, function (res) {

      console.log('Invoking lambda to change background');
      var response = '';

      res.on('data', function (d) {
        response += d;
        var cardTitle = 'Website Updation';
        var cardContent = 'Website Update successfully';
        console.log('Response from lambda:', response);
        alexa.emit(':tellWithCard', 'Succesfully Updated', cardTitle, cardContent);
      });

    });
    var data = '{"event": {"action":"change-background","value":"'+img+'"}}';
    req.write(data);
    req.end();
    req.on('error', function (e) {
      console.error(e);
      var cardTitle = 'Wesite Updation failed';
      var cardContent = 'Couldn t update website';
      alexa.emit(':tellWithCard', 'Updation failed', cardTitle, cardContent);
    });

  }
};

exports.handler = function (event, context, callback) {
  console.log('Started in function');
  alexa = Alexa.handler(event, context);
  this.event = event;
  alexa.registerHandlers(startSearchHandlers);
  alexa.registerHandlers(updateProjectHandler);
  alexa.execute();
};

function updateSlack(url, callback) {
  var options = {
    host: 'hooks.slack.com',
    path: '/services/T04N70K4J/B59FXUYS1/wO1EBlyrQVHYxfXQTELa5hc9',
    method: 'POST'
  };

  var req = https.request(options, function (res) {

    console.log('Sending url to slack');
    var body = '';

    res.on('data', function (d) {
      body += d;
      console.log('Response from slack:', body)
    });

    res.on('end', function () {
      callback(url);
    });
  });
  payload='{"channel": "#spark-alexa-test", "username": "pairingbot", "text": "'+url+'"}';
  req.write(payload);
  req.end();
  req.on('error', function (e) {
    console.error(e);
  });

}

String.prototype.trunc =
  function (n) {
    return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
  };
