import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { appRoutes } from './app.routes';

// Mock components for testing
@Component({ template: 'Game Page' })
class MockGameComponent { }

@Component({ template: 'Health Page' })
class MockHealthComponent { }

@Component({ template: 'Credits Page' })
class MockCreditsComponent { }

describe('Routing Configuration', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {
          path: '',
          component: MockGameComponent,
          title: 'Tic Tac Toe'
        },
        {
          path: 'health',
          component: MockHealthComponent,
          title: 'Health Check'
        },
        {
          path: 'credits',
          component: MockCreditsComponent,
          title: 'Credits'
        },
        {
          path: '**',
          redirectTo: ''
        }
      ])]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to game page by default', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/');
  });

  it('should navigate to health page', async () => {
    await router.navigate(['/health']);
    expect(location.path()).toBe('/health');
  });

  it('should navigate to credits page', async () => {
    await router.navigate(['/credits']);
    expect(location.path()).toBe('/credits');
  });

  it('should redirect unknown routes to home', async () => {
    await router.navigate(['/unknown-route']);
    expect(location.path()).toBe('/');
  });

  it('should have correct route configuration structure', () => {
    expect(appRoutes).toBeDefined();
    expect(appRoutes.length).toBeGreaterThanOrEqual(3);
    
    // Check that we have the required routes
    const routePaths = appRoutes.map(route => route.path);
    expect(routePaths).toContain('');
    expect(routePaths).toContain('health');
    expect(routePaths).toContain('credits');
    expect(routePaths).toContain('**');
  });

  it('should have lazy loading configured for all routes', () => {
    const lazyRoutes = appRoutes.filter(route => 
      route.loadComponent && typeof route.loadComponent === 'function'
    );
    expect(lazyRoutes.length).toBeGreaterThanOrEqual(3);
  });

  it('should have proper titles for all routes', () => {
    const titleRoutes = appRoutes.filter(route => 
      route.title && route.path !== '**'
    );
    expect(titleRoutes.length).toBeGreaterThanOrEqual(3);
    
    // Check specific titles
    const gameRoute = appRoutes.find(route => route.path === '');
    const healthRoute = appRoutes.find(route => route.path === 'health');
    const creditsRoute = appRoutes.find(route => route.path === 'credits');
    
    expect(gameRoute?.title).toBe('Tic Tac Toe');
    expect(healthRoute?.title).toBe('Health Check');
    expect(creditsRoute?.title).toBe('Credits');
  });
});