import React, { useEffect, useRef, useState } from "react";
import clear from "../assets/clear.png";
import Search from "../assets/search.png";
import humidity from "../assets/humidity.png";
import cloud from "../assets/cloud.png";
import drizzle from "../assets/drizzle.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import wind from "../assets/wind.png";
import thunder from "../assets/thunder.png";
import mist from "../assets/mist.png";
import "./Weather.css";

const Weather = () => {
  const inputRef = useRef();
  const searchButtonRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [emptyError, setEmptyError] = useState(false);
  const [invalidCityError, SetInvalidCityError] = useState(false);
  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "11d": thunder,
    "11n": thunder,
    "13d": snow,
    "13n": snow,
    "50n": mist,
    "50d": mist,
  };
  const search = async (city) => {
    if (city == "") {
      setEmptyError(true);
      return;
    } else {
      setEmptyError(false);
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        SetInvalidCityError(true);
        return;
      } else {
        SetInvalidCityError(false);
      }
      const icon = allIcons[data.weather[0].icon] || clear;
      const weather_name = data.weather[0].main;

      console.log(icon);
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        weather_name,
      });
    } catch (error) {
      setWeatherData(false);
      console.log("Error in fetching weather data", error);
    }
  };

  useEffect(() => {
    search("Bangalore");
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchButtonRef.current.click();
    }
  };
  return (
    <div className="weather" onKeyDown={handleKeyDown}>
      <div className="search-bar">
        <input
          tabIndex={1}
          type="text"
          placeholder="Search"
          className="search-bar"
          ref={inputRef}
        />        
        <img
          tabIndex={2}
          src={Search}
          alt="search Icon"
          ref={searchButtonRef}
          onClick={() => {
            search(inputRef.current.value);
          }}
        />
      </div>
      {emptyError && <span className="error-field">Enter city</span>}
      {invalidCityError && <span className="error-field">Invalid city</span>}
      {weatherData ? (
        <>
          <img
            src={weatherData.icon}
            alt="Weather Icon"
            className="weather-icon"
          />
          <p className="temperature">{weatherData.temperature}&#8451;</p>
          <p className="location">{weatherData.location}</p>
          <p className="weather-text">It's a {weatherData.weather_name}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity} alt="humidity" />
              <div>
                <p>{weatherData.humidity}</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind} alt="wind" />
              <div>
                <p>{weatherData.windSpeed}Km/h</p>
                <span>WindowSpeed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;
