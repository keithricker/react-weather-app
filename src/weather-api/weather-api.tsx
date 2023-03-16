const geocodingApi = import.meta.env.VITE_GEOCODE_API_URL
const weatherApi = import.meta.env.VITE_WEATHER_API_URL

async function fetchJson(endpoint:string): Promise<any> {
  let fetched
  try {
    fetched = await fetch(endpoint)
  } catch(err) {
    console.error(err)
    return { error:err }
  }
  let json = await fetched.json()
  return json
}

let county

export async function getWeatherData(lat: number, lon: number): Promise<WeatherDataObject> {
  if ( !lat || !lon ) {
    throw new Error('Unable to retrieve coordinates.')
  }
  let grid = await fetchJson(`${weatherApi}/${lat},${lon}`)
  if (!grid?.properties) {
    throw new Error('Unable to retrieve weather from the given coordinates.')
  }
  let forecastResult = await fetchJson(grid.properties.forecast)
  let properties = forecastResult.properties
  let periods = [ ...properties.periods]

  let forecast:Extended =  {}

  const daysOfWeek = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
  let tomorrow = periods.find((period: Period) => daysOfWeek.includes(period.name.toLowerCase())).name.toLowerCase()

  periods.forEach((period: Period) => {
    let day = period.name.split(' ')[0]
    if (day.toLowerCase() === tomorrow) {
      period.name = period.name.replace(day,'tomorrow')
      day = 'tomorrow'
    } else if (!daysOfWeek.includes(day.toLowerCase())) {
      day = 'today'
    }
    day = day.toLowerCase()
    period.name = period.name.toLowerCase()
    period.name = period.name.includes('night') ? 'evening' : 'day'

    forecast[day] = forecast[day] || {}
    forecast[day][period.name] = period
  })

  const weatherData: WeatherDataObject = {
    async getCurrentConditions(): Promise<Period> {
      let hourly:Period[] = await this.getHourly()
      return hourly[0]
    },
    forecast: forecast,
    sevenDay: forecast,
    async getHourly(): Promise<Period[]> { 
      let fetchedHourly = await fetchJson(grid.properties.forecastHourly)
      return fetchedHourly.properties.periods
    },
    async getCounty(): Promise<County> { 
      if (this.cache.county?.name) {
        return this.cache.county
      }
      let countyEndpoint = grid.properties.county
      county = await fetchJson(countyEndpoint) 
      this.cache.county =  {
        name: county?.properties?.name,
        state: county?.properties?.state
      }
      return this.cache.county
    },
    async getNearestMetro(): Promise<City> {
      if (this.cache.nearestMetro?.city) {
        return this.cache.nearestMetro
      }
      let nearestMetro = await fetchJson(grid.properties.forecastOffice)
      const self = this
      this.cache.nearestMetro = {
        city: nearestMetro?.city,
        async getWeatherData(): Promise<WeatherDataObject> { 
          if (self.cache.nearestMetroData?.tomorrow) {
            return self.cache.nearestMetroData
          }
          let {streetAddress, addressLocality, addressRegion, postalCode } = nearestMetro?.address
          let fullAddress = streetAddress+', '+addressLocality+', '+addressRegion+', '+postalCode

          self.cache.nearestMetroData = await getWeatherDataFromAddress(fullAddress)
          return self.cache.nearestMetroData
        }
      }
      return this.cache.nearestMetro
    },
    cache:{}
  }
  return weatherData
}

export async function getWeatherDataFromAddress(address: string): Promise<WeatherDataObject>  {
  let fetchedAddress
  let encodedAddress = encodeURIComponent(address)
  let geocodingRequest = `${geocodingApi}?address=${encodedAddress}`

  fetchedAddress = await fetchJson(geocodingRequest);
  if (fetchedAddress.error) {
    throw new Error(fetchedAddress.error)
  }
  let lat = fetchedAddress.lat
  let lon = fetchedAddress.lon

  if (!lat || !lon) {
    throw new Error('Unable to retreive coordinates for the address.')
  }
  let weatherData = await getWeatherData(lat,lon)
  return weatherData
}

export function getWeatherAutomatic() {

  return new Promise(resolver => {

    navigator.geolocation.getCurrentPosition(async (position) => {      

      let theForecast
      if (position && position.coords) {
  
        let lat = position.coords.latitude
        let lon = position.coords.longitude
        theForecast = await getWeatherData(lat,lon)
  
      }
  
      else {
        let address = '4600 Silver Hill Rd, Washington, DC 20233'
        theForecast = await getWeatherDataFromAddress(address)
      }
      resolver(theForecast)
    })
  })

}