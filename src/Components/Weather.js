import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Weather.css";
import {
  WiStrongWind,
  WiHumidity,
  WiThermometerExterior,
  WiSunrise,
  WiSunset,
} from "react-icons/wi";
import axios from "axios";
import { Button } from "react-bootstrap";
import default_background from "../img/default_background.png";
import rainy_weather from "../img/rainy_weather.jpg";
import clear_weather from "../img/clear_weather.jpg";
import nightclear_weather from "../img/nightclear_weather.jpg";
import nightclouds_weather from "../img/nightclouds_weather.jpg";
import nightrain_weather from "../img/nightrain_weather.jpg";
import nightsnow_weather from "../img/nightsnow_weather.jpg";
import snowy_weather from "../img/snowy_weather.jpg";
import stormyrain_weather from "../img/stormyrain_weather.jpg";
import sunnyclouds_weather from "../img/sunnyclouds_weather.jpg";

const Weather = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [background, setBackground] = useState(default_background);
  const [locationInput, setLocationInput] = useState("");
  const { city, forecast, forecasts } = location.state || {};
  //Props from location.state object to be used seperately!
  //provides a default value if location.state is null to prevenet error
  const [weatherData, setWeatherData] = useState({
    city: city || { name: "", country: "" },
    forecast: forecast || [],
    forecasts: forecasts || [],
  });

  //give components' initial state these data(city...etc) so it can use weatherData
  //setWeather function data updates the state with new data from the API !

  useEffect(() => {
    if (forecast && forecast.length > 0) {
      setWeatherData({ city, forecast, forecasts });
      console.log(location.state);
    }
  }, [city, forecast, forecasts, location.state]);

  useEffect(() => {
    if (weatherData.forecast && weatherData.forecast.length > 0) {
      //check if weatherData is not null
      updateBackground(weatherData.forecast[0]);
    }
  }, [weatherData]);

  //Rerender if weatherData changes

  const updateBackground = (forecastItem) => {
    const weatherCondition = forecastItem.weather[0].main;
    const isDay = forecastItem.weather[0].icon.includes("d");
    switch (weatherCondition) {
      case "Clear":
        setBackground(isDay ? clear_weather : nightclear_weather);
        break;
      case "Clouds":
        setBackground(isDay ? sunnyclouds_weather : nightclouds_weather);
        break;
      case "Rain":
        setBackground(isDay ? rainy_weather : nightrain_weather);
        break;
      case "Snow":
        setBackground(isDay ? snowy_weather : nightsnow_weather);
        break;
      case "Thunderstorm":
        setBackground(stormyrain_weather);
        break;
      default:
        setBackground(default_background);
    }
  };

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&appid=3785054b94ae01a22e43c8ddd9099e8b&units=metric`;
      axios.get(url).then((response) => {
        const data = response.data;
        const city = data.city;
        const forecast = data.list;
        const filteredForecasts = forecast.filter(
          (_, index) => index % 8 === 0
        );
        setWeatherData({ city, forecast, forecasts: filteredForecasts });
        updateBackground(forecast[0]);
      });
    }
  };

  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = new Date().getDay();
    return days[currentDay];
  };
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const convertUnixToTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (!weatherData.city || !weatherData.forecast || !weatherData.forecasts) {
    //if no weather data is available return input and show no data available
    return (
      <div className="container-fluid d-flex flex-column align-items-center justify-content-evenly h-100 w-100">
        <input
          className="input-location d-flex focus-ring rounded-3 text-primary text-center p-1"
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyDown={searchLocation}
          placeholder="Enter Location"
        />
        <div>No weather data available</div>
      </div>
    );
  }

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-around h-100 w-100">
      <div className="mb-5">
        <input
          className="input-location d-flex focus-ring rounded-3 text-primary text-center p-1 "
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyDown={searchLocation}
          placeholder="Enter City"
        />
      </div>
      <img
        className="img-background position-absolute h-100 w-100"
        src={background}
        alt="img-background"
      ></img>
      <div className="location-info d-flex flex-column gap-1  justify-content-center">
        <div className="d-flex justify-content-center">
          <h1 className="text-center text-light">{weatherData.city.name}</h1>
          <h1 className="text-center text-light ">
            {","}
            {weatherData.city.country}
          </h1>
        </div>
        <div>
          <p className="text-center text-light fs-6">
            <span>{getCurrentDay()},</span>
            <span> {getCurrentDate()}</span>
            <span>, </span>
            <span>{getCurrentTime()}</span>
          </p>
        </div>
      </div>
      <div className="container w-100 d-flex justify-content-between">
        <div>
          <div className="text-light">
            {weatherData.forecast[0] && (
              //if weatherdata exists render the jsx below.
              <p className="fs-4">
                {weatherData.forecast[0].main.temp.toFixed()}°C
              </p>
            )}
          </div>
          <div className="text-light d-flex">
            {weatherData.forecast[0] && (
              <p className="fs-4">{weatherData.forecast[0].weather[0].main}</p>
            )}
          </div>
        </div>
        <div className="text-light ">
          {weatherData.city.sunrise && weatherData.city.sunset && (
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <WiSunrise size={36} className="icons" />
                <div className="d-flex flex-column">
                  <span className="fs-6">Sunrise:</span>
                  <span className="fs-6">
                    {convertUnixToTime(weatherData.city.sunrise)}
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <WiSunset size={36} className="icons" />
                <div className="d-flex flex-column">
                  <span className="fs-6">Sunset:</span>
                  <span className="fs-6">
                    {convertUnixToTime(weatherData.city.sunset)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container d-flex justify-content-start align-items-center gap-3">
        <div className="humidity text-light">
          {weatherData.forecast[0] && (
            <>
              <div className="d-flex flex-column justify-content-center align-items-center ">
                <div className="icons-parent">
                  <WiHumidity size={24} className="icons" />
                </div>
                <p className="fs-6">Humidity</p>{" "}
                <p className="fs-6">{forecast[0].main.humidity.toFixed()}%</p>
              </div>
            </>
          )}
        </div>
        <div className="text-light">
          {weatherData.forecast[0] && (
            <>
              <div className="d-flex flex-column justify-content-center align-items-center ">
                <div className="icons-parent">
                  <WiStrongWind size={24} className="icons" />
                </div>
                <p className="fs-6">Wind</p>{" "}
                <p className="fs-6">
                  {weatherData.forecast[0].wind.speed.toFixed()} km/h
                </p>
              </div>
            </>
          )}
        </div>
        <div className="text-light">
          {weatherData.forecast[0] && (
            <>
              <div className="d-flex flex-column justify-content-center align-items-center ">
                <div className="icons-parent">
                  <WiThermometerExterior size={24} className="icons" />
                </div>
                <p className="fs-6">Feel</p>{" "}
                <p className="fs-6">
                  {weatherData.forecast[0].main.feels_like.toFixed()}°C
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="container">
        <div className="d-flex justify-content-start  w-100">
          <Button
            className="btn-dark cursor-pointer d-flex justify-content-center align-items-center"
            onClick={() => navigate("/forecast", { state: { ...weatherData } })}
          >
            Forecasts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Weather;
