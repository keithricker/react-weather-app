export declare function getWeatherData(lat: number, lon: number): Promise<WeatherDataObject>;
export declare function getWeatherDataFromAddress(address: string): Promise<WeatherDataObject>;
export declare function getWeatherAutomatic(): Promise<WeatherDataObject>;