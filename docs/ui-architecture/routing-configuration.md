# Routing Configuration

### Route Setup

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
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
```

### Navigation Component

```typescript
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="main-nav">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
        Game
      </a>
      <a routerLink="/health" routerLinkActive="active">Health</a>
      <a routerLink="/credits" routerLinkActive="active">Credits</a>
    </nav>
  `
})
export class NavigationComponent {}
```
