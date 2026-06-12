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
      yAxis: {
        title: {
          text: 'Temperatur (°C)'
        }
      },
      series: [{
        name: 'Temperatur',
        data: temperatures
      }]
    });
  }
}