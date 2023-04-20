import React, { EventHandler } from 'react'
import Grid from '../grid'
import { useState, useEffect, useRef } from 'react'
import Summary from '../weather-summary/weather-summary'
import Hourly from '../hourly-forecast'
import Extended from '../extended-forecast'
import DefaultForecast from '../default-forecast'
import { getWeatherDataFromAddress, getWeatherAutomatic, getDefaultWeather } from '../../weather-api/weather-api'
import helpers from '../../utils/helpers.js'
import responsive from '../responsive/responsive'

export default function CurrentConditions() {

  let addressInputElement = useRef(document.createElement('input'))
  let numDaysInputElement = useRef(document.createElement('input'))

  // let [sr, ssr ] = useState<definition | undefined | GenericObject>(undefined)

  let [ weatherData, _setWeatherData ] = useState<WeatherDataObject|GenericObject>({})
  let [ activeForecast, setActiveForecast ] = useState('default')
  let [ address, setAddress ] = useState('')
  let errorMsg = useRef(document.createElement('div'))
  let setErrorMsg = (val:string) => errorMsg.current.innerText=val

  async function fetchWeatherData(_address:string=address):Promise<WeatherDataObject> {
    console.log('fetching weather data for '+_address)
    try {
      let _weatherData:any
      if (!weatherData.forecast && !_address) {
        _weatherData = await getWeatherAutomatic()
      } else if (_address) { 
        _weatherData = await getWeatherDataFromAddress(_address)
      } else if (weatherData.forecast) {
        _weatherData = weatherData
      }
      if (activeForecast === 'default' || !_weatherData.defaultWeather) {
        let defaultWeather = await getDefaultWeather()
        if (defaultWeather) {
          _weatherData.defaultWeather = defaultWeather
        }
      }
      return _weatherData
    }
    catch {
      let err = `Our spy drones have encountered difficulty processing your request.
      You might try double-checking the address entered, or try again at another time.`
      setErrorMsg(err)
      throw new Error(err)
    }
  }

  async function setWeatherData(weatherData:WeatherDataObject) {
    weatherData.hourly = await weatherData.getHourly()
    weatherData.currentConditions = await weatherData.getCurrentConditions()
    weatherData.county = await weatherData.getCounty()
    _setWeatherData({...weatherData})
  }

  useEffect(() => {
    fetchWeatherData()
      .then(data => setWeatherData(data)).catch(err => console.error(err))
  }, [])

  const hours = new Date().getHours()
  let timeOfDay = hours > 6 && hours < 20 ? 'day' : 'night'
  
  function showHourlyHandler() {
    setActiveForecast('hourly')
  }

  function showSevenDayHandler() {
    if (weatherData.sevenDay) {
      _setWeatherData({...weatherData,forecast:weatherData.sevenDay})
    }
    setActiveForecast('extended')
  }

  async function refreshHandler() {
    try {
      let weather = await fetchWeatherData()
      setWeatherData(weather)
    } catch(err) {
      console.error(err)
    }
  }

  function addressFocusHandler() {
    setErrorMsg('')
    addressInputElement.current.value = ''
    // setAddress('')
  }

  async function numDaysInputHandler(event:React.MouseEvent<HTMLElement>) {
    event.preventDefault()
    const numDaysInput = +numDaysInputElement.current.value.trim() || 7
    try {
      let response = await fetchWeatherData(address)
      let days = await response.getExtended(numDaysInput)
      response.forecast = days
      await setWeatherData(response)
      setActiveForecast('extended')
      numDaysInputElement.current.value = ''
    }
    catch(err) {
      console.error(err)
      numDaysInputElement.current.value = ''
    }
  } 

  async function addressHandler(event:React.MouseEvent<HTMLElement>) {
    event.preventDefault()
    console.log('h3y')
    const addressInput = addressInputElement.current.value.trim()
    const numDays = numDaysInputElement.current.value.trim()
    if (helpers.validateAddress(addressInput)) {
      try {
        let response:WeatherDataObject = await fetchWeatherData(addressInput)
        if (numDays && !isNaN(+numDays)) {
          numDaysInputElement.current.value = ''
          let days = await response.getExtended(+numDays)
          response.forecast = days
          setActiveForecast('extended')
        } 
        setAddress(addressInputElement.current.value)
        setWeatherData(response)
        addressInputElement.current.value = ''
      }
      catch(err) {
        console.error(err)
        addressInputElement.current.value = ''
      }
    }
    else {
      setErrorMsg('Address should be in the format: [street address], [city], [state abbr], [zip]')
    }
  }

  const HeaderDefault = () => (
    <>
    <div className="semiLarge">
      <div>Your Weather Conditions</div>
      <img src="/weatherDefault.png" style={{height:"100px"}} />
      <div>By the hour, or Seven-day</div>
    </div>
    </>
  )

  const Header = () => (
    <div className="semiLarge">{weatherData.county.name} County</div>
  )

  let jsx = () => (
    <>
    <div id="featuredConditions">

      <div id="currentLocalConditions" className={"featured theme-"+timeOfDay}>
        { weatherData.county ? <Header /> : <HeaderDefault /> }
        { weatherData.currentConditions &&
          <>
          <Summary conditions={weatherData.currentConditions} />
          <Grid columns={3} breakpoints={{ 482: 1 }}>
            <div><button onClick={showHourlyHandler}>Show Hourly</button></div>
            <div><button onClick={showSevenDayHandler}>Show Seven Day</button></div>


            <form id="showNumDaysForm" className="">
              <div className="columns two-columns">
                <div className="column right-justify">
                  <input type="text" placeholder='enter number of days' ref={numDaysInputElement}/>
                </div>
                <div className="column left-justify">
                  <button type="submit" onClick={numDaysInputHandler}>Show Extended Forecast</button>
                </div>
              </div>
            </form>


            <div><button onClick={refreshHandler}>Refresh</button></div>
          </Grid>
          </>
        }
      </div>

      <form id="addressForm" className="callout">
        <div className="columns two-columns">
          <div className="column right-justify">
            <input type="text" placeholder='[Street Address], [City], [State Abbr] [Zip]' onFocus={addressFocusHandler} ref={addressInputElement}/>
          </div>
          <div className="column left-justify">
            <button type="submit" onClick={addressHandler}>Get the Weather</button>
          </div>
        </div>
      </form>

    </div>
    <div id="error" ref={errorMsg}></div>
    <div id="weatherGrid">
      { activeForecast === 'hourly' && weatherData.hourly && <Hourly periods={weatherData.hourly} attributes={{id: "hourlyConditions", className: "forecast"}} /> }
      { activeForecast === 'extended' && weatherData.forecast && <Extended forecast={weatherData.forecast} attributes={{id: "ExtendedForecast", className:"forecast"}} /> }
      { activeForecast === 'default' && weatherData.defaultWeather && <DefaultForecast weatherData={weatherData.defaultWeather} /> }
    </div>

    </>
  )
  let WeatherConditions = responsive(jsx,{addClasses:true})
  return <WeatherConditions />
}