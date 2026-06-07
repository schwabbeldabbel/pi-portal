import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { WeatherEntity } from '../../entities/WeatherEntity';
import { AppDataSource } from '../../data-source';

@Injectable()
export class WeatherService {
    private readonly logger = new Logger(WeatherService.name);
    private readonly latitude = 52.299172;
    private readonly longitude = 10.542496;
    private readonly timezone = 'Europe/Berlin';
    private readonly weatherRepository = AppDataSource.getRepository(WeatherEntity);

    constructor(private readonly httpService: HttpService) {}

    async fetchAndStoreRecentWeather(): Promise<void> {
        try {
        const data = await this.getRecentWeather();

        if (!data?.minutely_15?.time?.length) {
            this.logger.warn('Weather import skipped: no minutely_15 data returned.');
            return;
        }

        const rows = data.minutely_15.time.map((time: string, i: number) => ({
            measuredAt: new Date(time),
            source: 'open-meteo',
            temperature_2m: data.minutely_15.temperature_2m?.[i] ?? null,
            apparent_temperature: data.minutely_15.apparent_temperature?.[i] ?? null,
            precipitation: data.minutely_15.precipitation?.[i] ?? null,
            cloud_cover: data.minutely_15.cloud_cover?.[i] ?? null,
            wind_speed_10m: data.minutely_15.wind_speed_10m?.[i] ?? null,
            weather_code: data.minutely_15.weather_code?.[i] ?? null,
        }));

        const result = await this.weatherRepository
            .createQueryBuilder()
            .insert()
            .into(WeatherEntity)
            .values(rows)
            .orIgnore()
            .updateEntity(false)
            .execute();

        this.logger.log(`Weather import finished. attempted=${rows.length}`);
        this.logger.debug(
            `identifiers=${result.identifiers.length}, generatedMaps=${result.generatedMaps.length}`,
        );
        } catch (error) {
        const err = error as AxiosError;
        this.logger.error(
            `Weather import failed: code=${err.code ?? 'unknown'} message=${err.message}`,
        );
        }
    }

    async getRecentWeather() {
        const response = await firstValueFrom(
            this.httpService.get('https://api.open-meteo.com/v1/forecast', {
                timeout: 15000,
                params: {
                    latitude: this.latitude,
                    longitude: this.longitude,
                    timezone: this.timezone,
                    models: 'icon_d2',
                    minutely_15: [
                        'temperature_2m',
                        'apparent_temperature',
                        'precipitation',
                        'cloud_cover',
                        'wind_speed_10m',
                        'weather_code',].join(','),
                    past_minutely_15: 12,
                    forecast_minutely_15: 0,
                },
            }),
        );

        return response.data;
    }
}