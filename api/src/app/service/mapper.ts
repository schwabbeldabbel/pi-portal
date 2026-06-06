import { FlatWidgetData, WidgetType } from "shared-data";
import { PvEntity } from "../../entities/PvEntity";
import { WeatherEntity } from "../../entities/WeatherEntity";

export function mapPvEntityToFlatWidgetData(pvData: PvEntity): FlatWidgetData {
    const widgetData = new FlatWidgetData();
    widgetData.type = WidgetType.PV;
    widgetData.data = [
        {key: 'Power', value: pvData.power + " W" || null},
        {key: 'Voltage', value: pvData.voltage + " V" || null},
        {key: 'Current', value: pvData.current + " A" || null},
        {key: 'Source', value: pvData.source || null},
    ];
    widgetData.source = pvData.source;
    return widgetData;
}

export function mapWeatherEntityToFlatWidgetData(weatherData: WeatherEntity): FlatWidgetData {
    const widgetData = new FlatWidgetData();
    widgetData.type = WidgetType.WEATHER;
    widgetData.data = [
        {key: 'Temperature', value: weatherData.temperature_2m + " °C" || null},
        {key: 'Apparent Temperature', value: weatherData.apparent_temperature + " °C" || null},
        {key: 'Precipitation', value: weatherData.precipitation + " mm" || null},
        {key: 'Cloud Cover', value: weatherData.cloud_cover + " %" || null},
        {key: 'Wind Speed', value: weatherData.wind_speed_10m + " km/h" || null},
        {key: 'Weather Code', value: weatherData.weather_code || null},
    ];
    widgetData.source = weatherData.source;
    return widgetData;
}

