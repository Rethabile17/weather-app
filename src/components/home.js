import React, { useState, useEffect } from 'react';

function Home() {
    const [weather, setWeather] = useState({});
    const [forecast, setForecast] = useState([]);
    const [location, setLocation] = useState("");
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [error, setError] = useState(null);
    const [nearbyCities, setNearbyCities] = useState([]);
    const api_key = "f73fbc8ebe1f5a16188a18c7e19fff69";

    useEffect(() => {
        if (lat && long) {
            fetchCurrentWeather(lat, long);
            fetchNearbyCities(lat, long);
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
                    icon: info.weather[0].icon 
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

    const fetchForecast = async (location) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${api_key}&units=metric`
            );
            const info = await response.json();

            if (response.ok) {
                setForecast(info.list);
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

    const fetchNearbyCities = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/box/city?bbox=${longitude - 0.1},${latitude - 0.1},${longitude + 0.1},${latitude + 0.1},10&appid=${api_key}`
            );
            const info = await response.json();

            if (response.ok) {
                setNearbyCities(info.list);
                setError(null);
            } else {
                setError(info.message || "Something went wrong. Please try again.");
                setNearbyCities([]);
            }
        } catch (error) {
            setError("Failed to fetch Nearby Cities. Please Try Again.");
            setNearbyCities([]);
        }
    };

    const handleSearch = async () => {
        if (!location) return;

        fetchCurrentWeather(lat, long);
        fetchForecast(location);
    };

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    setLat(position.coords.latitude);
                    setLong(position.coords.longitude);
                },
                error => {
                    setError("Failed to get your current location.");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleGeolocation}>Use Current Location</button>
            {error && <p className="error">{error}</p>}

            {weather.location && (
                <div className='H'>
                    <h2 id="location">{weather.location}</h2>
                    {weather.icon && (
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                            alt={weather.description}
                            className="weather-icon"
                        />
                    )}
                    <p>temperature : {weather.temperature}°C</p>
                    <p>feels_like : {weather.feels_like}°C</p>
                    <p>temp_min : {weather.temp_min}°C</p>
                    <p>temp_max : {weather.temp_max}°C</p>
                    <p>pressure : {weather.pressure} hPa</p>
                    <p>humidity : {weather.humidity}%</p>
                    <p>wind_speed : {weather.wind_speed} m/s</p>
                    <p>wind_deg : {weather.wind_deg}°</p>
                    <p>visibility : {weather.visibility} m</p>
                </div>
            )}

            {forecast.length > 0 && (
                <div>
                    <h3>5-Day Forecast</h3>
                    {forecast.map((item, index) => (
                        <div key={index}>
                            <h4>{new Date(item.dt * 1000).toLocaleDateString()}</h4>
                            <p>Temperature: {item.main.temp}°C</p>
                            <p>Description: {item.weather[0].description}</p>
                            <img
                                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                alt={item.weather[0].description}
                            />
                        </div>
                    ))}
                </div>
            )}

            {nearbyCities.length > 0 && (
                <div>
                    <h3>Nearby Cities</h3>
                    {nearbyCities.map((city, index) => (
                        <div key={index}>
                            <h4>{city.name}</h4>
                            <p>Temperature: {city.main.temp}°C</p>
                            <p>Description: {city.weather[0].description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
