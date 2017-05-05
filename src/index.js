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


    httpGet(location, function (response) {

      console.log('Inside httpGet Response callback');
      // Parse the response into a JSON object ready to be formatted.
      var projectName = this.event.request.intent.slots.project.value;
      console.log('Project URL :', projectName);



      // Check if we have correct data, If not create an error speech out to try again.
      var cardTitle = 'project url';
      var cardContent = 'URL: ' + response;
      alexa.emit(':tellWithCard', response, cardTitle, cardContent);
    });
  }
};

exports.handler = function (event, context, callback) {
  console.log('Started in function');
  alexa = Alexa.handler(event, context);
  this.event = event;
  alexa.registerHandlers(startSearchHandlers);
  alexa.execute();
};

// Create a web request and handle the response.
function httpGet(project, callback) {
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
      callback("www.google.com");
    });

  });
  payload='{"channel": "#spark-alexa-test", "username": "pairingbot", "text": "www.google.com"}';
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
