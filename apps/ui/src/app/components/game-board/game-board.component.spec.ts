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

  afterEach(() => {
    fixture.destroy();                  // destroys effect scope
    TestBed.resetTestingModule?.();     // optional, if you create many modules
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 9 cells for 3x3 board', () => {
    const cells = fixture.debugElement.queryAll(By.css('[data-testid^="cell-"]'));
    expect(cells.length).toBe(9);
  });

  it('should render 16 cells for 4x4 board', () => {
    gameService.changeBoardSize(4);
    fixture.detectChanges();
    
    const cells = fixture.debugElement.queryAll(By.css('[data-testid^="cell-"]'));
    expect(cells.length).toBe(16);
  });

  it('should render 49 cells for 7x7 board', () => {
    gameService.changeBoardSize(7);
    fixture.detectChanges();
    
    const cells = fixture.debugElement.queryAll(By.css('[data-testid^="cell-"]'));
    expect(cells.length).toBe(49);
  });

  it('should apply correct CSS class for 7x7 board', () => {
    gameService.changeBoardSize(7);
    fixture.detectChanges();
    
    const boardElement = fixture.debugElement.query(By.css('[data-testid="game-board"]'));
    expect(boardElement.nativeElement.classList).toContain('board-7x7');
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
    expect(firstCell.nativeElement.textContent.trim()).toBe('X');
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

  // Tests for Story 7.1: Color Application
  describe('Player Color Application', () => {
    it('should apply CSS custom properties for default colors', () => {
      const hostElement = fixture.nativeElement;
      
      // Check that default CSS custom properties are set
      expect(hostElement.style.getPropertyValue('--x-player-color')).toBe('#22d3ee');
      expect(hostElement.style.getPropertyValue('--o-player-color')).toBe('#f9a8d4');
    });

    it('should update CSS custom properties when colors change', () => {
      const hostElement = fixture.nativeElement;
      
      // Change colors through service
      gameService.changeXColor('#ff0000');
      gameService.changeOColor('#00ff00');
      fixture.detectChanges();
      
      // Verify CSS custom properties are updated
      expect(hostElement.style.getPropertyValue('--x-player-color')).toBe('#ff0000');
      expect(hostElement.style.getPropertyValue('--o-player-color')).toBe('#00ff00');
    });

    it('should apply player-x class to X moves', () => {
      gameService.makeMove(0);
      fixture.detectChanges();
      
      const firstCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
      expect(firstCell.nativeElement.classList).toContain('player-x');
    });

    it('should apply player-o class to O moves', () => {
      gameService.makeMove(0); // X move
      gameService.makeMove(1); // O move
      fixture.detectChanges();
      
      const secondCell = fixture.debugElement.query(By.css('[data-testid="cell-1"]'));
      expect(secondCell.nativeElement.classList).toContain('player-o');
    });

    it('should maintain color properties during game mode changes', () => {
      const hostElement = fixture.nativeElement;
      
      // Set custom colors
      gameService.changeXColor('#ff0000');
      gameService.changeOColor('#00ff00');
      fixture.detectChanges();
      
      // Change game mode
      gameService.changeGameMode('human-vs-computer');
      fixture.detectChanges();
      
      // Colors should persist
      expect(hostElement.style.getPropertyValue('--x-player-color')).toBe('#ff0000');
      expect(hostElement.style.getPropertyValue('--o-player-color')).toBe('#00ff00');
    });

    it('should maintain color properties during board size changes', () => {
      const hostElement = fixture.nativeElement;
      
      // Set custom colors
      gameService.changeXColor('#ff0000');
      gameService.changeOColor('#00ff00');
      fixture.detectChanges();
      
      // Change board size
      gameService.changeBoardSize(4);
      fixture.detectChanges();
      
      // Colors should persist
      expect(hostElement.style.getPropertyValue('--x-player-color')).toBe('#ff0000');
      expect(hostElement.style.getPropertyValue('--o-player-color')).toBe('#00ff00');
    });

    it('should apply colors immediately to existing moves', () => {
      // Make some moves first
      gameService.makeMove(0); // X
      gameService.makeMove(1); // O
      fixture.detectChanges();
      
      // Change colors
      gameService.changeXColor('#ff0000');
      gameService.changeOColor('#00ff00');
      fixture.detectChanges();
      
      const hostElement = fixture.nativeElement;
      expect(hostElement.style.getPropertyValue('--x-player-color')).toBe('#ff0000');
      expect(hostElement.style.getPropertyValue('--o-player-color')).toBe('#00ff00');
      
      // Verify cells still have correct player classes
      const xCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
      const oCell = fixture.debugElement.query(By.css('[data-testid="cell-1"]'));
      expect(xCell.nativeElement.classList).toContain('player-x');
      expect(oCell.nativeElement.classList).toContain('player-o');
    });

    it('should handle rapid color changes without issues', () => {
      const hostElement = fixture.nativeElement;
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
      
      colors.forEach(color => {
        gameService.changeXColor(color);
        gameService.changeOColor(color);
        fixture.detectChanges();
        
        expect(hostElement.style.getPropertyValue('--x-player-color')).toBe(color);
        expect(hostElement.style.getPropertyValue('--o-player-color')).toBe(color);
      });
    });

    it('should maintain color styling with winning cells', () => {
      const hostElement = fixture.nativeElement;
      
      // Set custom colors
      gameService.changeXColor('#ff0000');
      gameService.changeOColor('#00ff00');
      fixture.detectChanges();
      
      // Create winning scenario
      gameService.makeMove(0); // X
      gameService.makeMove(3); // O
      gameService.makeMove(1); // X
      gameService.makeMove(4); // O
      gameService.makeMove(2); // X wins
      fixture.detectChanges();
      
      // Verify colors persist and winning cells are marked
      expect(hostElement.style.getPropertyValue('--x-player-color')).toBe('#ff0000');
      expect(hostElement.style.getPropertyValue('--o-player-color')).toBe('#00ff00');
      
      const winningCells = fixture.debugElement.queryAll(By.css('.winning.player-x'));
      expect(winningCells.length).toBe(3);
    });

    it('should work correctly with different board sizes', () => {
      const hostElement = fixture.nativeElement;
      const boardSizes = [3, 4, 7];
      
      boardSizes.forEach(size => {
        gameService.changeBoardSize(size);
        gameService.changeXColor('#ff0000');
        gameService.changeOColor('#00ff00');
        fixture.detectChanges();
        
        expect(hostElement.style.getPropertyValue('--x-player-color')).toBe('#ff0000');
        expect(hostElement.style.getPropertyValue('--o-player-color')).toBe('#00ff00');
        
        // Make a move to verify functionality
        gameService.makeMove(0);
        fixture.detectChanges();
        
        const firstCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
        expect(firstCell.nativeElement.classList).toContain('player-x');
        
        gameService.resetGame();
      });
    });
  });
});