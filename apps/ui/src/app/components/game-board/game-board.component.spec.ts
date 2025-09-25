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

  it('should render 9 cells for 3x3 board', () => {
    const cells = fixture.debugElement.queryAll(By.css('[data-testid^="cell-"]'));
    expect(cells.length).toBe(9);
  });

  it('should handle cell clicks by calling game service', () => {
    const makeMoveSpy = jest.spyOn(gameService, 'makeMove');
    const firstCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
    
    firstCell.nativeElement.click();
    
    expect(makeMoveSpy).toHaveBeenCalledWith(0);
  });

  it('should reflect game state changes', () => {
    // Make a move and verify UI updates
    gameService.makeMove(0);
    fixture.detectChanges();
    
    const firstCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
    expect(firstCell.nativeElement.textContent.trim()).toBe('❌');
  });

  it('should disable all cells when game is terminal', () => {
    // Create a winning scenario
    gameService.makeMove(0); // X
    gameService.makeMove(3); // O
    gameService.makeMove(1); // X
    gameService.makeMove(4); // O
    gameService.makeMove(2); // X wins
    
    fixture.detectChanges();
    
    const cells = fixture.debugElement.queryAll(By.css('button[disabled]'));
    expect(cells.length).toBe(9);
  });

  it('should highlight winning cells', () => {
    // Create a winning scenario: X wins with top row [0,1,2]
    gameService.makeMove(0); // X
    gameService.makeMove(3); // O
    gameService.makeMove(1); // X
    gameService.makeMove(4); // O
    gameService.makeMove(2); // X wins
    
    fixture.detectChanges();
    
    const winningCells = fixture.debugElement.queryAll(By.css('.winning'));
    expect(winningCells.length).toBe(3);
  });

  it('should have proper accessibility labels', () => {
    const firstCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
    const ariaLabel = firstCell.nativeElement.getAttribute('aria-label');
    expect(ariaLabel).toContain('Cell row 1 column 1');
    expect(ariaLabel).toContain('empty, click to place mark');
  });

  it('should update accessibility labels after moves', () => {
    gameService.makeMove(0);
    fixture.detectChanges();
    
    const firstCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
    const ariaLabel = firstCell.nativeElement.getAttribute('aria-label');
    expect(ariaLabel).toContain('occupied by X');
  });
});