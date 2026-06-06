import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  standalone: true,
})
export class LandingPage {

  private apiService: ApiService = inject(ApiService);


  protected menuItems = [
    { title: 'Home' },
    { title: 'Pictures' },
    { title: 'Health' },
    { title: 'Settings' },
  ];

  protected status$: Observable<SystemStatus> = this.apiService.getStatus();

  protected selectedMenuItem: string = this.menuItems[0].title;

  protected selectMenuItem(title: string): void {
    this.selectedMenuItem = title;
    console.log(`Selected menu item: ${this.selectedMenuItem}`);
  }
}