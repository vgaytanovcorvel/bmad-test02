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

  it('should create credits page', () => {
    expect(component).toBeTruthy();
  });

  it('should render credits page with correct data-testid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const creditsPage = compiled.querySelector('[data-testid="credits-page"]');
    expect(creditsPage).toBeTruthy();
  });

  it('should render credits title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent?.trim()).toBe('Credits');
  });

  it('should render development team section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('h2');
    const developmentSection = Array.from(sections).find(h2 => 
      h2.textContent?.trim() === 'Development Team'
    );
    expect(developmentSection).toBeTruthy();
  });

  it('should render technology stack section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('h2');
    const techSection = Array.from(sections).find(h2 => 
      h2.textContent?.trim() === 'Technology Stack'
    );
    expect(techSection).toBeTruthy();
  });

  it('should render back to game navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('[data-testid="back-to-game"]');
    expect(backButton).toBeTruthy();
    expect(backButton?.textContent?.trim()).toContain('Back to Game');
  });

  it('should render technology list', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const techList = compiled.querySelector('.technology-list');
    expect(techList).toBeTruthy();
    
    const techItems = techList?.querySelectorAll('li');
    expect(techItems?.length).toBeGreaterThan(0);
    
    // Check for specific technologies
    const techText = Array.from(techItems || []).map(li => li.textContent?.trim());
    expect(techText).toContain('Angular 17+ with Standalone Components');
    expect(techText).toContain('Nx Monorepo Tooling');
    expect(techText).toContain('Tailwind CSS for Styling');
  });

  it('should render placeholder content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const placeholder = compiled.querySelector('.placeholder-content');
    expect(placeholder).toBeTruthy();
    expect(placeholder?.textContent).toContain('Epic 4 implementation');
  });
});