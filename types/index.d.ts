/* Globally available types and interfaces go here */

type GenericObject = { [key: string]: any }

interface Period {
  detailedForecast: string;
  isDaytime: boolean;
  name: string;
  number: number;
  probabilityOfPrecipitation:{value:number,[key?:string]: any};
  shortForecast: string;
  startTime: string;
  temperature: number;
  windSpeed: string;
  [key?:string]: any
}

interface Periods {
  [key?:string]: Period
}

interface County {
  name: string;
  state: string;
}

interface City {
  city: string
  getWeatherData(): Promise<Extended>
}

interface Cached {
  nearestMetroData?: WeatherDataObject;
  county?: County;
  nearestMetro?: City;
}

interface forecastResult {
  properties: { periods: Period[] };
  [key?:string]: any;
}

interface DayOfWeek {
  day?: Period;
  evening: Period;
}

interface Extended {
  [key?:string]: { [key?:string]: Period };
}

type Hourly = Period[]

interface WeatherDataStructure {
  forecast: Extended,
  sevenDay: Extended,
  currentConditions: Period,
  hourly: Period[],
  county: County
  getCurrentConditions(): Promise<Period>;
  getHourly(): Promise<Period[]>;
  getCounty(): Promise<County>;
  getNearestMetro(): Promise<City>;
}

type WeatherDataObject = {
  forecast: Extended;
  sevenDay: Extended
  getCurrentConditions(): Promise<Period>;
  getHourly(): Promise<Period[]>;
  getCounty(): Promise<County>;
  cache: Cached;
  [key?:string]: any
};
