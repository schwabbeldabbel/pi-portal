import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SystemStatus, FlatWidgetData } from 'shared-data';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

    private http: HttpClient = inject(HttpClient);

     getStatus(): Observable<SystemStatus> {
       return this.http.get<SystemStatus>('/api/getStatus');
    }

    getWidgetData(): Observable<FlatWidgetData[]> {
      return this.http.get<FlatWidgetData[]>('/api/web/getWidgetData');
    }
}
