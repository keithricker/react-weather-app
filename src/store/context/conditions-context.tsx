import React, { createContext, useState, PropsWithChildren } from 'react'

export const ConditionsContext:WeatherDataObject|GenericObject= createContext({
 weatherData: {},
 activeForecast: '',
 address: '' 
})

export default function ConditionsProvider(props:PropsWithChildren):JSX.Element {

  const [weatherData, _setWeatherData] = useState({})
  const [activeForecast, setActiveForecast] = useState('')
  const [address, setAddress] = useState('')

  const setWeatherData = (newState:GenericObject) => _setWeatherData((oldState) => ({ ...oldState,...newState}) )

  const passedState = {
    weatherData,
    setWeatherData,
    activeForecast,
    setActiveForecast,
    address,
    setAddress
  }

  return (
    <ConditionsContext.Provider value={passedState}>
      {props.children}
    </ConditionsContext.Provider>
  )
}
