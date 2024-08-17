import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Home.css";
import default_background from "../img/default_background.png";


const Home = () => {
  const [locationInput, setLocationInput] = useState("");
  const navigate = useNavigate();

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&appid=3785054b94ae01a22e43c8ddd9099e8b&units=metric`;
      axios.get(url).then((response) => {
        const data =response.data
        const forecast = data.list;
        const filteredForecasts = forecast.filter(
          (_, index) => index % 8 === 0
        );
        navigate("/weather", {
          state: {
            city: response.data.city,
            forecast,
            forecasts: filteredForecasts,
          },
        });
      });
    }
  };

  return (
    <div className="home-container h-100 w-100">
      <div className="container d-flex flex-column align-items-center justify-content-center h-100 w-100">
        <img
          src={default_background}
          className="img-background h-100 w-100 position-absolute"
          alt="Weather Background"
        />
        <input
          className="d-inline-flex focus-ring focus-ring-danger py-1 px-2 text-decoration-none border rounded-5 text-center fw-semibold"
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyDown={searchLocation}
          placeholder="Enter City"
        />
      </div>
    </div>
  );
};

export default Home;
