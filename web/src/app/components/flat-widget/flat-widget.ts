import { Component, Input } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { WidgetType } from '../../shared/widget-enum';

@Component({
  selector: 'app-flat-widget',
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
],
  templateUrl: './flat-widget.html',
  styleUrl: './flat-widget.scss',
  standalone: true,
})
export class FlatWidget {


  @Input() widgetType: WidgetType;
}
