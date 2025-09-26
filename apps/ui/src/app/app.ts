import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { VisualEnhancementService } from './services/visual-enhancement.service';

@Component({
  imports: [NavigationComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App implements OnInit {
  protected title = 'tic-tac-toe-showcase';
  private enhancementService = inject(VisualEnhancementService);

  ngOnInit(): void {
    // Initialize visual enhancements on app startup
    this.enhancementService.initializeEnhancements();
  }
}
