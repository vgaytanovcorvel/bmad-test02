import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VisualEnhancementService {
  private readonly STORAGE_KEY = 'tic-tac-toe-visual-enhancements';
  private platformId = inject(PLATFORM_ID);
  private _enhancementsEnabled = signal(this.loadEnhancementPreference());
  
  enhancementsEnabled = this._enhancementsEnabled.asReadonly();
  
  toggleEnhancements(): void {
    const newValue = !this._enhancementsEnabled();
    this._enhancementsEnabled.set(newValue);
    this.saveEnhancementPreference(newValue);
    this.updateDocumentClass(newValue);
  }
  
  initializeEnhancements(): void {
    this.updateDocumentClass(this._enhancementsEnabled());
  }
  
  private loadEnhancementPreference(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true; // Default enabled on server
    }
    
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true; // Default enabled
    } catch {
      return true; // Default enabled if localStorage fails
    }
  }
  
  private saveEnhancementPreference(enabled: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // No localStorage on server
    }
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(enabled));
    } catch {
      // Silently fail if localStorage is not available
    }
  }
  
  private updateDocumentClass(enabled: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // No document on server
    }
    
    const bodyElement = document.body;
    if (enabled) {
      bodyElement.classList.add('transitions-enabled');
    } else {
      bodyElement.classList.remove('transitions-enabled');
    }
  }
}