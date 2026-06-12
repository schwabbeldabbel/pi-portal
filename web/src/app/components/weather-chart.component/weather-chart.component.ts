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
          id: 'temperature-axis',
          title: { text: 'Temperatur (°C)' },
          opposite: false,
          visible: true,
          min: 0
        },
        {
          id: 'precipitation-axis',
          title: { text: 'Regen (mm)' },
          opposite: true,
          visible: true,
          min: 0,
          offset: 0
        },
        {
          id: 'cloud-axis',
          title: { text: 'Wolkendichte (%)' },
          opposite: true,
          visible: true,
          min: 0,
          max: 100,
          offset: 60
        },
        {
          id: 'wind-axis',
          title: { text: 'Windgeschwindigkeit (km/h)' },
          opposite: true,
          visible: true,
          min: 0,
          offset: 120
        }
      ],
      plotOptions: {
        series: {
          events: {
            legendItemClick: function () {
              // eslint-disable-next-line @typescript-eslint/no-this-alias
              const clickedSeries = this;
              const chart = clickedSeries.chart;

              setTimeout(() => {
                chart.yAxis.forEach((axis, currentAxisIndex) => {
                  const hasVisibleSeries = chart.series.some(series => {
                    const seriesAxisIndex =
                      typeof series.options.yAxis === 'number'
                        ? series.options.yAxis
                        : 0;

                    return seriesAxisIndex === currentAxisIndex && series.visible;
                  });

                  axis.update({ visible: hasVisibleSeries }, false);
                });

                chart.redraw();
              }, 0);

              return true;
            }
          }
        },
        column: {
          borderWidth: 0
        }
      },
      series: [
        {
          type: 'spline',
          name: 'Temperatur',
          data: temperatures,
          yAxis: 0,
          tooltip: { valueSuffix: ' °C' },
          color: '#e53935'
        },
        {
          type: 'column',
          name: 'Regen',
          data: precipitation,
          yAxis: 1,
          tooltip: { valueSuffix: ' mm' },
          maxPointWidth: 8,
          pointPadding: 0.05,
          color: '#42a5f5'
        },
        {
          type: 'line',
          name: 'Wolkendichte',
          data: cloudCover,
          yAxis: 2,
          tooltip: { valueSuffix: ' %' },
          color: '#78909c',
          dashStyle: 'ShortDash',
          lineWidth: 2,
          marker: { enabled: false }
        },
        {
          type: 'line',
          name: 'Windgeschwindigkeit',
          data: windSpeed,
          yAxis: 3,
          tooltip: { valueSuffix: ' km/h' },
          color: '#8d6e63',
          lineWidth: 2,
          marker: { enabled: false }
        }
      ]
    });
  }
}