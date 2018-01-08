'use strict';

var APIAI_TOKEN = 'ecf9ffd04fcc4df697f7e626fd4d9c36';
var APIAI_SESSION_ID = 'ascjhas';

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

var server = app.listen(process.env.PORT || 3001, function () {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

var io = require('socket.io')(server);
io.on('connection', function (socket) {
  console.log('a user connected');
});

var apiai = require('apiai')(APIAI_TOKEN);
var request = require('request');
var weather = require('./modules/weather');
var news = require('./modules/news');

// // Web UI
// app.get('/', function (req, res) {
//   res.sendFile('index.html');
// });

io.on('connection', function (socket) {
  socket.on('chat message', function (text) {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    var apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', function (response) {
      console.log(response);
      var aiText = response.result.fulfillment.speech;

      if (response.result.action == 'weather') {
        weather.get(socket, response.result.parameters);
      }
      else if (response.result.action == 'news.search') {
        news.get(socket, aiText, response.result.parameters);
      }
      else {
        var res = {};
        res.speech = aiText;

        console.log('Bot reply: ' + res.speech);
        socket.emit('bot reply', JSON.stringify(res));
      }
    });

    apiaiReq.on('error', function (error) {
      console.log(error);
    });

    apiaiReq.end();

  });
});
