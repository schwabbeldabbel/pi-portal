import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemStatus } from 'shared-data';
import { WidgetType } from '../../shared/widget-enum';
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
    FlatWidget
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
  protected widgetTypes: WidgetType[];

  ngOnInit(): void {
    // Initial navigation to the first menu item
    this.router.navigate([this.menuItems[0].title.toLowerCase()]);
    // Fetch system status
    this.status$ = this.apiService.getStatus();
    this.widgetTypes = Object.values(WidgetType);
  }

  protected selectedMenuItem: string = this.menuItems[0].title;

  protected selectMenuItem(title: string): void {
    this.selectedMenuItem = title;
    this.router.navigate([title.toLowerCase()]);
  }
}