import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GameBoardComponent } from './game-board.component';
import { GameService } from '../../services/game.service';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let gameService: GameService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoardComponent],
      providers: [GameService]
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 9 cells', () => {
    const cells = fixture.debugElement.queryAll(By.css('[data-testid^="cell-"]'));
    expect(cells.length).toBe(9);
  });

  it('should display current player status initially', () => {
    const statusElement = fixture.debugElement.query(By.css('[data-testid="game-status"]'));
    expect(statusElement.nativeElement.textContent).toContain('Current player: X');
  });

  it('should handle cell clicks by calling game service', () => {
    const makeMoveSpy = jest.spyOn(gameService, 'makeMove');
    const firstCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
    
    firstCell.nativeElement.click();
    
    expect(makeMoveSpy).toHaveBeenCalledWith(0);
  });

  it('should display reset button', () => {
    const resetButton = fixture.debugElement.query(By.css('[data-testid="reset-button"]'));
    expect(resetButton).toBeTruthy();
  });

  it('should handle reset game clicks', () => {
    const resetGameSpy = jest.spyOn(gameService, 'resetGame');
    const resetButton = fixture.debugElement.query(By.css('[data-testid="reset-button"]'));
    
    resetButton.nativeElement.click();
    
    expect(resetGameSpy).toHaveBeenCalled();
  });

  it('should reflect game state changes', () => {
    // Make a move and verify UI updates
    gameService.makeMove(0);
    fixture.detectChanges();
    
    const firstCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
    expect(firstCell.nativeElement.textContent.trim()).toBe('X');
    
    // Status should reflect current player change
    const statusElement = fixture.debugElement.query(By.css('[data-testid="game-status"]'));
    const statusText = statusElement.nativeElement.textContent;
    
    // Should show either current player or game result
    expect(
      statusText.includes('Current player:') || 
      statusText.includes('wins!') || 
      statusText.includes('draw!')
    ).toBe(true);
  });
});