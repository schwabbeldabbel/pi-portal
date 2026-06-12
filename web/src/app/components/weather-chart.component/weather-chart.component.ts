import { Component, inject, OnInit } from '@angular/core';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import { ApiService } from '../../shared/services/api-service';
import { WeatherData } from 'shared-data';

@Component({
  selector: 'app-weather-chart',
  standalone: true,
  templateUrl: './weather-chart.component.html',
  styleUrls: ['./weather-chart.component.css']
})
export class WeatherChartComponent implements OnInit {

  chart: Chart | undefined;
  private apiService: ApiService = inject(ApiService);

  ngOnInit(): void {
    this.fetchWeatherData();
  }

  fetchWeatherData(): void {
    this.apiService.getWeatherDetailData().subscribe(data => {
      console.log('Received weather data:', data);
      this.renderChart(data);
    });
  }

  renderChart(dataArray: WeatherData[]): void {
    const temperatures = dataArray.map(data => [new Date(data.measuredAt).getTime(), data.temperature]);
    const precipitation = dataArray.map(data => [new Date(data.measuredAt).getTime(), data.precipitation]);
    const cloudCover = dataArray.map(data => [new Date(data.measuredAt).getTime(), data.cloudCover]);
    const windSpeed = dataArray.map(data => [new Date(data.measuredAt).getTime(), data.windSpeed]);
    const weatherCode = dataArray.map(data => [new Date(data.measuredAt).getTime(), data.weatherCode]);

    this.chart = Highcharts.chart('container', {
    title: {
        text: 'Das Wetter im Zeitverlauf'
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Zeit'
        }
      },
      yAxis: [
        {
          title: {
            text: 'Temperatur (°C)'
          },
        },
        {
          title: {
            text: 'Regen in (mm)'
          }
        },
        {
          title: {
            text: 'Wolkendichte (%)'
          }
        },
        {
          title: {
            text: 'Windgeschwindigkeit (km/h)'
          }
        }
      ],
      series: [
        {
          name: 'Temperatur',
          data: temperatures
        },
        {
          name: 'Regen',
          data: precipitation
        },
        {
          name: 'Wolkendichte',
          data: cloudCover
        },
        {
          name: 'Windgeschwindigkeit',
          data: windSpeed
        }
      ]
    });
  }
}