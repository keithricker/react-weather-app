import React, { ReactNode, useEffect, useRef } from 'react'
import Grid from '../grid'
import weatherIcons from '../../utils/weather-icons'

interface PropsWithChildren {
  children?: ReactNode;
  conditions: Period;
}

export default function Summary(props:PropsWithChildren) {
  const conditions = props.conditions
  const shortForecast = conditions.shortForecast
  const shortForecastLC = shortForecast.toLowerCase()
  const icons = conditions.isDaytime === true ? weatherIcons.day : weatherIcons.evening
  const gridRef = useRef(document.createElement('div'))

  let matchIndex:number = Object.keys(icons).indexOf(shortForecastLC)
  let match = Object.values(icons)[matchIndex]

  const weatherIcon:string = match || icons.default
  function formatTime(ts:string) {
    let timeSplit = new Date(ts).toLocaleTimeString().split(":")
    let hour = timeSplit[0]
    let amPm = timeSplit[2].split(' ')[1]
    return hour+' '+amPm
  }

  const chanceOfPrecip = conditions.probabilityOfPrecipitation.value || '0'
  const windSpeed = conditions.windSpeed || '0'
  const style = { overflow:"hiden", height:"0px", transition:"height 0.4s" }

  useEffect(() => {
    let gridHeight = gridRef.current.scrollHeight
    gridRef.current.style.height = gridHeight.toString() + "px"
  })

  return (
    <>
    <div className="summaryHead summaryTime">
      <strong>
        { formatTime(conditions.startTime) }
      </strong>
    </div>
    <div ref={gridRef} className="weatherSummary" style={style}>

      <Grid columns={3}>
        <div>
          <div className="summaryTemp large">
            <Grid columns={2}>
              <div className="conditions-temp large">
                { conditions.temperature+'°' }
              </div>
              <div className="weather-icon">
                <img src={weatherIcon} />
              </div>
            </Grid>
          </div>
          <div className="summaryShortForecast">
            <div><strong>{ conditions.shortForecast }</strong></div>
          </div>
        </div>

        <div className="summaryPrecip">
          <span className="mostlyLarge">{ chanceOfPrecip+'%' }</span>
          <div><strong>Chance of Precipitation</strong></div>
        </div>

        <div className="summaryWindSpeed">
          <span className="mostlyLarge">{ windSpeed }</span>
          <div><strong>Wind Speed</strong></div>
        </div>  
                  
      </Grid>
    </div>
    </>
  )
}