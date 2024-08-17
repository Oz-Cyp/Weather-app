import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../Forecast.css";
import DailyTemperatureChart from "./DailyTemperatureChart";
import HourlyTemperatureChart from "./HourlyTemperatureChart";
import HourlyWindSpeedChart from "./HourlyWindSpeedChart";
import HourlyPressureChart from "./HourlyPressureChart";
import DailyWindSpeedChart from "./DailyWindSpeedChart";
import DailyPressureChart from "./DailyPressureChart";
import {
  WiDirectionUp,
  WiDirectionUpRight,
  WiDirectionRight,
  WiDirectionDownRight,
  WiDirectionDown,
  WiDirectionDownLeft,
  WiDirectionLeft,
  WiDirectionUpLeft,
} from "react-icons/wi";

const Forecast = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { forecast, forecasts, city } = location.state || {};
  //location object passes state data to weather component.
  const [backgroundClass, setBackgroundClass] = useState("");
  const [labels, setLabels] = useState([]);
  const [hourlyLabels, setHourlyLabels] = useState([]);
  const [DailytemperatureData, setTemperatureData] = useState({
    tempmax: [],
    tempmin: [],
  });
  const [hourlyTemperatureData, setHourlyTemperatureData] = useState([]);
  const [hourlyWindSpeedData, setHourlyWindSpeedData] = useState([]);
  const [dailyWindSpeedData, setDailyWindSpeedData] = useState([]);
  const [hourlyPressureData, setHourlyPressureData] = useState([]);
  const [hourlyWindAngleData, setHourlyWindAngleData] = useState([]);
  const [dailyWindAngleData, setDailyWindAngleData] = useState([]);
  const [showHourlyWind, setShowHourlyWind] = useState(true);
  const [showHourlyPressure, setShowHourlyPressure] = useState([]);
  //state for wind daily-hourly toggle
  const [dailyPressureData, setDailyPressureData] = useState([]);

  useEffect(() => {
    if (forecast) {
      //slice data into 5
      const hourlyTemps = forecast
        .slice(0, 5)
        .map((entry) => Math.floor(entry.main.temp));
      const hourlyLabels = forecast
        .slice(0, 5)
        .map((entry) => formatDateTime(entry.dt_txt));
      const hourlyWindSpeedData = forecast
        .slice(0, 5)
        .map((entry) => Math.floor(entry.wind.speed));
      const hourlyWindAngleData = forecast
        .slice(0, 5)
        .map((entry) => Math.floor(entry.wind.speed));
      const hourlyPressureData = forecast
        .slice(0, 5)
        .map((entry) => entry.main.pressure);
      const groupedWindData = groupByDay(forecast, (entry) => entry.wind.speed);
      const dailyWindSpeedData = Object.values(groupedWindData).map(
        //map groupedwinddata into dayData array
        (dayData) =>
          dayData.reduce((sum, speed) => sum + speed, 0) / dayData.length
        //sum is accumulator for adding all values
      );
      const groupedWindAngleData = groupByDay(
        forecast,
        (entry) => entry.wind.deg
      );
      const dailyWindAngleData = Object.values(groupedWindAngleData).map(
        (dayData) =>
          dayData.reduce((sum, degree) => sum + degree, 0) / dayData.length
      );
      //Average speed for each day by mapping
      const groupedPressureData = groupByDay(
        forecast,
        (entry) => entry.main.pressure
      );
      const dailyPressureData = Object.values(groupedPressureData).map(
        (dayData) =>
          dayData.reduce((sum, pressure) => sum + pressure, 0) / dayData.length
      );
      const groupedTempData = groupByDay(forecast, (entry) => entry.main.temp);
      const { tempmax, tempmin, labels } =
        calculateMaxMinTemps(groupedTempData);
      setHourlyPressureData(hourlyPressureData);
      setHourlyLabels(hourlyLabels);
      setLabels(labels);
      setHourlyTemperatureData(hourlyTemps);
      setTemperatureData({ tempmax, tempmin });
      setHourlyWindSpeedData(hourlyWindSpeedData);
      setHourlyWindAngleData(hourlyWindAngleData);
      setDailyWindAngleData(dailyWindAngleData);
      setDailyWindSpeedData(dailyWindSpeedData);
      setDailyPressureData(dailyPressureData);
      updateBackground(forecast[0]);
    }
  }, [forecast]);

  //seperature forecast data into daily data
  const groupByDay = (forecast, valueExtractor) => {
    //value extractor is the callback func that will be used to extract wind and temp data inside UseEffect hook
    return forecast.reduce((acc, entry) => {
      //iterate every entry into the forecast array into object where key=date
      const date = entry.dt_txt.split(" ")[0];
      if (!acc[date]) {
        acc[date] = [];
        //initialize an empty array if object doesnt have an array for that data if null
      }
      acc[date].push(valueExtractor(entry));
      console.log(`Accumulator after processing ${entry.dt_txt}:`, acc);
      return acc;
    }, {});
    //initial value of the accumulator object is 0
  };

  // Calculate max and min temperatures for each day
  const calculateMaxMinTemps = (groupedData) => {
    const tempmax = [];
    const tempmin = [];
    const labels = [];

    //for each value of grouped data where date is key and temps is the value
    for (const [date, temps] of Object.entries(groupedData)) {
      tempmax.push(Math.floor(Math.max(...temps)));
      tempmin.push(Math.floor(Math.min(...temps)));
      labels.push(date);
    }
    return { tempmax, tempmin, labels };
  };

  // Update background based on temperature
  const updateBackground = (forecastItem) => {
    const temperature = forecastItem.main.temp;
    if (temperature > 24) {
      setBackgroundClass("hot-background");
    } else {
      setBackgroundClass("cold-background");
    }
  };

  if (!city || !forecast || !forecasts) {
    return <div>No forecast data available</div>;
  }

  const formatDateTime = (dt_txt) => {
    const [date, time] = dt_txt.split(" ");
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`;
  };

  const formatDays = (dt_txt) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dt_txt);
    const dayName = days[date.getDay()];
    return dayName.slice(0, 3);
  };

  const getHourlyWindDirectionIcon = (hourlyWindAngle) => {
    if (hourlyWindAngle >= 337.5 || hourlyWindAngle < 67.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">S</span>
          <WiDirectionUp className="icon-style" />
        </div>
      );
    } else if (hourlyWindAngle >= 22.5 && hourlyWindAngle < 67.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">SW</span>
          <WiDirectionUpRight className="icon-style" />
        </div>
      );
    } else if (hourlyWindAngle >= 67.5 && hourlyWindAngle < 112.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">W</span>
          <WiDirectionRight className="icon-style" />
        </div>
      );
    } else if (hourlyWindAngle >= 112.5 && hourlyWindAngle < 157.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">NW</span>
          <WiDirectionDownRight className="icon-style" />
        </div>
      );
    } else if (hourlyWindAngle >= 157.5 && hourlyWindAngle < 202.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">N</span>
          <WiDirectionDown className="icon-style" />
        </div>
      );
    } else if (hourlyWindAngle >= 202.5 && hourlyWindAngle < 247.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">NE</span>
          <WiDirectionDownLeft className="icon-style" />
        </div>
      );
    } else if (hourlyWindAngle >= 247.5 && hourlyWindAngle < 292.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center ">
          <span className="wind-direction-shortcut">E</span>
          <WiDirectionLeft className="icon-style" />
        </div>
      );
    } else if (hourlyWindAngle >= 292.5 && hourlyWindAngle < 337.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">SE</span>
          <WiDirectionUpLeft className="icon-style" />
        </div>
      );
    }
  };
  const getDailyWindDirectionIcon = (DailyWindAngle) => {
    if (DailyWindAngle >= 337.5 || DailyWindAngle < 67.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">S</span>
          <WiDirectionUp className="icon-style" />
        </div>
      );
    } else if (DailyWindAngle >= 22.5 && DailyWindAngle < 67.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">SW</span>
          <WiDirectionUpRight className="icon-style" />
        </div>
      );
    } else if (DailyWindAngle >= 67.5 && DailyWindAngle < 112.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">W</span>
          <WiDirectionRight className="icon-style" />
        </div>
      );
    } else if (DailyWindAngle >= 112.5 && DailyWindAngle < 157.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">NW</span>
          <WiDirectionDownRight className="icon-style" />
        </div>
      );
    } else if (DailyWindAngle >= 157.5 && DailyWindAngle < 202.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">N</span>
          <WiDirectionDown className="icon-style" />
        </div>
      );
    } else if (DailyWindAngle >= 202.5 && DailyWindAngle < 247.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">NE</span>
          <WiDirectionDownLeft className="icon-style" />
        </div>
      );
    } else if (DailyWindAngle >= 247.5 && DailyWindAngle < 292.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center ">
          <span className="wind-direction-shortcut">E</span>
          <WiDirectionLeft className="icon-style" />
        </div>
      );
    } else if (DailyWindAngle >= 292.5 && DailyWindAngle < 337.5) {
      return (
        <div className="icon-wrapper d-flex flex-wrap justify-content-center">
          <span className="wind-direction-shortcut">SE</span>
          <WiDirectionUpLeft className="icon-style" />
        </div>
      );
    }
  };

  return (
    <div
      className={`container-fluid h-100 w-100 p-sm-4 overflow-y-auto ${backgroundClass}`}
    >
      <div className="container ">
        <div className="location-info d-flex gap-1 align-items-center justify-content-center">
          <h2 className="text-center text-light">{city.name}</h2>
          <h2 className="text-center text-light ">
            {","}
            {city.country}
          </h2>
        </div>
        <div className=" row d-block flex-row d-md-flex justify-content-center px-md-4 gap-3">
          <div className="col-md-5">
            <div className="border-bottom">
              <h6 className="text-light d-flex justify-content-start pt-1">
                3 Hour Step Forecast
              </h6>
            </div>
            <div className="row d-flex justify-content-around mb-4">
              {forecast.slice(0, 5).map((entry, index) => (
                <div
                  key={index}
                  className="col-2 d-flex flex-column align-items-center "
                >
                  <p className="forecast-info text-center text-light">
                    {formatDateTime(entry.dt_txt)}
                  </p>
                </div>
              ))}
              <div className="w-100"></div>
              <div className="graph">
                <HourlyTemperatureChart
                  data={hourlyTemperatureData}
                  labels={hourlyLabels}
                />
              </div>

              <div className="w-100"></div>
              {forecast.slice(0, 5).map((entry, index) => (
                <div
                  key={index}
                  className=" col-2 d-flex flex-column align-items-center"
                >
                  <div className="icon-container position-relative inline-block d-flex justify-content-center align-items-end">
                    <p className="weather-icons d-flex justify-content-center align-items-end">
                      <img
                        className="icon-weather"
                        src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
                        alt={entry.weather[0].description}
                      />
                      <span className="tooltip-description d-flex justify-content-center align-items-center">
                        {entry.weather[0].description}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-5">
            <div className="border-bottom">
              <h6 className="text-light d-flex justify-content-start pt-1">
                Daily Forecast
              </h6>
            </div>
            <div className="row d-flex justify-content-around  mb-4">
              {forecasts.slice(0, 5).map((entry, index) => (
                <div
                  key={index}
                  className="col-2 d-flex flex-column align-items-center"
                >
                  <p className="forecast-info text-light">
                    {formatDays(entry.dt_txt)}
                  </p>
                </div>
              ))}

              <div className="w-100"></div>
              <div className="graph">
                <DailyTemperatureChart
                  data={DailytemperatureData}
                  labels={labels.slice(0, 5)}
                />
              </div>
              <div className="w-100"></div>
              {forecasts.slice(0, 5).map((entry, index) => (
                <div
                  key={index}
                  className="col-2 d-flex flex-column align-items-center"
                >
                  <div className="icon-container position-relative inline-block d-flex justify-content-center align-items-end">
                    <p className="weather-icons d-flex justify-content-center align-items-end">
                      <img
                        className="icon-weather"
                        src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
                        alt={entry.weather[0].description}
                      />
                      <span className="tooltip-description">
                        {entry.weather[0].description}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="row d-block flex-row d-md-flex justify-content-center px-md-4 gap-3">
          <div className="col-md-5 pt-1">
            <div className="border-bottom d-flex justify-content-between ">
              <h6 className="text-light d-flex justify-content-start pt-1">
                Wind (km/h)
              </h6>
              <Button
                className="wind-toggle btn-success rounded-1 cursor-pionter d-flex align-items-center justify-content-center"
                onClick={() => setShowHourlyWind(!showHourlyWind)}
              >
                <span className="fs-6 fw-semi-bold text-light">
                  {showHourlyWind ? "Hourly" : "Daily"}
                </span>
              </Button>
            </div>
            <div className="row d-flex justify-content-around mb-4 mb-md-2">
              {showHourlyWind
                ? forecast.slice(0, 5).map((entry, index) => (
                    <div
                      key={index}
                      className="col-2 d-flex flex-column align-items-center "
                    >
                      <p className="forecast-info text-center text-light">
                        {formatDateTime(entry.dt_txt)}
                      </p>
                    </div>
                  ))
                : forecasts.slice(0, 5).map((entry, index) => (
                    <div
                      key={index}
                      className="col-2 d-flex flex-column align-items-center "
                    >
                      <p className="forecast-info text-center text-light">
                        {formatDays(entry.dt_txt)}
                      </p>
                    </div>
                  ))}
              <div className="w-100"></div>
              <div className="graph ">
                {showHourlyWind ? (
                  <HourlyWindSpeedChart
                    data={hourlyWindSpeedData}
                    labels={hourlyLabels}
                  />
                ) : (
                  <DailyWindSpeedChart
                    data={dailyWindSpeedData}
                    labels={labels.slice(0, 5)}
                  />
                )}
              </div>
              <div className="w-100 mt-3"></div>
              {showHourlyWind
                ? hourlyWindAngleData.slice(0, 5).map((angle, index) => (
                    <div
                      key={index}
                      className=" col-2 d-flex flex-col justify-content-center align-items-center"
                    >
                      <div className="">
                        {getHourlyWindDirectionIcon(angle)}
                      </div>
                    </div>
                  ))
                : dailyWindAngleData.slice(0, 5).map((angle, index) => (
                    <div
                      key={index}
                      className=" col-2 d-flex flex-col justify-content-center align-items-center"
                    >
                      <div className="">{getDailyWindDirectionIcon(angle)}</div>
                    </div>
                  ))}
            </div>
          </div>
          <div className="col-md-5 pt-1">
            <div className="border-bottom d-flex justify-content-between col-12 ">
              <h6 className="text-light d-flex justify-content-start pt-1">
                Pressure (Pa)
              </h6>
              <Button
                className="wind-toggle btn-success rounded-1 cursor-pionter d-flex align-items-center justify-content-center"
                onClick={() => setShowHourlyPressure(!showHourlyPressure)}
              >
                <span className="fs-6 fw-semi-bold text-light">
                  {showHourlyPressure ? "Hourly" : "Daily"}
                </span>
              </Button>
            </div>
            <div className="row d-flex justify-content-around mb-4 mb-md-0">
              {showHourlyPressure
                ? forecast.slice(0, 5).map((entry, index) => (
                    <div
                      key={index}
                      className="col-2 d-flex flex-column align-items-center"
                    >
                      <p className="forecast-info  text-center text-light">
                        {formatDateTime(entry.dt_txt)}
                      </p>
                    </div>
                  ))
                : forecasts.slice(0, 5).map((entry, index) => (
                    <div
                      key={index}
                      className="col-2 d-flex flex-column align-items-center "
                    >
                      <p className="forecast-info text-center text-light">
                        {formatDays(entry.dt_txt)}
                      </p>
                    </div>
                  ))}
              <div className="bar-chart">
                {showHourlyPressure ? (
                  <HourlyPressureChart
                    data={hourlyPressureData}
                    labels={hourlyLabels}
                  />
                ) : (
                  <DailyPressureChart
                    data={dailyPressureData}
                    labels={labels.slice(0, 5)}
                  />
                )}
              </div>
              {showHourlyPressure
                ? forecast.slice(0, 5).map((entry, index) => (
                    <div
                      key={index}
                      className="col-2 d-flex flex-column align-items-center "
                    >
                      <div className="icon-container position-relative inline-block d-flex justify-content-center align-items-end">
                        <p className="weather-icons d-flex justify-content-center align-items-end">
                          <img
                            className="icon-weather"
                            src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
                            alt={entry.weather[0].description}
                          />
                          <span className="tooltip-description">
                            {entry.weather[0].description}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                : forecasts.slice(0, 5).map((entry, index) => (
                    <div
                      key={index}
                      className="col-2 d-flex flex-column align-items-center"
                    >
                      <div className="icon-container position-relative inline-block d-flex justify-content-center align-items-end">
                        <p className="weather-icons d-flex justify-content-center align-items-end">
                          <img
                            className="icon-weather"
                            src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
                            alt={entry.weather[0].description}
                          />
                          <span className="tooltip-description">
                            {entry.weather[0].description}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
        <div className="row d-block flex-row d-md-flex justify-content-center px-md-3 gap-3 mt-4">
          <div className="col-5 ">
            <Button
              className="cursor-pointer btn-dark d-flex justify-content-center align-items-center"
              onClick={() =>
                navigate("/weather", { state: { city, forecast, forecasts } })
              }
            >
              <span className="fs-6 fw-bold">Previous</span>
            </Button>
          </div>
          <div className="col-5"></div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
