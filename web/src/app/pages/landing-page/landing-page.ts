import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SystemStatus } from 'shared-data';
import { NbButtonModule, NbLayoutModule, NbSidebarModule, NbMenuModule, NbMenuService, NbMenuBag, NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-landing-page',
  imports: [
    AsyncPipe,
    NbLayoutModule,
    NbSidebarModule,
    NbMenuModule,
    NbButtonModule,
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  standalone: true,
})
export class LandingPage {
  private http = inject(HttpClient);
  protected nbMenuServices = inject(NbMenuService);

  protected menuItems: NbMenuItem[] = [
    { title: 'Home' },
    { title: 'Health' },
  ];

  protected status$: Observable<SystemStatus> = this.http.get<SystemStatus>('http://localhost:3000/api/getStatus');
  protected selectedMenuItem: string = this.menuItems[0].title;

  constructor() {
    this.nbMenuServices.onItemClick().subscribe((bag: NbMenuBag) => {
      this.selectedMenuItem = bag.item.title;
      console.log(`Selected menu item: ${this.selectedMenuItem}`);
    });
  }

}
