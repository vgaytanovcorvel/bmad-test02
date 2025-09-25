import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/game/game.component').then(m => m.GameComponent),
    title: 'Tic Tac Toe'
  },
  {
    path: 'health',
    loadComponent: () => import('./pages/health/health.component').then(m => m.HealthComponent),
    title: 'Health Check'
  },
  {
    path: 'credits',
    loadComponent: () => import('./pages/credits/credits.component').then(m => m.CreditsComponent),
    title: 'Credits'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
