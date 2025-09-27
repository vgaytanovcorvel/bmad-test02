import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GameControlsComponent } from './game-controls.component';
import { GameService } from '../../services/game.service';

import { GameMode, BoardSize } from '@libs/shared';

describe('GameControlsComponent', () => {
  let component: GameControlsComponent;
  let fixture: ComponentFixture<GameControlsComponent>;
  let mockGameService: jest.Mocked<Pick<GameService, 'changeGameMode' | 'changeBoardSize' | 'resetGame' | 'currentMode' | 'currentBoardSize'>>;

  beforeEach(async () => {
    // Create mock service with Jest mocks
    const gameServiceSpy = {
      changeGameMode: jest.fn(),
      changeBoardSize: jest.fn(),
      resetGame: jest.fn(),
      currentMode: jest.fn(() => 'human-vs-human' as GameMode),
      currentBoardSize: jest.fn(() => 3 as BoardSize)
    };

    await TestBed.configureTestingModule({
      imports: [GameControlsComponent],
      providers: [
        { provide: GameService, useValue: gameServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameControlsComponent);
    component = fixture.componentInstance;
    mockGameService = TestBed.inject(GameService) as jest.Mocked<Pick<GameService, 'changeGameMode' | 'changeBoardSize' | 'resetGame' | 'currentMode' | 'currentBoardSize'>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render game controls container', () => {
    const controlsElement = fixture.debugElement.query(By.css('[data-testid="game-controls"]'));
    expect(controlsElement).toBeTruthy();
  });

  it('should render mode selector with correct options', () => {
    const modeSelector = fixture.debugElement.query(By.css('[data-testid="mode-selector"]'));
    expect(modeSelector).toBeTruthy();
    
    const options = modeSelector.nativeElement.options;
    expect(options.length).toBe(2);
    expect(options[0].value).toBe('human-vs-human');
    expect(options[0].text).toBe('Human vs Human');
    expect(options[1].value).toBe('human-vs-computer');
    expect(options[1].text).toBe('Human vs Computer');
  });

  it('should render board size selector with correct options', () => {
    const sizeSelector = fixture.debugElement.query(By.css('[data-testid="size-selector"]'));
    expect(sizeSelector).toBeTruthy();
    
    const options = sizeSelector.nativeElement.options;
    expect(options.length).toBe(3);
    expect(options[0].value).toBe('3');
    expect(options[0].text).toBe('3×3');
    expect(options[1].value).toBe('4');
    expect(options[1].text).toBe('4×4');
    expect(options[2].value).toBe('7');
    expect(options[2].text).toBe('7×7');
  });

  it('should render new game button', () => {
    const newGameButton = fixture.debugElement.query(By.css('[data-testid="new-game-button"]'));
    expect(newGameButton).toBeTruthy();
    expect(newGameButton.nativeElement.textContent.trim()).toBe('New Game');
  });

  it('should display current mode from service', () => {
    const modeSelector = fixture.debugElement.query(By.css('[data-testid="mode-selector"]'));
    expect(modeSelector.nativeElement.value).toBe('human-vs-human');
  });

  it('should display current board size from service', () => {
    const sizeSelector = fixture.debugElement.query(By.css('[data-testid="size-selector"]'));
    expect(sizeSelector.nativeElement.value).toBe('3');
  });

  it('should call gameService.changeGameMode when mode selector changes', () => {
    const modeSelector = fixture.debugElement.query(By.css('[data-testid="mode-selector"]'));
    
    modeSelector.nativeElement.value = 'human-vs-computer';
    modeSelector.nativeElement.dispatchEvent(new Event('change'));
    
    expect(mockGameService.changeGameMode).toHaveBeenCalledWith('human-vs-computer');
  });

  it('should call gameService.changeBoardSize when size selector changes', () => {
    const sizeSelector = fixture.debugElement.query(By.css('[data-testid="size-selector"]'));
    
    sizeSelector.nativeElement.value = '4';
    sizeSelector.nativeElement.dispatchEvent(new Event('change'));
    
    expect(mockGameService.changeBoardSize).toHaveBeenCalledWith(4);
  });

  it('should call gameService.changeBoardSize with 7 when 7x7 option is selected', () => {
    const sizeSelector = fixture.debugElement.query(By.css('[data-testid="size-selector"]'));
    
    sizeSelector.nativeElement.value = '7';
    sizeSelector.nativeElement.dispatchEvent(new Event('change'));
    
    expect(mockGameService.changeBoardSize).toHaveBeenCalledWith(7);
  });

  it('should call gameService.resetGame when new game button is clicked', () => {
    const newGameButton = fixture.debugElement.query(By.css('[data-testid="new-game-button"]'));
    
    newGameButton.nativeElement.click();
    
    expect(mockGameService.resetGame).toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    const modeSelector = fixture.debugElement.query(By.css('[data-testid="mode-selector"]'));
    const sizeSelector = fixture.debugElement.query(By.css('[data-testid="size-selector"]'));
    const newGameButton = fixture.debugElement.query(By.css('[data-testid="new-game-button"]'));
    
    expect(modeSelector.nativeElement.getAttribute('aria-label')).toBe('Select game mode');
    expect(sizeSelector.nativeElement.getAttribute('aria-label')).toBe('Select board size');
    expect(newGameButton.nativeElement.getAttribute('aria-label')).toBe('Start new game');
  });

  it('should have proper semantic HTML structure', () => {
    const labels = fixture.debugElement.queryAll(By.css('label'));
    const selects = fixture.debugElement.queryAll(By.css('select'));
    
    expect(labels.length).toBe(2);
    expect(selects.length).toBe(2);
    
    // Check label-input association
    expect(labels[0].nativeElement.getAttribute('for')).toBe('game-mode');
    expect(labels[1].nativeElement.getAttribute('for')).toBe('board-size');
    expect(selects[0].nativeElement.id).toBe('game-mode');
    expect(selects[1].nativeElement.id).toBe('board-size');
  });
});