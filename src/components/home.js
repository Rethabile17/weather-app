import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState("");
  const [savedLocations, setSavedLocations] = useState([]); // New state for saved locations
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [isCelsius, setIsCelsius] = useState(true);

  const api_key = "f73fbc8ebe1f5a16188a18c7e19fff69";
  const navigate = useNavigate();

  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = () => {
    const cachedWeather = localStorage.getItem("weather");
    const cachedForecast = localStorage.getItem("forecast");
    const cachedLocations = localStorage.getItem("savedLocations");

    if (cachedWeather) setWeather(JSON.parse(cachedWeather));
    if (cachedForecast) setForecast(JSON.parse(cachedForecast));
    if (cachedLocations) setSavedLocations(JSON.parse(cachedLocations));
  };

  const saveLocation = () => {
    if (!location || savedLocations.includes(location)) return;

    const updatedLocations = [...savedLocations, location];
    setSavedLocations(updatedLocations);
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
  };

  const handleSearch = async () => {
    if (!location) return;

    try {
      await fetchCurrentWeatherByLocation(location);
      await fetchForecast(location);
      saveLocation(); // Save the searched location
    } catch (err) {
      setError("Failed to fetch weather data.");
    }
  };

  const toggleUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemp = (temp) => {
    return isCelsius ? temp : (temp * 9) / 5 + 32;
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

  const fetchForecast = async (location) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${api_key}&units=metric`
      );
      const info = await response.json();

      if (response.ok) {
        const limitedForecast = info.list.slice(0, 5);
        setForecast(limitedForecast);

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

  const selectLocation = (selectedLocation) => {
    setLocation(selectedLocation);
    fetchCurrentWeatherByLocation(selectedLocation);
    fetchForecast(selectedLocation);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

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
      <button onClick={toggleTheme} className="theme-toggle location-button">
        Toggle {theme === "light" ? "Dark" : "Light"} Mode
      </button>
      <button onClick={toggleUnit} className="location-button">
        Show in °{isCelsius ? "F" : "C"}
      </button>
      {error && <p className="error">{error}</p>}

      <div className="saved-locations">
        <h3>Saved Locations:</h3>
        {savedLocations.length === 0 && <p>No saved locations yet.</p>}
        {savedLocations.map((loc, index) => (
          <button
            key={index}
            className="saved-location-button"
            onClick={() => selectLocation(loc)}
          >
            {loc}
          </button>
        ))}
      </div>

      {weather.location && (
        <div className="current-weather">
          <h2>{weather.location}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="weather-icon"
          />
          <p>Temperature: {convertTemp(weather.temperature).toFixed(1)}°{isCelsius ? "C" : "F"}</p>
          <p>Description: {weather.description}</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-weather">
          <h3>5-Day Forecast</h3>
          {forecast.map((item, index) => (
            <div key={index} className="forecast-item">
              <h4>{new Date(item.dt * 1000).toLocaleDateString()}</h4>
              <p>Temp: {convertTemp(item.main.temp).toFixed(1)}°{isCelsius ? "C" : "F"}</p>
              <p>Description: {item.weather[0].description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
