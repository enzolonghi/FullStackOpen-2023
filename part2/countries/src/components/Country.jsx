import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({countries, setFunction}) => {
    const clickButtonHandler = (country) => {
        console.log(country);
        setFunction(country[0])
    }

    if (Object.keys(countries).length > 10) {
        return (
            <div>
                To many countries to show
            </div>
        );
    } else if (Object.keys(countries).length === 1){
        return (
            <Country country={Object.values(countries)[0][0]}/>
        )
    }
    return (
        <div>
            <ul>
            {countries.map(country =>{
          return(
            <p key={country}>
                {country}
                <button onClick={() => clickButtonHandler(country)}>show</button>
            </p>
            )
            }
          )
        }
            </ul>
        </div>
    )
} 

const Country = ({country}) => {
    const [countryData, setCountryData] = useState(null)
    const [weatherData, setWeatherData] = useState(null)
    const api_key = import.meta.env.VITE_SOME_KEY
    
    useEffect(() => {
        axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
        .then((response) => {
            setCountryData(response.data)
        })

    }, [])
    useEffect(() => {
        if(countryData) {
            axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${countryData['capitalInfo']['latlng'][0]}&lon=${countryData['capitalInfo']['latlng'][1]}&appid=${api_key}`)
            .then(response => { 
                setWeatherData(response.data)
            })
        }
    }, [countryData])

    if (!countryData || !weatherData){
        return(
            <div> Waiting...</div>
        )
    } else {
        
        return (
            <div>
                <h1>{countryData.name.common}</h1>
                <br />
                <p>Capital: {countryData.capital[0]}</p>
                <p>Area: {countryData.area} km2</p>
                <p>Lenguages</p>
                <ul>
                    {Object.values(countryData.languages).map(language => {
                        return (
                            <li key={language}>{language}</li>
                        )
                    })}
                </ul>
                <img src={countryData.flags.png} alt="country flag" />
                <h2>Weather Data</h2>
                <p>Temperature: {(weatherData['main']['temp'] - 273).toFixed(2)} Celcius</p>
                <p>Weather: {weatherData['weather'][0]['description']}</p>
                <img src={`https://openweathermap.org/img/wn/${weatherData['weather'][0]['icon']}@2x.png`} alt="weather image" />
                <p>Wind: {weatherData['wind']['speed']} m/s</p>
            </div>
        )
    }


}

export default Countries;