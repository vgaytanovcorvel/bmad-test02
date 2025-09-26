import { TestBed } from '@angular/core/testing';
import { VisualEnhancementService } from './visual-enhancement.service';

describe('VisualEnhancementService', () => {
  let service: VisualEnhancementService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualEnhancementService);
    
    // Clear localStorage before each test
    localStorage.clear();
    
    // Remove any existing classes from body
    document.body.classList.remove('transitions-enabled');
  });
  
  afterEach(() => {
    localStorage.clear();
    document.body.classList.remove('transitions-enabled');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should default to enabled when no preference is stored', () => {
    expect(service.enhancementsEnabled()).toBe(true);
  });
  
  it('should load saved preference from localStorage', () => {
    localStorage.setItem('tic-tac-toe-visual-enhancements', 'false');
    
    // Create a new TestBed instance to get fresh service
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(VisualEnhancementService);
    expect(newService.enhancementsEnabled()).toBe(false);
  });
  
  it('should toggle enhancements and update document class', () => {
    // Start enabled (default)
    expect(service.enhancementsEnabled()).toBe(true);
    
    // Toggle to disabled
    service.toggleEnhancements();
    expect(service.enhancementsEnabled()).toBe(false);
    expect(document.body.classList.contains('transitions-enabled')).toBe(false);
    
    // Toggle back to enabled
    service.toggleEnhancements();
    expect(service.enhancementsEnabled()).toBe(true);
    expect(document.body.classList.contains('transitions-enabled')).toBe(true);
  });
  
  it('should persist enhancement preference', () => {
    service.toggleEnhancements(); // Disable
    
    const savedValue = localStorage.getItem('tic-tac-toe-visual-enhancements');
    expect(savedValue).not.toBeNull();
    expect(JSON.parse(savedValue as string)).toBe(false);
    
    service.toggleEnhancements(); // Enable
    
    const updatedValue = localStorage.getItem('tic-tac-toe-visual-enhancements');
    expect(updatedValue).not.toBeNull();
    expect(JSON.parse(updatedValue as string)).toBe(true);
  });
  
  it('should initialize enhancements on startup', () => {
    localStorage.setItem('tic-tac-toe-visual-enhancements', 'true');
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(VisualEnhancementService);
    newService.initializeEnhancements();
    
    expect(document.body.classList.contains('transitions-enabled')).toBe(true);
  });
  
  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    
    localStorage.setItem = jest.fn().mockImplementation(() => {
      throw new Error('Storage error');
    });
    localStorage.getItem = jest.fn().mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(VisualEnhancementService);
    
    // Should default to enabled when localStorage fails
    expect(newService.enhancementsEnabled()).toBe(true);
    
    // Should not crash when saving fails
    expect(() => newService.toggleEnhancements()).not.toThrow();
    
    // Restore localStorage
    localStorage.setItem = originalSetItem;
    localStorage.getItem = originalGetItem;
  });
});