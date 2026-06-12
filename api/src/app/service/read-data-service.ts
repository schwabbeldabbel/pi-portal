import { FlatWidgetData, WeatherData } from "shared-data";
import { AppDataSource } from "../../data-source";
import { PvEntity } from "../../entities/PvEntity";
import { mapPvEntityToFlatWidgetData, mapWeatherEntityToDetailedWeatherData, mapWeatherEntityToFlatWidgetData } from "./mapper";
import { WeatherEntity } from "../../entities/WeatherEntity";

export class ReadDataService {

    async readData(): Promise<FlatWidgetData[]> {
        const widgetData: FlatWidgetData[] = [];
        await this.readPvRepo(widgetData);
        await this.readWeatherRepo(widgetData);
        return widgetData;
    }

    async readWeatherDetailedData(): Promise<WeatherData[]> {
        const weatherRepository = AppDataSource.getRepository(WeatherEntity);
        const weatherData = await weatherRepository
            .createQueryBuilder('weather')
            .orderBy('weather.measuredAt', 'DESC')
            .getMany();
        return mapWeatherEntityToDetailedWeatherData(weatherData);
    }

    private async readPvRepo(widgetData: FlatWidgetData[]) {
        const pvRepository = AppDataSource.getRepository(PvEntity);

        const pvData = await pvRepository
            .createQueryBuilder('pv')
            .orderBy('pv.createdAt', 'DESC')
            .getOne();

        if (pvData) {
            widgetData.push(mapPvEntityToFlatWidgetData(pvData));
        }
    }

    private async readWeatherRepo(widgetData: FlatWidgetData[]) {
        const weatherRepository = AppDataSource.getRepository(WeatherEntity);

        const weatherData = await weatherRepository
            .createQueryBuilder('weather')
            .orderBy('weather.createdAt', 'DESC')
            .getOne();

        if (weatherData) {
            widgetData.push(mapWeatherEntityToFlatWidgetData(weatherData));
        }
    }
}
