import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="main-nav" role="navigation" aria-label="Main navigation" data-testid="main-navigation">
      <div class="nav-container">
        <div class="nav-links">
          <a routerLink="/" 
             routerLinkActive="active" 
             [routerLinkActiveOptions]="{exact: true}"
             class="nav-link"
             aria-label="Game page"
             data-testid="nav-game">
            Game
          </a>
          <a routerLink="/health" 
             routerLinkActive="active"
             class="nav-link"
             aria-label="Health check page"
             data-testid="nav-health">
            Health
          </a>
          <a routerLink="/credits" 
             routerLinkActive="active"
             class="nav-link"
             aria-label="Credits page"
             data-testid="nav-credits">
            Credits
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .main-nav {
      background-color: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      max-width: 64rem;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .nav-links {
      display: flex;
      justify-content: center;
      gap: 2rem;
    }

    .nav-link {
      display: inline-block;
      padding: 0.5rem 1rem;
      text-decoration: none;
      color: #6b7280;
      font-weight: 500;
      border-radius: 0.375rem;
      transition: all 0.15s ease-in-out;
      
      &:hover {
        color: #3b82f6;
        background-color: #f3f4f6;
      }
      
      &.active {
        color: #3b82f6;
        background-color: #dbeafe;
        font-weight: 600;
      }
      
      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.1);
      }
    }

    @media (max-width: 640px) {
      .nav-links {
        gap: 1rem;
      }
      
      .nav-link {
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
}