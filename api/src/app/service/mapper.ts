import { FlatWidgetData, WidgetType } from "shared-data";
import { PvEntity } from "../../entities/PvEntity";
import { WeatherEntity } from "../../entities/WeatherEntity";

export function mapPvEntityToFlatWidgetData(pvData: PvEntity): FlatWidgetData {
    const widgetData = new FlatWidgetData();
    widgetData.type = WidgetType.PV;
    widgetData.data = [
        {key: 'Power', value: pvData.power + " mW" || null},
        {key: 'Voltage', value: pvData.voltage + " mV" || null},
        {key: 'Current', value: pvData.current + " mA" || null},
        {key: 'Source', value: pvData.source || null},
    ];
    widgetData.source = pvData.source;
    return widgetData;
}

export function mapWeatherEntityToFlatWidgetData(weatherData: WeatherEntity): FlatWidgetData {
    const widgetData = new FlatWidgetData();
    widgetData.type = WidgetType.WEATHER;
    widgetData.data = [
        {key: 'Temperature', value: weatherData.temperature + "°C" || null},
        {key: 'Humidity', value: weatherData.humidity + "%" || null}
    ];
    widgetData.source = weatherData.source;
    return widgetData;
}

