import React from 'react'
import { useState, useEffect } from 'react'
import Summary from '../weather-summary/weather-summary'
import Grid from '../grid'
import { getWeatherData } from '../../weather-api/weather-api'

export default function DefaultForecast(props:any) {

  interface defaultData {
    nyc: Period,
    la: Period,
    chi: Period
  }

  const [ weatherData, setData ] = useState<defaultData|GenericObject>({})

  useEffect(() => {

    let mounted = true;

    async function getData(): Promise<defaultData> {
      let nyc =  await getWeatherData(40.758896, -73.985130)
      let la = await getWeatherData(34.0522, -118.2437)
      let chi = await (getWeatherData(41.881832, -87.623177))
      let defaultConditions = { 
        nyc: nyc.forecast.today.day || nyc.forecast.today.evening,
        la: la.forecast.today.day || la.forecast.today.evening,
        chi: chi.forecast.today.day || chi.forecast.today.evening
      }
      console.log('default conditions',defaultConditions)
      return defaultConditions
    }

    getData().then(data => { 
      if (mounted) {
        setData(data)
      }
    })
    return () => { mounted = false };
  }, [])

  function Conditions(props:{city:string,conditions:Period}) {
    return (
      <div className="block gridBlock defaultBlock" key={"defaultBlock-"+(props.city).replace(' ','')}>
        <strong className="semiLarge">{props.city}</strong>
        <Summary conditions={props.conditions} />
      </div>
    )
  }
  return (
    <div className="weatherGridRowWrapper" key={"defaultWeather"}>
      <div className={"gridRow default"}>
        <Grid columns={3} breakpoints={{768: 1, 1024: 2}}>
          <div className="block gridBlock defaultBlock" key={"defaultBlock-nyc"}>
            { weatherData.nyc ? <Conditions city="New York City" conditions={weatherData.nyc} /> : <img src="" /> }
          </div>
          <div className="block gridBlock defaultBlock" key={"defaultBlock-la"}>
            { weatherData.la ? <Conditions city="Los Angeles" conditions={weatherData.la} /> : <img src="" /> }
          </div>
          <div className="block gridBlock defaultBlock" key={"defaultBlock-chi"}>
            { weatherData.chi ? <Conditions city="Chicago" conditions={weatherData.chi} /> : <img src="" /> }
          </div>
        </Grid>
      </div>
    </div>
  )
}