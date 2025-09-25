import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent, RouterTestingModule.withRoutes([
        { path: '', component: NavigationComponent },
        { path: 'health', component: NavigationComponent },
        { path: 'credits', component: NavigationComponent }
      ])]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create navigation component', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation with correct data-testid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navigation = compiled.querySelector('[data-testid="main-navigation"]');
    expect(navigation).toBeTruthy();
  });

  it('should render all navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    const gameLink = compiled.querySelector('[data-testid="nav-game"]');
    const healthLink = compiled.querySelector('[data-testid="nav-health"]');
    const creditsLink = compiled.querySelector('[data-testid="nav-credits"]');
    
    expect(gameLink).toBeTruthy();
    expect(healthLink).toBeTruthy();
    expect(creditsLink).toBeTruthy();
    
    expect(gameLink?.textContent?.trim()).toBe('Game');
    expect(healthLink?.textContent?.trim()).toBe('Health');
    expect(creditsLink?.textContent?.trim()).toBe('Credits');
  });

  it('should have correct href attributes for navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    const gameLink = compiled.querySelector('[data-testid="nav-game"]') as HTMLAnchorElement;
    const healthLink = compiled.querySelector('[data-testid="nav-health"]') as HTMLAnchorElement;
    const creditsLink = compiled.querySelector('[data-testid="nav-credits"]') as HTMLAnchorElement;
    
    expect(gameLink?.getAttribute('routerLink')).toBe('/');
    expect(healthLink?.getAttribute('routerLink')).toBe('/health');
    expect(creditsLink?.getAttribute('routerLink')).toBe('/credits');
  });

  it('should have proper accessibility attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nav = compiled.querySelector('[role="navigation"]');
    
    expect(nav).toBeTruthy();
    expect(nav?.getAttribute('aria-label')).toBe('Main navigation');
    
    // Check individual link aria-labels
    const gameLink = compiled.querySelector('[data-testid="nav-game"]');
    const healthLink = compiled.querySelector('[data-testid="nav-health"]');
    const creditsLink = compiled.querySelector('[data-testid="nav-credits"]');
    
    expect(gameLink?.getAttribute('aria-label')).toBe('Game page');
    expect(healthLink?.getAttribute('aria-label')).toBe('Health check page');
    expect(creditsLink?.getAttribute('aria-label')).toBe('Credits page');
  });

  it('should have routerLinkActive configured', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    const gameLink = compiled.querySelector('[data-testid="nav-game"]');
    const healthLink = compiled.querySelector('[data-testid="nav-health"]');
    const creditsLink = compiled.querySelector('[data-testid="nav-credits"]');
    
    expect(gameLink?.getAttribute('routerLinkActive')).toBe('active');
    expect(healthLink?.getAttribute('routerLinkActive')).toBe('active');
    expect(creditsLink?.getAttribute('routerLinkActive')).toBe('active');
  });
});