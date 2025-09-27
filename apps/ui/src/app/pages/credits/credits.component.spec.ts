import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CreditsComponent } from './credits.component';

describe('CreditsComponent', () => {
  let component: CreditsComponent;
  let fixture: ComponentFixture<CreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditsComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render credits page without errors', () => {
    expect(component).toBeTruthy();
  });

  it('should render credits page with proper heading structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const creditsPage = compiled.querySelector('[data-testid="credits-page"]');
    expect(creditsPage).toBeTruthy();
    
    const title = compiled.querySelector('h1');
    expect(title?.textContent?.trim()).toBe('Credits');
  });

  it('should display contributors section with project information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const contributorsSection = compiled.querySelector('[data-testid="contributors-section"]');
    expect(contributorsSection).toBeTruthy();
    
    const contributorsHeading = contributorsSection?.querySelector('h2');
    expect(contributorsHeading?.textContent?.trim()).toBe('Contributors');
    
    // Check for project overview
    const projectInfo = contributorsSection?.querySelector('.project-info');
    expect(projectInfo).toBeTruthy();
    expect(projectInfo?.textContent).toContain('Tic Tac Toe Showcase demonstrates modern Angular development');
    
    // Check for team acknowledgments
    const teamAcknowledgments = contributorsSection?.querySelector('.team-acknowledgments');
    expect(teamAcknowledgments).toBeTruthy();
    expect(teamAcknowledgments?.textContent).toContain('Development Team');
  });

  it('should render dependency table with proper accessibility attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dependencyTable = compiled.querySelector('[data-testid="dependency-table"]');
    expect(dependencyTable).toBeTruthy();
    
    // Check accessibility attributes
    expect(dependencyTable?.getAttribute('role')).toBe('table');
    expect(dependencyTable?.getAttribute('aria-label')).toBe('Project Dependencies');
    
    // Check table structure
    const thead = dependencyTable?.querySelector('thead');
    const tbody = dependencyTable?.querySelector('tbody');
    expect(thead).toBeTruthy();
    expect(tbody).toBeTruthy();
  });

  it('should display major dependencies with version and license information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dependencyTable = compiled.querySelector('[data-testid="dependency-table"]');
    
    // Check headers
    const headers = dependencyTable?.querySelectorAll('th');
    expect(headers?.length).toBe(4);
    expect(headers?.[0]?.textContent?.trim()).toBe('Dependency');
    expect(headers?.[1]?.textContent?.trim()).toBe('Version');
    expect(headers?.[2]?.textContent?.trim()).toBe('License');
    expect(headers?.[3]?.textContent?.trim()).toBe('Purpose');
    
    // Check for specific dependencies
    const tableText = dependencyTable?.textContent;
    expect(tableText).toContain('Angular');
    expect(tableText).toContain('20.2.0');
    expect(tableText).toContain('MIT');
    expect(tableText).toContain('Nx');
    expect(tableText).toContain('TypeScript');
    expect(tableText).toContain('Apache 2.0');
  });

  it('should render LICENSE file link with proper navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const licenseLink = compiled.querySelector('[data-testid="license-link"]');
    expect(licenseLink).toBeTruthy();
    expect(licenseLink?.getAttribute('href')).toBe('/LICENSE.txt');
    expect(licenseLink?.getAttribute('target')).toBe('_blank');
    expect(licenseLink?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(licenseLink?.textContent?.trim()).toContain('View LICENSE file');
  });

  it('should render NOTICE file link with proper navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const noticeLink = compiled.querySelector('[data-testid="notice-link"]');
    expect(noticeLink).toBeTruthy();
    expect(noticeLink?.getAttribute('href')).toBe('/NOTICE.txt');
    expect(noticeLink?.getAttribute('target')).toBe('_blank');
    expect(noticeLink?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(noticeLink?.textContent?.trim()).toContain('View NOTICE file');
  });

  it('should have proper heading hierarchy (h1 -> h2)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check h1 exists and is unique
    const h1Elements = compiled.querySelectorAll('h1');
    expect(h1Elements.length).toBe(1);
    expect(h1Elements[0]?.textContent?.trim()).toBe('Credits');
    
    // Check h2 elements exist
    const h2Elements = compiled.querySelectorAll('h2');
    expect(h2Elements.length).toBeGreaterThan(0);
    
    const h2Texts = Array.from(h2Elements).map(h2 => h2.textContent?.trim());
    expect(h2Texts).toContain('Contributors');
    expect(h2Texts).toContain('Dependencies');
    expect(h2Texts).toContain('License Information');
  });

  it('should have accessible table structure with headers and scope attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dependencyTable = compiled.querySelector('[data-testid="dependency-table"]');
    
    // Check scope attributes on headers
    const headers = dependencyTable?.querySelectorAll('th[scope="col"]');
    expect(headers?.length).toBe(4);
    
    // Check table has proper semantic structure
    expect(dependencyTable?.querySelector('thead')).toBeTruthy();
    expect(dependencyTable?.querySelector('tbody')).toBeTruthy();
  });

  it('should include proper ARIA labels for screen readers', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dependencyTable = compiled.querySelector('[data-testid="dependency-table"]');
    
    expect(dependencyTable?.getAttribute('aria-label')).toBe('Project Dependencies');
    expect(dependencyTable?.getAttribute('role')).toBe('table');
  });

  it('should render back to game navigation link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('[data-testid="back-to-game"]');
    expect(backButton).toBeTruthy();
    expect(backButton?.textContent?.trim()).toContain('Back to Game');
    expect(backButton?.getAttribute('routerLink')).toBe('/');
  });

  it('should have license links that point to static files served from public directory', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Verify LICENSE link points to root-level static file with .txt extension
    const licenseLink = compiled.querySelector('[data-testid="license-link"]');
    expect(licenseLink?.getAttribute('href')).toBe('/LICENSE.txt');
    
    // Verify NOTICE link points to root-level static file with .txt extension
    const noticeLink = compiled.querySelector('[data-testid="notice-link"]');
    expect(noticeLink?.getAttribute('href')).toBe('/NOTICE.txt');
    
    // Verify links open in new tab (won't be intercepted by Angular router)
    expect(licenseLink?.getAttribute('target')).toBe('_blank');
    expect(noticeLink?.getAttribute('target')).toBe('_blank');
    
    // Verify security attributes
    expect(licenseLink?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(noticeLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});