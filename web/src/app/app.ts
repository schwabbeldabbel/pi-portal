import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    Highcharts.setOptions({
      chart: {
        backgroundColor: '#ffffff',
        style: {
          fontFamily: 'Inter, sans-serif'
        }
      },
      title: {
        style: {
          color: '#111'
        }
      },
      xAxis: {
        labels: { style: { color: '#333' } }
      },
      yAxis: {
        labels: { style: { color: '#333' } },
        title: { style: { color: '#333' } }
      }
    });
  }
}