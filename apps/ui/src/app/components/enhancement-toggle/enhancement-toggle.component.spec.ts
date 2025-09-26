import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnhancementToggleComponent } from './enhancement-toggle.component';
import { VisualEnhancementService } from '../../services/visual-enhancement.service';
import { signal } from '@angular/core';

describe('EnhancementToggleComponent', () => {
  let component: EnhancementToggleComponent;
  let fixture: ComponentFixture<EnhancementToggleComponent>;
  let mockEnhancementService: jest.Mocked<VisualEnhancementService>;

  beforeEach(async () => {
    const enhancementServiceSpy = {
      toggleEnhancements: jest.fn(),
      enhancementsEnabled: signal(true)
    };

    await TestBed.configureTestingModule({
      imports: [EnhancementToggleComponent],
      providers: [
        { provide: VisualEnhancementService, useValue: enhancementServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnhancementToggleComponent);
    component = fixture.componentInstance;
    mockEnhancementService = TestBed.inject(VisualEnhancementService) as jest.Mocked<VisualEnhancementService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display toggle switch', () => {
    const toggleContainer = fixture.nativeElement.querySelector('[data-testid="enhancement-toggle-container"]');
    expect(toggleContainer).toBeTruthy();
    
    const toggleInput = fixture.nativeElement.querySelector('[data-testid="enhancement-toggle"]');
    expect(toggleInput).toBeTruthy();
    expect(toggleInput.type).toBe('checkbox');
  });

  it('should reflect enhancement service state', () => {
    const toggleInput = fixture.nativeElement.querySelector('[data-testid="enhancement-toggle"]') as HTMLInputElement;
    
    // Should be checked when service returns true
    expect(toggleInput.checked).toBe(true);
    
    const toggleSwitch = fixture.nativeElement.querySelector('.toggle-switch');
    expect(toggleSwitch.classList.contains('enabled')).toBe(true);
  });

  it('should call service when toggle is clicked', () => {
    const toggleInput = fixture.nativeElement.querySelector('[data-testid="enhancement-toggle"]') as HTMLInputElement;
    
    toggleInput.click();
    
    expect(mockEnhancementService.toggleEnhancements).toHaveBeenCalledTimes(1);
  });

  it('should handle onToggleChange method', () => {
    component.onToggleChange();
    
    expect(mockEnhancementService.toggleEnhancements).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    const toggleInput = fixture.nativeElement.querySelector('[data-testid="enhancement-toggle"]') as HTMLInputElement;
    const description = fixture.nativeElement.querySelector('#toggle-description');
    
    expect(toggleInput.getAttribute('aria-describedby')).toBe('toggle-description');
    expect(description).toBeTruthy();
    expect(description.textContent?.trim()).toContain('Visual effects are enabled');
  });

  it('should show screen reader text based on state', () => {
    const description = fixture.nativeElement.querySelector('#toggle-description');
    
    // When enabled (initial state from mock service)
    expect(description.textContent?.trim()).toBe('Visual effects are enabled');
    
    // We can't easily change the mock signal after instantiation in this test setup
    // This test verifies that the template properly binds to the service signal
    // The toggle functionality is tested separately in other tests
  });

  it('should have proper styling classes', () => {
    const toggleSwitch = fixture.nativeElement.querySelector('.toggle-switch');
    const toggleKnob = fixture.nativeElement.querySelector('.toggle-knob');
    const toggleText = fixture.nativeElement.querySelector('.toggle-text');
    
    expect(toggleSwitch).toBeTruthy();
    expect(toggleKnob).toBeTruthy();
    expect(toggleText).toBeTruthy();
    expect(toggleText.textContent?.trim()).toBe('Visual Effects');
  });
});

describe('EnhancementToggleComponent - Disabled State', () => {
  let fixture: ComponentFixture<EnhancementToggleComponent>;
  
  beforeEach(async () => {
    const disabledServiceSpy = {
      toggleEnhancements: jest.fn(),
      enhancementsEnabled: signal(false)
    };

    await TestBed.configureTestingModule({
      imports: [EnhancementToggleComponent],
      providers: [
        { provide: VisualEnhancementService, useValue: disabledServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnhancementToggleComponent);
    fixture.detectChanges();
  });

  it('should show disabled state screen reader text', () => {
    const description = fixture.nativeElement.querySelector('#toggle-description');
    expect(description.textContent?.trim()).toBe('Visual effects are disabled');
    
    const toggleInput = fixture.nativeElement.querySelector('[data-testid="enhancement-toggle"]') as HTMLInputElement;
    expect(toggleInput.checked).toBe(false);
    
    const toggleSwitch = fixture.nativeElement.querySelector('.toggle-switch');
    expect(toggleSwitch.classList.contains('enabled')).toBe(false);
  });
});