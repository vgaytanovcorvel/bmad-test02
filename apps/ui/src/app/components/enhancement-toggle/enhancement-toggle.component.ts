import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualEnhancementService } from '../../services/visual-enhancement.service';

@Component({
  selector: 'app-enhancement-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="enhancement-toggle" data-testid="enhancement-toggle-container">
      <label class="toggle-label">
        <input
          type="checkbox"
          class="toggle-input sr-only"
          [checked]="enhancementService.enhancementsEnabled()"
          (change)="onToggleChange()"
          data-testid="enhancement-toggle"
          aria-describedby="toggle-description"
        />
        <span class="toggle-switch" [class.enabled]="enhancementsEnabled()">
          <span class="toggle-knob"></span>
        </span>
        <span class="toggle-text">Visual Effects</span>
      </label>
      <p id="toggle-description" class="toggle-description sr-only">
        {{ enhancementsEnabled() ? 'Visual effects are enabled' : 'Visual effects are disabled' }}
      </p>
    </div>
  `,
  styles: [`
    .enhancement-toggle {
      @apply flex flex-col gap-1;
    }

    .toggle-label {
      @apply flex items-center gap-2 cursor-pointer select-none;
    }

    .toggle-switch {
      @apply relative inline-block w-12 h-6 bg-gray-300 rounded-full transition-colors duration-200;
      @apply focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2;
      
      &.enabled {
        @apply bg-blue-500;
      }
    }

    .toggle-knob {
      @apply absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200;
      @apply shadow-sm;
      
      .enabled & {
        @apply transform translate-x-6;
      }
    }

    .toggle-text {
      @apply text-sm font-medium text-gray-700;
    }

    .toggle-description {
      @apply text-xs text-gray-500;
    }

    /* Ensure transitions are smooth even when visual effects are disabled */
    .toggle-switch,
    .toggle-knob {
      transition-property: background-color, transform;
      transition-duration: 200ms;
      transition-timing-function: ease-in-out;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnhancementToggleComponent {
  protected enhancementService = inject(VisualEnhancementService);
  
  // Expose service signal for template
  enhancementsEnabled = this.enhancementService.enhancementsEnabled;
  
  onToggleChange(): void {
    this.enhancementService.toggleEnhancements();
  }
}