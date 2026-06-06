import { Route } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';

export const appRoutes: Route[] = [
    {
        path: '',
        component: LandingPage,
    },
    {
        path: 'data',
        component: LandingPage,
    }
    
];
