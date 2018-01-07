var request = require('request');
module.exports = {
  get: function (socket, params) {
    console.log(params);
    var responce = '';
    var city_name = params.address.city;
    if (typeof city_name != "string") city_name = "Delhi";
    var url = "http://api.apixu.com/v1/current.json?key=5d985862da7b4b12a8c172045170310&q=" + city_name;
    request(url, function (error, response, body) {
      body = JSON.parse(body);
      var temp = body.current.temp_c;
      var condition = body.current.condition.text;
      responce = {};
      responce.speech = "It is " + condition + " with a temperature of " + temp + " degrees celsius in " + city_name;
      responce.markup = "<div class='weather'>" +
        "<div class='location'>" +
        "<h1>" + body.location.name + ", " + body.location.region + "</h1>" +
        "<p>" + body.location.localtime + "</p>" +
        "<p>" + condition + "</p>" +
        "</div>" +
        "    <div class='temprature'>" +
        "    <div class='icon'>" +
        "    <img src='" + body.current.condition.icon + "'/>" +
        "    </div>" +
        "    <div class='temp'>" +
        "    " + temp.toFixed() + " °C" +
        "    </div>" +
        "    </div>" +
        "    <div class='other'>" +
        "    <p>Precipitation: " + body.current.precip_mm + " %</p>" +
        "    <p>Humidity: " + body.current.humidity + " %</p>" +
        "    <p>Wind: " + body.current.wind_kph + " Kmph</p>" +
        "    <p>Visibility: " + body.current.vis_km + " Km</p>" +
        "    </div>" +
        "</div>";
      socket.emit('bot reply', JSON.stringify(responce));
    });
  }

};