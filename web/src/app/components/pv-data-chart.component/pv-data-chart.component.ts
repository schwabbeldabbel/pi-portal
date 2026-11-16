import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import { ApiService } from '../../shared/services/api-service';
import { PvData } from 'shared-data';

@Component({
  selector: 'app-pv-data-chart',
  standalone: true,
  templateUrl: './pv-data-chart.component.html',
  styleUrls: ['./pv-data-chart.component.css']
})
export class PvDataChartComponent implements OnInit, OnDestroy {

  chart: Chart | undefined;
  private apiService: ApiService = inject(ApiService);

  ngOnInit(): void {
    this.fetchPvData();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  fetchPvData(): void {
    this.apiService.getPvDetailData().subscribe((data: PvData[]) => {
      this.renderChart(data);
      console.log(`Fetched ${data.length} PV data entries`);
    });
  }

  private toSeries(
    dataArray: PvData[],
    key: 'current' | 'voltage' | 'power'
  ): [number, number][] {
    return dataArray
      .map(d => [new Date(d.measuredAt).getTime(), d[key]] as [number, number])
      .sort((a, b) => a[0] - b[0]);
  }

  renderChart(dataArray: PvData[]): void {
    const current = this.toSeries(dataArray, 'current');
    const voltage = this.toSeries(dataArray, 'voltage');
    const power = this.toSeries(dataArray, 'power');

    this.chart?.destroy();

    this.chart = Highcharts.chart('container', {
      chart: { zoomType: 'x' },
      title: { text: 'PV-Messung im Zeitverlauf' },
      xAxis: {
        type: 'datetime',
        title: { text: 'Zeit' }
      },
      yAxis: [
        {
          title: { text: 'Kurzschlussstrom (mA)' },
          opposite: false,
          min: 0
        },
        {
          title: { text: 'Spannung (V)' },
          opposite: true,
          min: 0
        },
        {
          title: { text: 'Leistung (mW)' },
          opposite: true,
          min: 0,
          offset: 60
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
        }
      },
      series: [
        {
          type: 'spline',
          name: 'Strom (Isc)',
          data: current,
          yAxis: 0,
          tooltip: { valueSuffix: ' mA' },
          color: '#fb8c00',
          marker: { enabled: false }
        },
        {
          type: 'line',
          name: 'Spannung',
          data: voltage,
          yAxis: 1,
          tooltip: { valueSuffix: ' V' },
          color: '#42a5f5',
          dashStyle: 'ShortDash',
          marker: { enabled: false }
        },
        {
          type: 'line',
          name: 'Leistung',
          data: power,
          yAxis: 2,
          tooltip: { valueSuffix: ' mW' },
          color: '#43a047',
          marker: { enabled: false }
        }
      ]
    });
  }
}