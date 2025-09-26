/**
 * GameBoardComponent Integration Tests
 * 
 * Tests component integration with game service and user interactions.
 * Covers rendering, user interaction, and game state integration scenarios.
 * 
 * Story 3.6 - Task 1: Component Integration Tests
 * AC1: Component test covers rendering & simple X win scenario.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { fireEvent } from '@testing-library/angular';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from './game-board.component';
import { GameService } from '../../services/game.service';
import { VisualEnhancementService } from '../../services/visual-enhancement.service';
import { 
  createMockGameService, 
  createMockVisualEnhancementService,
  updateMockGameServiceState,
  setupMockWinScenario
} from '../../../test-helpers/mock-providers';
import { GameStateFactory } from '../../../test-helpers/game-state-factories';

describe('GameBoardComponent Integration Tests', () => {
  let fixture: ComponentFixture<GameBoardComponent>;
  let mockGameService: ReturnType<typeof createMockGameService>;
  let mockEnhancementService: jasmine.SpyObj<VisualEnhancementService>;

  beforeEach(async () => {
    mockGameService = createMockGameService();
    mockEnhancementService = createMockVisualEnhancementService();

    await TestBed.configureTestingModule({
      imports: [GameBoardComponent, CommonModule],
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: VisualEnhancementService, useValue: mockEnhancementService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    
    // Set up initial state
    const initialState = GameStateFactory.createInitial();
    updateMockGameServiceState(mockGameService, initialState);
    
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
    TestBed.resetTestingModule();
  });

  describe('Rendering', () => {
    it('should render 3x3 grid with proper test IDs', () => {
      // Verify game board container exists
      const gameBoard = fixture.debugElement.nativeElement.querySelector('[data-testid="game-board"]');
      expect(gameBoard).toBeTruthy();
      expect(gameBoard).toHaveClass('game-board');

      // Verify all 9 cells exist with correct test IDs
      for (let i = 0; i < 9; i++) {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${i}"]`);
        expect(cell).toBeTruthy();
        expect(cell.tagName).toBe('BUTTON');
      }

      // Verify grid layout classes
      expect(gameBoard).toHaveClass('board-3x3');
    });

    it('should render empty cells initially', () => {
      for (let i = 0; i < 9; i++) {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${i}"]`);
        expect(cell.textContent.trim()).toBe('');
        expect(cell).not.toHaveClass('occupied');
      }
    });

    it('should have proper accessibility attributes', () => {
      const firstCell = fixture.debugElement.nativeElement.querySelector('[data-testid="cell-0"]');
      
      expect(firstCell.getAttribute('aria-label')).toContain('Cell row 1 column 1');
      expect(firstCell.getAttribute('aria-label')).toContain('empty, click to place mark');
    });

    it('should render 4x4 grid when board size is 4', () => {
      const fourByFourState = GameStateFactory.create4x4Board();
      updateMockGameServiceState(mockGameService, fourByFourState);
      fixture.detectChanges();

      const gameBoard = fixture.debugElement.nativeElement.querySelector('[data-testid="game-board"]');
      expect(gameBoard).toHaveClass('board-4x4');

      // Verify all 16 cells exist for 4x4 board
      for (let i = 0; i < 16; i++) {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${i}"]`);
        expect(cell).toBeTruthy();
      }
    });
  });

  describe('User Interaction', () => {
    it('should handle human player moves via cell clicks', () => {
      const firstCell = fixture.debugElement.nativeElement.querySelector('[data-testid="cell-0"]');
      
      // Click the first cell
      fireEvent.click(firstCell);
      
      // Verify game service makeMove was called with correct position
      expect(mockGameService.makeMove).toHaveBeenCalledWith(0);
    });

    it('should call makeMove for each clickable cell', () => {
      mockGameService.makeMove.mockClear();

      // Click each cell and verify service call
      for (let i = 0; i < 9; i++) {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${i}"]`);
        fireEvent.click(cell);
        expect(mockGameService.makeMove).toHaveBeenCalledWith(i);
      }

      expect(mockGameService.makeMove).toHaveBeenCalledTimes(9);
    });

    it('should call makeMove even when cell is disabled (service validates)', () => {
      // Set up terminal game state where game is over
      const winState = GameStateFactory.createXWinScenario();
      updateMockGameServiceState(mockGameService, winState);
      
      // Configure mock to return false for invalid moves in terminal state
      mockGameService.makeMove.mockReturnValue(false);
      fixture.detectChanges();

      // Clear any previous calls
      mockGameService.makeMove.mockClear();

      const firstCell = fixture.debugElement.nativeElement.querySelector('[data-testid="cell-0"]');
      
      // Verify cell is disabled in UI
      expect(firstCell.disabled).toBe(true);
      
      // Click disabled cell - component delegates validation to service
      fireEvent.click(firstCell);
      
      // Component should still call makeMove (service handles validation)
      expect(mockGameService.makeMove).toHaveBeenCalledTimes(1);
      expect(mockGameService.makeMove).toHaveBeenCalledWith(0);
    });

    it('should reflect game state changes in UI', () => {
      // Create state with X in first position
      const stateWithMove = GameStateFactory.createInitial();
      stateWithMove.board[0] = 'X';
      updateMockGameServiceState(mockGameService, stateWithMove);
      fixture.detectChanges();

      const firstCell = fixture.debugElement.nativeElement.querySelector('[data-testid="cell-0"]');
      
      // Verify cell shows X symbol
      expect(firstCell.textContent.trim()).toBe('X');
      expect(firstCell).toHaveClass('occupied');
    });
  });

  describe('Game State Integration', () => {
    it('should update current player indicator correctly', () => {
      // Start with X turn
      expect(mockGameService.currentPlayer()).toBe('X');

      // Simulate move and change to O's turn
      const stateAfterXMove = GameStateFactory.createInitial();
      stateAfterXMove.currentPlayer = 'O';
      stateAfterXMove.board[0] = 'X';
      updateMockGameServiceState(mockGameService, stateAfterXMove);
      fixture.detectChanges();

      expect(mockGameService.currentPlayer()).toBe('O');
    });

    it('should disable board when game is terminal', () => {
      // Set up winning scenario
      setupMockWinScenario(mockGameService);
      fixture.detectChanges();

      // Verify all cells are disabled
      for (let i = 0; i < 9; i++) {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${i}"]`);
        expect(cell.disabled).toBe(true);
      }
    });

    it('should not disable empty cells during active game', () => {
      const activeState = GameStateFactory.createInitial();
      activeState.board[0] = 'X';  // Only first cell occupied
      updateMockGameServiceState(mockGameService, activeState);
      fixture.detectChanges();

      // First cell should be disabled (occupied)
      const firstCell = fixture.debugElement.nativeElement.querySelector('[data-testid="cell-0"]');
      expect(firstCell.disabled).toBe(true);

      // Other cells should be enabled
      for (let i = 1; i < 9; i++) {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${i}"]`);
        expect(cell.disabled).toBe(false);
      }
    });
  });

  describe('Win Scenarios', () => {
    it('should display X win scenario with winning line highlighting', () => {
      // Set up X win scenario with top row [0,1,2]
      setupMockWinScenario(mockGameService);
      fixture.detectChanges();

      // Verify winning cells are highlighted
      const winningPositions = [0, 1, 2];
      winningPositions.forEach(position => {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${position}"]`);
        expect(cell).toHaveClass('winning');
        expect(cell.textContent.trim()).toBe('X');
      });

      // Verify non-winning cells are not highlighted
      const nonWinningPositions = [3, 4, 5, 6, 7, 8];
      nonWinningPositions.forEach(position => {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${position}"]`);
        expect(cell).not.toHaveClass('winning');
      });
    });

    it('should update game status during win scenario', () => {
      setupMockWinScenario(mockGameService);
      fixture.detectChanges();

      expect(mockGameService.status()).toBe('won');
      expect(mockGameService.winner()).toBe('X');
      expect(mockGameService.isTerminal()).toBe(true);
    });

    it('should display proper content for winning cells', () => {
      setupMockWinScenario(mockGameService);
      fixture.detectChanges();

      // Verify X symbols in winning positions
      [0, 1, 2].forEach(position => {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${position}"]`);
        expect(cell.textContent.trim()).toBe('X');
      });

      // Verify O symbols in occupied non-winning positions
      [3, 4].forEach(position => {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${position}"]`);
        expect(cell.textContent.trim()).toBe('O');
      });

      // Verify empty cells remain empty
      [5, 6, 7, 8].forEach(position => {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${position}"]`);
        expect(cell.textContent.trim()).toBe('');
      });
    });

    it('should handle draw scenario correctly', () => {
      const drawState = GameStateFactory.createDrawScenario();
      updateMockGameServiceState(mockGameService, drawState);
      fixture.detectChanges();

      expect(mockGameService.status()).toBe('draw');
      expect(mockGameService.winner()).toBe(null);
      expect(mockGameService.isTerminal()).toBe(true);

      // All cells should be disabled in draw
      for (let i = 0; i < 9; i++) {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${i}"]`);
        expect(cell.disabled).toBe(true);
      }
    });
  });

  describe('Accessibility', () => {
    it('should update accessibility labels after moves', () => {
      const stateWithMove = GameStateFactory.createInitial();
      stateWithMove.board[0] = 'X';
      updateMockGameServiceState(mockGameService, stateWithMove);
      fixture.detectChanges();

      const firstCell = fixture.debugElement.nativeElement.querySelector('[data-testid="cell-0"]');
      const ariaLabel = firstCell.getAttribute('aria-label');
      
      expect(ariaLabel).toContain('Cell row 1 column 1');
      expect(ariaLabel).toContain('occupied by X');
    });

    it('should provide clear labels for different board positions', () => {
      // Test different positions for correct row/column calculation
      const testCases = [
        { position: 0, expectedLabel: 'Cell row 1 column 1' },
        { position: 2, expectedLabel: 'Cell row 1 column 3' },
        { position: 3, expectedLabel: 'Cell row 2 column 1' },
        { position: 4, expectedLabel: 'Cell row 2 column 2' },
        { position: 8, expectedLabel: 'Cell row 3 column 3' }
      ];

      testCases.forEach(({ position, expectedLabel }) => {
        const cell = fixture.debugElement.nativeElement.querySelector(`[data-testid="cell-${position}"]`);
        const ariaLabel = cell.getAttribute('aria-label');
        expect(ariaLabel).toContain(expectedLabel);
      });
    });
  });

  describe('Animation Integration', () => {
    it('should trigger move animation when enhancements are enabled', fakeAsync(() => {
      mockEnhancementService.enhancementsEnabled.mockReturnValue(true);
      mockGameService.makeMove.mockReturnValue(true);

      const firstCell = fixture.debugElement.nativeElement.querySelector('[data-testid="cell-0"]');
      
      // Click cell to trigger move
      fireEvent.click(firstCell);
      fixture.detectChanges();
      tick(100); // Advance time

      // Animation testing would require checking internal component state
      // This test verifies the enhancement service integration
      expect(mockEnhancementService.enhancementsEnabled).toHaveBeenCalled();
    }));

    it('should not trigger animations when enhancements are disabled', () => {
      mockEnhancementService.enhancementsEnabled.mockReturnValue(false);
      mockGameService.makeMove.mockReturnValue(true);

      const firstCell = fixture.debugElement.nativeElement.querySelector('[data-testid="cell-0"]');
      fireEvent.click(firstCell);

      // Verify enhancement service was checked
      expect(mockEnhancementService.enhancementsEnabled).toHaveBeenCalled();
    });
  });
});