import React from 'react'
import Summary from '../weather-summary/weather-summary'
import Grid from '../grid'
import helpers from '../../utils/helpers'

function Day(prps:{day:string, periods:Periods}){
  const { day, periods } = prps
  const dayOfTheWeek = helpers.capitalize(day)

  return (
    <div className="weatherGridRowWrapper" key={"Extended-grid-day-"+day} >
      <div className="gridRow">
        <p><strong className="semiLarge">{dayOfTheWeek}</strong></p>

        <Grid columns={2} breakpoints={{768:1}}>
          {Object.keys(periods).map((timeOfDay) => (

            <div className="block gridBlock dayBlock" key={"dayBlock-"+dayOfTheWeek+'-'+timeOfDay+1}>
              <strong className="summaryHead">{helpers.capitalize(timeOfDay)}</strong>
              <Summary conditions={periods[timeOfDay]} />
            </div>

          ))}
        </Grid>

      </div>
    </div>
  )
}

export default function ExtendedForecast(props:{attributes:GenericObject,forecast:Extended}) {
  const {attributes, forecast} = props
  const daysOfWeek = Object.keys(forecast)
  let lastDay = daysOfWeek[daysOfWeek.length-1]
  lastDay = lastDay.charAt(0).toUpperCase()+ lastDay.slice(1)

  return (
    <div {...attributes}>
      <p><strong className="semiLarge">Your Extended Forecast (through {lastDay})</strong></p>
        {
          // Display each day of the week as it's own row
          daysOfWeek.map(day => (

            <Day day={day} periods={forecast[day]} />

          ))
        }
    </div>
  )
}