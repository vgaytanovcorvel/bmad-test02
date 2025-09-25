import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="health-page-container" data-testid="health-page">
      <header class="health-header">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Health Check</h1>
      </header>
      
      <main class="health-main">
        <div class="health-card bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div class="text-center">
            <!-- Status Indicator -->
            <div class="status-indicator flex items-center justify-center mb-6">
              <div class="status-dot w-4 h-4 bg-green-500 rounded-full mr-3 animate-pulse" data-testid="status-indicator"></div>
              <span class="text-green-600 font-semibold text-lg">Healthy</span>
            </div>
            
            <!-- App Information -->
            <div class="app-info space-y-4">
              <div class="info-item">
                <div class="block text-sm font-medium text-gray-600">Application Name</div>
                <p class="text-lg text-gray-900 font-semibold" data-testid="app-name">{{ appName }}</p>
              </div>
              
              <div class="info-item">
                <div class="block text-sm font-medium text-gray-600">Version</div>
                <p class="text-lg text-gray-900" data-testid="app-version">{{ version }}</p>
              </div>
              
              <div class="info-item">
                <div class="block text-sm font-medium text-gray-600">Build Hash</div>
                <p class="text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded" data-testid="build-hash">{{ buildHash }}</p>
              </div>
              
              <div class="info-item">
                <div class="block text-sm font-medium text-gray-600">Environment</div>
                <p class="text-lg" [class.text-red-600]="isProduction" [class.text-blue-600]="!isProduction" data-testid="environment">
                  {{ isProduction ? 'Production' : 'Development' }}
                </p>
              </div>
            </div>
            
            <!-- Timestamp -->
            <div class="timestamp mt-6 pt-4 border-t border-gray-200">
              <div class="block text-xs font-medium text-gray-500 mb-1">Last Checked</div>
              <p class="text-sm text-gray-600" data-testid="timestamp">{{ timestamp }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrl: './health.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HealthComponent {
  readonly appName = environment.appName;
  readonly version = environment.version;
  readonly buildHash = environment.buildHash;
  readonly isProduction = environment.production;
  readonly timestamp = new Date().toLocaleString();
}