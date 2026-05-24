import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemStatus } from 'shared-data';

@Component({
  selector: 'app-landing-page',
  imports: [AsyncPipe],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  standalone: true,
})
export class LandingPage {
  private http = inject(HttpClient);
  protected status$: Observable<SystemStatus> = this.http.get<SystemStatus>('http://localhost:3000/api/getStatus');


}
