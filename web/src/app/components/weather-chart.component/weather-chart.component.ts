import { Component, inject, OnInit } from '@angular/core';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import { ApiService } from '../../shared/services/api-service';
import { WeatherData, weatherColorMap } from 'shared-data';

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
    const temperatures = dataArray.map(data =>
      [new Date(data.measuredAt).getTime(), data.temperature] as [number, number]
    );

    const precipitation = dataArray.map(data =>
      [new Date(data.measuredAt).getTime(), data.precipitation] as [number, number]
    );

    const cloudCover = dataArray.map(data =>
      [new Date(data.measuredAt).getTime(), data.cloudCover] as [number, number]
    );

    const windSpeed = dataArray.map(data =>
      [new Date(data.measuredAt).getTime(), data.windSpeed] as [number, number]
    );

    const weatherCode = dataArray.map(data =>
      [new Date(data.measuredAt).getTime(), data.weatherCode] as [number, number]
    );

    const plotBands = weatherCode.slice(0, -1).map(([from, code], index) => {
      const [to] = weatherCode[index + 1];

      return {
        from,
        to,
        color: weatherColorMap[code] || 'rgba(200,200,200,0.08)'
      };
    });

    this.chart = Highcharts.chart('container', {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'Das Wetter im Zeitverlauf'
      },
      xAxis: {
        type: 'datetime',
        title: { text: 'Zeit' },
        plotBands
      },
      yAxis: [
        {
          title: { text: 'Temperatur (°C)' },
          opposite: false
        },
        {
          title: { text: 'Regen (mm)' },
          opposite: true
        },
        {
          title: { text: 'Wolkendichte (%)' },
          max: 100,
          min: 0,
          opposite: true
        },
        {
          title: { text: 'Windgeschwindigkeit (km/h)' },
          opposite: false
        }
      ],
      series: [
        {
          type: 'spline',
          name: 'Temperatur',
          data: temperatures,
          color: '#ff0000',
          yAxis: 0,
          tooltip: { valueSuffix: ' °C' }
        },
        {
          type: 'column',
          name: 'Regen',
          data: precipitation,
          yAxis: 1,
          tooltip: { valueSuffix: ' mm' },
          maxPointWidth: 8,
          borderWidth: 0,
          pointPadding: 0.05
        },
        {
          type: 'line',
          name: 'Wolkendichte',
          data: cloudCover,
          yAxis: 2,
          tooltip: { valueSuffix: ' %' },
          color: '#607d8b',
          dashStyle: 'ShortDot',
          lineWidth: 2,
          marker: {
            enabled: false
          }
        },
        {
          type: 'line',
          name: 'Windgeschwindigkeit',
          data: windSpeed,
          yAxis: 3,
          tooltip: { valueSuffix: ' km/h' }
        }
      ]
    });
  }
}