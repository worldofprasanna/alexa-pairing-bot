var Alexa = require('alexa-sdk');
var https = require('https');
var event;
var alexa;

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
        updateSlack(url, projectName, function (response) {

          var cardTitle = 'project url';
          var cardContent = 'URL: ' + url;
          alexa.emit(':tellWithCard', 'Successfully created the website and URL has been sent to slack, cardTitle', cardContent);
        });
      });

    });
    var data = {action:"create-website",value:projectName};
    req.write('create-website,'+projectName);
    console.log(JSON.stringify(data));
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
    var data = 'change-background,'+img;
    req.end(data);
    req.on('error', function (e) {
      console.error(e);
      var cardTitle = 'Website Updation failed';
      var cardContent = 'Couldn t update website';
      alexa.emit(':tellWithCard', 'Updation failed', cardTitle, cardContent);
    });

  }
};

var updateProjectBorderHandler = {
  'updateProjectBorder': function(){
    var border = this.event.request.intent.slots.border.value;
    var options = {
      host: 'cbsw88isjl.execute-api.us-west-2.amazonaws.com',
      path: '/prod/spark-create-blog',
      method: 'POST'
    };

    var req = https.request(options, function (res) {

      console.log('Invoking lambda to change website border');
      var response = '';

      res.on('data', function (d) {
        response += d;
        var cardTitle = 'Website Border updation';
        var cardContent = 'Website Border Updated successfully';
        console.log('Response from lambda:', response);
        alexa.emit(':tellWithCard', 'Website Border Succesfully Updated', cardTitle, cardContent);
      });

    });
    var data = 'change-border,'+border;
    req.end(data);
    req.on('error', function (e) {
      console.error(e);
      var cardTitle = 'Website Border Updation failed';
      var cardContent = 'Couldn t update Website Border';
      alexa.emit(':tellWithCard', 'Website Border Updation failed', cardTitle, cardContent);
    });
  }
};

exports.handler = function (event, context, callback) {
  console.log('Started in function');
  alexa = Alexa.handler(event, context);
  this.event = event;
  alexa.registerHandlers(startSearchHandlers);
  alexa.registerHandlers(updateProjectHandler);
  alexa.registerHandlers(updateProjectBorderHandler);
  alexa.execute();
};

function updateSlack(url, projectName, callback) {
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
  payload='{"channel": "#spark-alexa-test", "username": "pairingbot", "text": " URL for '+projectName+' is '+url+'"}';
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
