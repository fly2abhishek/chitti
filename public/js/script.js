'use strict';
(function ($) {
  var socket = io();

  var chatBox = $('.chatbox');
  const outputYou = document.querySelector('.output-you');
  const outputBot = document.querySelector('.output-bot');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  $(document).ready(function () {
    $('.button-speech').on('click', function (e) {
      recognition.start();
      $('.inputbox').hide();
      $('.spinner').show();

      e.preventDefault();
      return 0;
    });

  });

  // recognition.addEventListener('speechstart', function () {
  //
  //   console.log('Speech has been detected.');
  // });

  recognition.addEventListener('speechend', function () {
    $('.spinner').hide();
    $('.inputbox').show();
    recognition.stop();
  });

  recognition.addEventListener('result', function(e) {

  var last = e.results.length - 1;
  var text = e.results[last][0].transcript;

    //alert(text);
    chatBox.append("<p class='output-you'> You: " + text + "</p> ");

 // outputYou.textContent = text;
//  chatBox.appendChild('text');
 // console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
  });

  recognition.addEventListener('error', function(e) {
    var replyText = 'I couldn\'t hear you, could you say that again?';
    chatBox.append("<p class='output-bot'> Olaf: " + replyText + "</p> ");
   });

  socket.on('bot reply', function(reply) {

    reply = JSON.parse(reply);
    console.log(reply);
    if(reply == '') reply = 'I\'m sorry, I don\'t have the answer to that yet.';
    //outputBot.textContent = reply;
    chatBox.append("<p class='output-bot'> Olaf: " + reply.speech + "</p> ");
    synthVoice(reply.speech);
    chatBox.append(reply.markup);
  });

  function synthVoice(text) {
    var synth = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }

})(jQuery, window);
