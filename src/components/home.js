import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [error, setError] = useState(null);
  const api_key = "f73fbc8ebe1f5a16188a18c7e19fff69";

  const navigate = useNavigate();
  const handleNav = () => {
    navigate('/privacy')
  }
  
  // Fetch weather data from local storage
  const loadCachedData = () => {
    const cachedWeather = localStorage.getItem("weather");
    const cachedForecast = localStorage.getItem("forecast");
    if (cachedWeather) {
      setWeather(JSON.parse(cachedWeather));
    }
    if (cachedForecast) {
      setForecast(JSON.parse(cachedForecast));
    }
  };

  useEffect(() => {
    loadCachedData();
    handleGeolocation();
  }, []);

  useEffect(() => {
    if (lat && long) {
      fetchCurrentWeather(lat, long);
      fetchForecastByCoords(lat, long);
      const intervalId = setInterval(() => {
        fetchCurrentWeather(lat, long);
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [lat, long]);

  const fetchCurrentWeather = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`
      );
      const info = await response.json();

      if (response.ok) {
        setWeather({
          location: info.name,
          temperature: info.main.temp,
          feels_like: info.main.feels_like,
          temp_min: info.main.temp_min,
          temp_max: info.main.temp_max,
          pressure: info.main.pressure,
          humidity: info.main.humidity,
          wind_speed: info.wind.speed,
          wind_deg: info.wind.deg,
          visibility: info.visibility,
          description: info.weather[0].description,
          icon: info.weather[0].icon,
        });

        // Save to local storage
        localStorage.setItem("weather", JSON.stringify({
          location: info.name,
          temperature: info.main.temp,
          feels_like: info.main.feels_like,
          temp_min: info.main.temp_min,
          temp_max: info.main.temp_max,
          pressure: info.main.pressure,
          humidity: info.main.humidity,
          wind_speed: info.wind.speed,
          wind_deg: info.wind.deg,
          visibility: info.visibility,
          description: info.weather[0].description,
          icon: info.weather[0].icon,
        }));
        setError(null);
      } else {
        setError(info.message || "Something went wrong. Please try again.");
        setWeather({});
      }
    } catch (error) {
      setError("Failed to fetch Weather Data. Please Try Again.");
      setWeather({});
    }
  };

  const fetchForecastByCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`
      );
      const info = await response.json();

      if (response.ok) {
        const limitedForecast = info.list.slice(0, 5);
        setForecast(limitedForecast);

        // Save to local storage
        localStorage.setItem("forecast", JSON.stringify(limitedForecast));
        setError(null);
      } else {
        setError(info.message || "Something went wrong. Please try again.");
        setForecast([]);
      }
    } catch (error) {
      setError("Failed to fetch Forecast Data. Please Try Again.");
      setForecast([]);
    }
  };

  const fetchCurrentWeatherByLocation = async (location) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${api_key}&units=metric`
      );
      const info = await response.json();

      if (response.ok) {
        setWeather({
          location: info.name,
          temperature: info.main.temp,
          feels_like: info.main.feels_like,
          temp_min: info.main.temp_min,
          temp_max: info.main.temp_max,
          pressure: info.main.pressure,
          humidity: info.main.humidity,
          wind_speed: info.wind.speed,
          wind_deg: info.wind.deg,
          visibility: info.visibility,
          description: info.weather[0].description,
          icon: info.weather[0].icon,
        });
        
        // Save to local storage
        localStorage.setItem("weather", JSON.stringify({
          location: info.name,
          temperature: info.main.temp,
          feels_like: info.main.feels_like,
          temp_min: info.main.temp_min,
          temp_max: info.main.temp_max,
          pressure: info.main.pressure,
          humidity: info.main.humidity,
          wind_speed: info.wind.speed,
          wind_deg: info.wind.deg,
          visibility: info.visibility,
          description: info.weather[0].description,
          icon: info.weather[0].icon,
        }));
        setError(null);
      } else {
        setError(info.message || "Something went wrong. Please try again.");
        setWeather({});
      }
    } catch (error) {
      setError("Failed to fetch Weather Data. Please Try Again.");
      setWeather({});
    }
  };

  const handleSearch = async () => {
    if (!location) return;
    await fetchCurrentWeatherByLocation(location);
    fetchForecast(location);
  };

  const fetchForecast = async (location) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${api_key}&units=metric`
      );
      const info = await response.json();

      if (response.ok) {
        const limitedForecast = info.list.slice(0, 5);
        setForecast(limitedForecast);

        // Save to local storage
        localStorage.setItem("forecast", JSON.stringify(limitedForecast));
        setError(null);
      } else {
        setError(info.message || "Something went wrong. Please try again.");
        setForecast([]);
      }
    } catch (error) {
      setError("Failed to fetch Forecast Data. Please Try Again.");
      setForecast([]);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        () => setError("Failed to get your current location.")
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="home-container">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter a location"
        className="location-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
      <button onClick={handleGeolocation} className="location-button">
        Use Current Location
      </button>
      <button onClick={handleNav} className="location-button">Privacy & Policies</button>
      {error && <p className="error">{error}</p>}

      {weather.location && (
        <div className="current-weather">
          <h2>{weather.location}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="weather-icon"
          />
          <div className="info-container">
            <p>Temperature: {weather.temperature}°C</p>
            <p>Feels Like: {weather.feels_like}°C</p>
            <p>Min Temp: {weather.temp_min}°C</p>
            <p>Max Temp: {weather.temp_max}°C</p>
            <p>Pressure: {weather.pressure} hPa</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind Speed: {weather.wind_speed} m/s</p>
            <p>Wind Direction: {weather.wind_deg}°</p>
            <p>Visibility: {weather.visibility} m</p>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-weather">
          <h3>5-Day Forecast</h3>
          {forecast.map((item, index) => (
            <div key={index} className="forecast-item">
              <h4>{new Date(item.dt * 1000).toLocaleDateString()}</h4>
              <p>Temp: {item.main.temp}°C</p>
              <p>Description: {item.weather[0].description}</p>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
              />
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}

export default Home;
