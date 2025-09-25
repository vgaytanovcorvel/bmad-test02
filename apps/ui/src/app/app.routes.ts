import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'health',
    loadComponent: () => import('./pages/health/health.component').then(m => m.HealthComponent),
    title: 'Health Check'
  },
  {
    path: '',
    redirectTo: '/health',
    pathMatch: 'full'
  }
];
