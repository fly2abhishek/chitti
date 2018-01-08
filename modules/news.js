var request = require('request');
module.exports = {
  get: function (socket, aiText, params) {
    console.log(params);
    var responce = '';
    var category = params.category;
    var date_time = params['date-time'];
    var keyword = params.keyword;
    var sortBy = 'top';
    var source = 'the-times-of-india';

    var url = "https://newsapi.org/v1/articles?source=" + source + "&sortBy=" + sortBy + "&apiKey=f3a0a45d0d234de1b2895bfce8d3e4c7";
    request(url, function (error, response, body) {
      body = JSON.parse(body);
      //console.log(body);
      var responce = {};
      responce.speech = aiText;
      responce.markup = '';
      var articles = body.articles;
      if (articles.length > 0) responce.markup += '<div class="news"><ul>';
      for (var i = 0; i < articles.length; i++) {
        console.log(body[i]);
        var res = '<li class="news-item"><a href="' + articles[i].url + '">' + articles[i].title + '</a></li>';
        responce.markup += res;
      }
      if (articles.length > 0) responce.markup += '</ul></div>';
      // console.log(JSON.stringify(responce));
      socket.emit('bot reply', JSON.stringify(responce));
    });
  }

};