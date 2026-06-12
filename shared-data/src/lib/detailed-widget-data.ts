export interface PvData {
    voltage: number;
    current: number;
    power: number;
    shuntVoltageMv: number;
    source: string;
    measuredAt: string;
}


export interface WeatherData {
    temperature: number;
    apparentTemperature: number;
    precipitation: number;
    cloudCover: number;
    windSpeed: number;
    weatherCode: string;
    source: string;
    measuredAt: string;
}