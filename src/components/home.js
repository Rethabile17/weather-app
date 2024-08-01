import React, {useState} from 'react'

function Home() {
    const [weather, setWeather] = useState([]);
    const [location, setLocation] = useState("");
    const [error, setError] = useState(null);
    const api_key = "f73fbc8ebe1f5a16188a18c7e19fff69";

    const handleSearch = async () => {
        if (!location) return;
    
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${api_key}&units=metric`
          );
          const info = await response.json();
          console.log(info);
    
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
            });
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
    
  return (

    <div>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
        {error && <p className="error">{error}</p>}

        {weather.location && (
          <div className='H'>
          <h2 id="location">{weather.location}</h2> 
          <p>temperature :{weather.temperature}°C</p>
          <p>feels_like : {weather.feels_like}°C</p>
          <p>temp_min : {weather.temp_min}°C</p>
          <p>temp_max : {weather.temp_max}°C</p>
          <p>pressure : {weather.pressure} hPa</p>
          <p>humidity : {weather.humidity}%</p>
          <p> wind_speed : {weather.wind_speed} m/s</p>
          <p>wind_deg : {weather.wind_deg}°</p>
          <p>visibility : {weather.visibility} m</p>
          </div>
        )}
    </div>
  )
}

export default Home