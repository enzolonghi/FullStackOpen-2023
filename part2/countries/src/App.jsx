import { useState, useEffect } from 'react'
import './App.css'
import Countries from './components/Country'
import axios from 'axios'

function App() {
  const url = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  const [country, setCountry] = useState('')
  const [countriesNames, setCountriesNames] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])
 
  useEffect(()=> {
    axios
    .get(`${url}`)
    .then(
      response => {
        setCountriesNames(response.data.map(country => countriesNames.concat(country.name.common)))
      }
    )
  }, [])

  useEffect(()=>{
    const countries = countriesNames.filter(c => c[0].toLowerCase().includes(country.toLocaleLowerCase()))
    setCountriesToShow(countries)
  }, [country])
   
  const countryHandler = (event) => {
    setCountry(event.target.value)
  }

  return (
    <>
      <p>find countries <input value={country} onChange={countryHandler}></input></p>
      <div>
        <Countries countries={countriesToShow} setFunction={setCountry}/>
      </div>
    </>
  )
}

export default App
