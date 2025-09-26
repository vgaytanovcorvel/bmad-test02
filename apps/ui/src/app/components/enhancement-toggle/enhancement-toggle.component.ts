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
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 3rem;
      height: 1.5rem;
      background: #cbd5e1;
      border-radius: 9999px;
      transition: all 0.3s ease-in-out;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
      
      &:focus-within {
        box-shadow: 0 0 0 2px #0ea5e9, inset 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      &.enabled {
        background: linear-gradient(135deg, #0891b2, #06b6d4);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1),
                    0 0 10px rgba(8, 145, 178, 0.3);
      }
    }

    .toggle-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 1.25rem;
      height: 1.25rem;
      background: white;
      border-radius: 9999px;
      transition: all 0.3s ease-in-out;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      
      .enabled & {
        transform: translateX(1.5rem);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }
    }

    .toggle-text {
      font-size: 1rem;
      font-weight: 600;
      color: #475569;
      letter-spacing: -0.025em;
    }

    .toggle-description {
      font-size: 0.75rem;
      color: #64748b;
    }

    /* Ensure transitions are smooth even when visual effects are disabled */
    .toggle-switch,
    .toggle-knob {
      transition-property: background-color, transform, box-shadow;
      transition-duration: 300ms;
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