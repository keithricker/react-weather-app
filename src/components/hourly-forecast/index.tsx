import React from 'react'
import Summary from '../weather-summary/weather-summary'
import Grid from '../grid'

export default function HourlyForecast(props:{attributes:GenericObject,periods:Period[]}) {
  const {attributes, periods} = props

  const weatherToday:Period[] = []
  const weatherTomorrow:Period[] = []

  let today = new Date(periods[0].startTime).getDay()
  let tomorrow = today+1
  let conditions = periods[0]
  let todayOrTonight = conditions.isDaytime ? "Today" : "Tonight"
  
  periods.some((period:Period) => {
    let day = new Date(period.startTime).getDay()
    if (day === today) {
      weatherToday.push(period)
    }
    else if (day === tomorrow) {
      weatherTomorrow.push(period)
    } else {
      return true
    }
    return false
  })

  const Day = (prps:{header:string,day:Period[]}) => {
    const {header, day} = prps
    return (
      <div className="weatherGridRowWrapper" key={"hourlyWeather-day-"+header}>
        <div className={"gridRow hourly-grid-"+header}>
          <p><strong className="semiLarge">{header}</strong></p>

          <Grid columns={2} breakpoints={{768: 1}}>
            {day.map((period,index) => (

              <div className="block gridBlock hourBlock" key={"hourBlock-"+header+"-"+index+1}>
                <Summary conditions={period} />
              </div>

            ))}
          </Grid>

        </div>
      </div>
    )
  }
  
  return (
    
    <div {...attributes}>
      <Day header={todayOrTonight} day={weatherToday} />
      <Day header="Tomorrow" day={weatherTomorrow} />
    </div>
  )

}