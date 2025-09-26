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
      background: #0f172a; /* Near-black background */
      padding: 1.25rem 0; /* Increased vertical padding */
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid #334155;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }

    .nav-container {
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .nav-links {
      display: flex;
      justify-content: center;
      gap: 2.5rem;
    }

    .nav-link {
      display: inline-block;
      padding: 0.5rem 1rem;
      text-decoration: none;
      color: #cbd5e1;
      font-weight: 600;
      font-size: 1rem;
      border-radius: 8px;
      transition: all 0.2s ease-in-out;
      position: relative;
      border: 2px solid transparent;
      
      &:hover {
        color: white;
        background: #1e293b;
      }
      
      &.active {
        color: white;
        font-weight: 700;
        border-image: linear-gradient(to right, #0ea5e9, #0891b2) 1;
        background: none;
      }
      
      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.5);
      }
    }

    @media (max-width: 640px) {
      .nav-links {
        gap: 1.5rem;
      }
      
      .nav-link {
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
}