import React, { PropsWithChildren } from 'react'
import Summary from '../weather-summary/weather-summary'
import Grid from '../grid'

interface Props extends PropsWithChildren {
  weatherData: WeatherDataObject
}

export default function DefaultForecast(props:Props) {

  const weatherData = props.weatherData

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