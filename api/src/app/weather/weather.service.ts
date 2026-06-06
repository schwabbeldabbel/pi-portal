import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WeatherEntity } from '../../entities/WeatherEntity';
import { AppDataSource } from '../../data-source';

@Injectable()
export class WeatherService {
    private readonly latitude = 52.299172;
    private readonly longitude = 10.542496;
    private readonly timezone = 'Europe/Berlin';
    private readonly weatherRepository = AppDataSource.getRepository(WeatherEntity);


    constructor(private readonly httpService: HttpService,) {}

    /**
     * Fetches and stores weather data and stores it in the database.
     */
    async fetchAndStoreCurrentWeather() {
        const currentWeather = await this.getCurrentWeather();

        const entity = this.weatherRepository.create({
            temperature_2m: currentWeather.current.temperature_2m,
            apparent_temperature: currentWeather.current.apparent_temperature,
            precipitation: currentWeather.current.precipitation,
            cloud_cover: currentWeather.current.cloud_cover,
            wind_speed_10m: currentWeather.current.wind_speed_10m,
            weather_code: currentWeather.current.weather_code,
            source: 'open-meteo',
            measuredAt: new Date(currentWeather.current.time),
        });

        await this.weatherRepository.save(entity);
    }

    async getCurrentWeather() {
        const url =
        'https://api.open-meteo.com/v1/forecast' +
        `?latitude=${this.latitude}` +
        `&longitude=${this.longitude}` +
        `&timezone=${encodeURIComponent(this.timezone)}` +
        '&current=temperature_2m,apparent_temperature,precipitation,cloud_cover,wind_speed_10m,weather_code';

        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
    }

    async getForecast() {
        const url =
        'https://api.open-meteo.com/v1/forecast' +
        `?latitude=${this.latitude}` +
        `&longitude=${this.longitude}` +
        `&timezone=${encodeURIComponent(this.timezone)}` +
        '&current=temperature_2m,apparent_temperature,precipitation,cloud_cover,wind_speed_10m,weather_code' +
        '&hourly=temperature_2m,precipitation_probability,cloud_cover,shortwave_radiation,wind_speed_10m' +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,shortwave_radiation_sum';

        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
    }
    }