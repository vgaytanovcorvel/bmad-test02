# Credits Route Architecture Planning

## Route Implementation Plan

### URL Structure
- **Primary Route**: `/credits`
- **Alternative Routes**: None planned
- **Route Guards**: No authentication required (public access)
- **Lazy Loading**: Optional optimization for larger applications

### Angular Router Configuration

#### Route Definition (Epic 4 Implementation)
```typescript
// apps/ui/src/app/app.routes.ts
export const routes: Routes = [
  { 
    path: '', 
    component: GamePageComponent,
    title: 'Tic-Tac-Toe Showcase'
  },
  { 
    path: 'health', 
    component: HealthPageComponent,
    title: 'Health Check'
  },
  { 
    path: 'credits', 
    component: CreditsPageComponent,
    title: 'Credits & Acknowledgments - Tic-Tac-Toe Showcase',
    data: {
      description: 'Attribution and acknowledgments for all contributors and dependencies'
    }
  },
  { 
    path: '**', 
    redirectTo: '',
    pathMatch: 'full'
  }
];
```

#### Lazy Loading Option (If Needed)
```typescript
// For larger applications - optional optimization
{
  path: 'credits',
  loadComponent: () => import('./pages/credits/credits-page.component')
    .then(m => m.CreditsPageComponent),
  title: 'Credits & Acknowledgments'
}
```

### Navigation Integration

#### Main Navigation (If Applicable)
```typescript
// Navigation component integration
interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
}

const navigationItems: NavigationItem[] = [
  { path: '/', label: 'Game' },
  { path: '/health', label: 'Health' },
  { path: '/credits', label: 'Credits' }
];
```

#### Footer Navigation (Recommended)
```typescript
// Footer component with credits link
@Component({
  selector: 'app-footer',
  template: `
    <footer class="app-footer">
      <nav>
        <a routerLink="/credits" class="credits-link">
          Credits & Acknowledgments
        </a>
        <a href="/LICENSE" target="_blank">License</a>
      </nav>
    </footer>
  `
})
export class FooterComponent {}
```

## Component Architecture

### Page Component Structure
```typescript
// apps/ui/src/app/pages/credits/credits-page.component.ts
@Component({
  selector: 'app-credits-page',
  standalone: true,
  imports: [
    CommonModule,
    ContributorCardComponent,
    DependencyListComponent,
    AcknowledmentSectionComponent
  ],
  template: `
    <div class="credits-page">
      <header class="page-header">
        <h1>Credits & Acknowledgments</h1>
        <p>Recognition for all who made this project possible</p>
      </header>
      
      <main class="credits-content">
        <app-contributor-section 
          [contributors]="contributors()"
          data-testid="contributors-section">
        </app-contributor-section>
        
        <app-dependency-section 
          [dependencies]="dependencies()"
          data-testid="dependencies-section">
        </app-dependency-section>
        
        <app-acknowledgment-section 
          [acknowledgments]="acknowledgments()"
          data-testid="acknowledgments-section">
        </app-acknowledgment-section>
      </main>
      
      <footer class="page-footer">
        <a routerLink="/" class="back-link">← Back to Game</a>
      </footer>
    </div>
  `,
  styleUrl: './credits-page.component.scss'
})
export class CreditsPageComponent implements OnInit {
  private creditsService = inject(CreditsService);
  
  // Reactive data from service
  contributors = computed(() => this.creditsService.getContributors());
  dependencies = computed(() => this.creditsService.getDependencies());
  acknowledgments = computed(() => this.creditsService.getAcknowledgments());
  
  ngOnInit(): void {
    // Load credits data
    this.creditsService.loadCreditsData();
  }
}
```

### Sub-Components

#### Contributor Section Component
```typescript
// apps/ui/src/app/pages/credits/components/contributor-section.component.ts
@Component({
  selector: 'app-contributor-section',
  standalone: true,
  template: `
    <section class="contributor-section">
      <h2>Project Contributors</h2>
      <div class="contributor-grid">
        @for (contributor of contributors; track contributor.name) {
          <app-contributor-card 
            [contributor]="contributor"
            [attr.data-testid]="'contributor-' + contributor.name.toLowerCase().replace(' ', '-')">
          </app-contributor-card>
        }
      </div>
    </section>
  `
})
export class ContributorSectionComponent {
  @Input() contributors: Contributor[] = [];
}
```

#### Dependency Section Component  
```typescript
// apps/ui/src/app/pages/credits/components/dependency-section.component.ts
@Component({
  selector: 'app-dependency-section',
  standalone: true,
  template: `
    <section class="dependency-section">
      <h2>Third-Party Libraries</h2>
      <div class="dependency-categories">
        @for (category of dependencyCategories; track category.name) {
          <div class="category-group">
            <h3>{{ category.name }}</h3>
            <ul class="dependency-list">
              @for (dep of category.dependencies; track dep.name) {
                <li class="dependency-item" [attr.data-testid]="'dependency-' + dep.name">
                  <strong>{{ dep.name }}</strong> v{{ dep.version }}
                  <span class="license">{{ dep.license }}</span>
                  <a [href]="dep.homepage" target="_blank" rel="noopener">
                    Learn more
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </section>
  `
})
export class DependencySectionComponent {
  @Input() dependencies: Dependency[] = [];
  
  dependencyCategories = computed(() => {
    // Group dependencies by category
    return this.groupDependenciesByCategory(this.dependencies);
  });
  
  private groupDependenciesByCategory(deps: Dependency[]) {
    // Implementation to group by category
  }
}
```

## Service Architecture

### Credits Service Design
```typescript
// apps/ui/src/app/services/credits.service.ts
@Injectable({ providedIn: 'root' })
export class CreditsService {
  private http = inject(HttpClient);
  
  // Signal-based state
  private _contributors = signal<Contributor[]>([]);
  private _dependencies = signal<Dependency[]>([]);
  private _acknowledgments = signal<Acknowledgment[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  
  // Public computed properties
  contributors = computed(() => this._contributors());
  dependencies = computed(() => this._dependencies());
  acknowledgments = computed(() => this._acknowledgments());
  loading = computed(() => this._loading());
  error = computed(() => this._error());
  
  async loadCreditsData(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    
    try {
      // Load all credits data in parallel
      const [contributors, dependencies, acknowledgments] = await Promise.all([
        this.loadContributors(),
        this.loadDependencies(),
        this.loadAcknowledgments()
      ]);
      
      this._contributors.set(contributors);
      this._dependencies.set(dependencies);
      this._acknowledgments.set(acknowledgments);
      
    } catch (error) {
      this._error.set('Failed to load credits data');
      console.error('Credits loading error:', error);
    } finally {
      this._loading.set(false);
    }
  }
  
  private async loadContributors(): Promise<Contributor[]> {
    // Load from static JSON file
    return this.http.get<Contributor[]>('/assets/credits/contributors.json')
      .pipe(take(1))
      .toPromise();
  }
  
  private async loadDependencies(): Promise<Dependency[]> {
    // Load from static JSON or parse from package.json
    return this.http.get<Dependency[]>('/assets/credits/dependencies.json')
      .pipe(take(1))
      .toPromise();
  }
  
  private async loadAcknowledgments(): Promise<Acknowledgment[]> {
    // Load acknowledgments data
    return this.http.get<Acknowledgment[]>('/assets/credits/acknowledgments.json')
      .pipe(take(1))
      .toPromise();
  }
}
```

### Data Source Architecture

#### Static Asset Files
```
apps/ui/src/assets/credits/
├── contributors.json      # Project contributors
├── dependencies.json      # Third-party libraries
└── acknowledgments.json   # Special acknowledgments
```

#### Contributors Data Structure
```json
// apps/ui/src/assets/credits/contributors.json
[
  {
    "name": "Development Team",
    "role": "Core Developer",
    "contributions": ["Architecture", "Implementation", "Testing"],
    "github": "username",
    "avatar": "/assets/avatars/dev-team.png"
  },
  {
    "name": "Community Contributor",
    "role": "Contributor", 
    "contributions": ["Bug Reports", "Feature Requests"],
    "github": "contributor-username"
  }
]
```

#### Dependencies Data Structure
```json
// apps/ui/src/assets/credits/dependencies.json
[
  {
    "name": "Angular",
    "version": "17+",
    "license": "MIT",
    "homepage": "https://angular.io",
    "description": "Platform for building web applications",
    "category": "framework"
  },
  {
    "name": "Nx",
    "version": "latest",
    "license": "MIT", 
    "homepage": "https://nx.dev",
    "description": "Monorepo development toolkit",
    "category": "build"
  }
]
```

## SEO and Metadata

### Page Metadata Configuration
```typescript
// SEO optimization for credits page
{
  path: 'credits',
  component: CreditsPageComponent,
  title: 'Credits & Acknowledgments - Tic-Tac-Toe Showcase',
  data: {
    meta: [
      {
        name: 'description',
        content: 'Attribution and acknowledgments for contributors, dependencies, and resources used in the Tic-Tac-Toe Showcase project.'
      },
      {
        name: 'keywords',
        content: 'credits, acknowledgments, contributors, open source, angular, nx, tailwind'
      },
      {
        property: 'og:title',
        content: 'Credits & Acknowledgments - Tic-Tac-Toe Showcase'
      },
      {
        property: 'og:description', 
        content: 'Recognition for all contributors and dependencies that made this project possible.'
      }
    ]
  }
}
```

## Accessibility Requirements

### Semantic HTML Structure
```html
<main role="main" aria-labelledby="credits-title">
  <h1 id="credits-title">Credits & Acknowledgments</h1>
  
  <section aria-labelledby="contributors-heading">
    <h2 id="contributors-heading">Project Contributors</h2>
    <!-- Contributors content -->
  </section>
  
  <section aria-labelledby="dependencies-heading">
    <h2 id="dependencies-heading">Third-Party Libraries</h2>
    <!-- Dependencies content -->
  </section>
  
  <section aria-labelledby="acknowledgments-heading">
    <h2 id="acknowledgments-heading">Special Acknowledgments</h2>
    <!-- Acknowledgments content -->
  </section>
</main>
```

### Keyboard Navigation
- **Tab Order**: Logical navigation through all interactive elements
- **Focus Indicators**: Clear visual focus indicators for all links
- **Skip Links**: Optional skip navigation for long content sections

### Screen Reader Support
- **ARIA Labels**: Proper labeling for complex UI elements
- **Heading Structure**: Logical h1-h6 heading hierarchy
- **Link Context**: Clear link text or ARIA descriptions

## Testing Strategy

### E2E Route Testing
```typescript
// apps/ui-e2e/src/credits.e2e-spec.ts
import { test, expect } from '@playwright/test';

test.describe('Credits Page', () => {
  test('should navigate to credits page', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation link (if exists)
    const creditsLink = page.getByRole('link', { name: 'Credits' });
    if (await creditsLink.isVisible()) {
      await creditsLink.click();
    } else {
      await page.goto('/credits');
    }
    
    await expect(page).toHaveURL('/credits');
    await expect(page.getByRole('heading', { level: 1 }))
      .toContainText('Credits');
  });
  
  test('should display all credit sections', async ({ page }) => {
    await page.goto('/credits');
    
    await expect(page.getByTestId('contributors-section')).toBeVisible();
    await expect(page.getByTestId('dependencies-section')).toBeVisible(); 
    await expect(page.getByTestId('acknowledgments-section')).toBeVisible();
  });
  
  test('should have working back navigation', async ({ page }) => {
    await page.goto('/credits');
    
    const backLink = page.getByRole('link', { name: /back/i });
    await backLink.click();
    
    await expect(page).toHaveURL('/');
  });
});
```

### Component Unit Testing
```typescript
// apps/ui/src/app/pages/credits/credits-page.component.spec.ts
describe('CreditsPageComponent', () => {
  let component: CreditsPageComponent;
  let mockCreditsService: jasmine.SpyObj<CreditsService>;
  
  beforeEach(() => {
    const creditsServiceSpy = jasmine.createSpyObj('CreditsService', 
      ['loadCreditsData'], 
      {
        contributors: signal([]),
        dependencies: signal([]),
        acknowledgments: signal([])
      }
    );
    
    TestBed.configureTestingModule({
      imports: [CreditsPageComponent],
      providers: [
        { provide: CreditsService, useValue: creditsServiceSpy }
      ]
    });
    
    component = TestBed.createComponent(CreditsPageComponent).componentInstance;
    mockCreditsService = TestBed.inject(CreditsService) as jasmine.SpyObj<CreditsService>;
  });
  
  it('should load credits data on init', () => {
    component.ngOnInit();
    
    expect(mockCreditsService.loadCreditsData).toHaveBeenCalled();
  });
});
```

## Performance Optimization

### Lazy Loading Strategy
- **Route-Level**: Consider lazy loading entire credits page if bundle size becomes concern
- **Component-Level**: Load heavy components (like contributor avatars) lazily
- **Data Loading**: Implement progressive loading for large contributor lists

### Caching Strategy
- **Static Assets**: Cache contributor and acknowledgment JSON files
- **HTTP Caching**: Implement proper HTTP caching headers
- **Service Worker**: Consider service worker caching for offline access

This route architecture plan provides a comprehensive blueprint for implementing the credits functionality in Epic 4, ensuring proper integration with the existing Angular application architecture.