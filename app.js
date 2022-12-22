require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const unix = require(__dirname + "/unixtimestamp.js");
const axios = require('axios');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function (req, res) {
  res.render('weather', {
    placeholder: "Enter Your city",
    border: ""
  });
});

app.post("/",function(req,res){
  let city = req.body.cityName;
  res.redirect("/"+city)
})


app.get("/:city", async function (req, res) {

  let city = req.params.city.split(" ").join("%20");

  const appkey = process.env.SECRETKEY;
  const unit = "metric";

  const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + appkey + "&units=" + unit + "&lang=en";
  try {
    let response = await axios.get(url);

    const { list, city } = response.data;

    const icon = list[0].weather[0].icon;

    const resultData = {
      "country": city.country,
      "name": city.name,

      "temp": Math.floor(list[0].main.temp),
      "feels_like": list[0].main.feels_like,
      "main": list[0].weather[0].main,
      "discription": list[0].weather[0].description,
      "date": unix.unixTime(list[0].dt, city.timezone).date,
      "population": city.population,
      "temp_min": Math.floor(list[0].main.temp_min),
      "temp_max": Math.floor(list[0].main.temp_max),

      "pressure": Math.floor(list[0].main.pressure * 0.0145038), //for psi
      "humidity": list[0].main.humidity,

      "speed": Number(list[0].wind.speed * 3.6).toFixed(1), //for km/h
      "deg": list[0].wind.deg,

      "sunrise": unix.unixTime(city.sunrise, city.timezone).time,
      "sunset": unix.unixTime(city.sunset, city.timezone).time,

      "iconUrl": "https://openweathermap.org/img/wn/" + icon + "@2x.png"
    }
    res.render("result", {
      resultData: resultData,
      forecast: list,
    });

  } catch (error) {
    console.log(error);
    res.render('weather', {
      placeholder: "Invalid City, Try again",
      border: "error"
    });
  }

});



app.listen(process.env.PORT || 3000, function () {
  console.log("server in running on 3000");
});
