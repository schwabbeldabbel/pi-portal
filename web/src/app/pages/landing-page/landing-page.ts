import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { catchError, Observable, of, switchMap, timer } from 'rxjs';
import { SystemStatus } from 'shared-data';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonSpinner,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ApiService } from '../../shared/services/api-service';
import { FlatWidget } from "../../components/flat-widget/flat-widget";
import { Router } from '@angular/router';
import { FlatWidgetData } from 'shared-data';
import { WeatherChartComponent } from '../../components/weather-chart.component/weather-chart.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    AsyncPipe,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuButton,
    IonMenuToggle,
    IonSpinner,
    IonSplitPane,
    IonTitle,
    IonToolbar,
    FlatWidget,
    WeatherChartComponent
],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  standalone: true,
})
export class LandingPage implements OnInit {

  private apiService: ApiService = inject(ApiService);
  private router = inject(Router);

  protected menuItems = [
    { title: 'Home' },
    { title: 'Data' },
    { title: 'Health' },
    { title: 'Settings' },
  ];
  protected status$: Observable<SystemStatus>;
  protected widgetData$: Observable<FlatWidgetData[]>;

  ngOnInit(): void {
    // Initial navigation to the first menu item
    this.router.navigate([this.menuItems[0].title.toLowerCase()]);

    // Fetch system status
    this.status$ = this.apiService.getStatus();
    this.widgetData$ = timer(0, 5000).pipe(
        switchMap(() => this.apiService.getWidgetData()),
        catchError(() => of([]))
      );  
    }

  protected selectedMenuItem: string = this.menuItems[0].title;

  protected selectMenuItem(title: string): void {
    this.selectedMenuItem = title;
    this.router.navigate([title.toLowerCase()]);
  }
}