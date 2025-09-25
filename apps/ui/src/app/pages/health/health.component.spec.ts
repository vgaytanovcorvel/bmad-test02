import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthComponent } from './health.component';
import { environment } from '../../../environments/environment';

describe('HealthComponent', () => {
  let component: HealthComponent;
  let fixture: ComponentFixture<HealthComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(HealthComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct app name from environment', () => {
    const appNameElement = compiled.querySelector('[data-testid="app-name"]');
    expect(appNameElement?.textContent?.trim()).toBe(environment.appName);
  });

  it('should display correct version from environment', () => {
    const versionElement = compiled.querySelector('[data-testid="app-version"]');
    expect(versionElement?.textContent?.trim()).toBe(environment.version);
  });

  it('should display correct build hash from environment', () => {
    const buildHashElement = compiled.querySelector('[data-testid="build-hash"]');
    expect(buildHashElement?.textContent?.trim()).toBe(environment.buildHash);
  });

  it('should display correct environment status', () => {
    const environmentElement = compiled.querySelector('[data-testid="environment"]');
    const expectedText = environment.production ? 'Production' : 'Development';
    expect(environmentElement?.textContent?.trim()).toBe(expectedText);
  });

  it('should display green status indicator for healthy status', () => {
    const statusIndicator = compiled.querySelector('[data-testid="status-indicator"]');
    expect(statusIndicator).toBeTruthy();
    
    const statusDot = compiled.querySelector('.status-dot');
    expect(statusDot).toBeTruthy();
    expect(statusDot?.classList.contains('bg-green-500')).toBe(true);
  });

  it('should display health check page with proper test id', () => {
    const healthPage = compiled.querySelector('[data-testid="health-page"]');
    expect(healthPage).toBeTruthy();
  });

  it('should display timestamp in readable format', () => {
    const timestampElement = compiled.querySelector('[data-testid="timestamp"]');
    expect(timestampElement?.textContent?.trim()).toBeTruthy();
    
    // Verify timestamp is a valid date string
    const timestampText = timestampElement?.textContent?.trim();
    expect(timestampText).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Basic date format validation
  });

  it('should have proper component properties initialized', () => {
    expect(component.appName).toBe(environment.appName);
    expect(component.version).toBe(environment.version);
    expect(component.buildHash).toBe(environment.buildHash);
    expect(component.isProduction).toBe(environment.production);
    expect(component.timestamp).toBeTruthy();
  });

  it('should render all required information sections', () => {
    const infoItems = compiled.querySelectorAll('.info-item');
    expect(infoItems.length).toBeGreaterThanOrEqual(4);
    
    // Check for app name section
    expect(compiled.querySelector('[data-testid="app-name"]')).toBeTruthy();
    
    // Check for version section  
    expect(compiled.querySelector('[data-testid="app-version"]')).toBeTruthy();
    
    // Check for build hash section
    expect(compiled.querySelector('[data-testid="build-hash"]')).toBeTruthy();
    
    // Check for environment section
    expect(compiled.querySelector('[data-testid="environment"]')).toBeTruthy();
  });

  it('should apply correct CSS classes for production vs development', () => {
    const environmentElement = compiled.querySelector('[data-testid="environment"]');
    
    if (environment.production) {
      expect(environmentElement?.classList.contains('text-red-600')).toBe(true);
      expect(environmentElement?.classList.contains('text-blue-600')).toBe(false);
    } else {
      expect(environmentElement?.classList.contains('text-blue-600')).toBe(true);
      expect(environmentElement?.classList.contains('text-red-600')).toBe(false);
    }
  });
});