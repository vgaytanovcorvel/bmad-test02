import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty board and X as first player', () => {
      const state = service.gameState();
      
      expect(state.board.every(cell => cell === null)).toBe(true);
      expect(state.currentPlayer).toBe('X');
      expect(state.status).toBe('playing');
      expect(service.isTerminal()).toBe(false);
    });
  });

  describe('makeMove', () => {
    it('should place human move on board', () => {
      service.makeMove(0);
      
      const state = service.gameState();
      expect(state.board[0]).toBe('X');
      expect(state.currentPlayer).toBe('O');
    });

    it('should reject invalid moves', () => {
      service.makeMove(0); // Valid move
      const initialMoveCount = service.gameState().moveHistory.length;
      
      service.makeMove(0); // Try to move in same cell
      
      expect(service.gameState().moveHistory.length).toBe(initialMoveCount);
    });

    it('should not allow moves when game is terminal', () => {
      // Set up a winning state
      const winningMoves = [0, 3, 1, 4, 2]; // X wins on top row
      winningMoves.forEach(move => service.makeMove(move));
      
      const initialState = service.gameState();
      service.makeMove(6); // Try to make another move
      
      expect(service.gameState()).toEqual(initialState);
    });
  });

  describe('Game Flow', () => {
    it('should detect win condition', () => {
      // X wins on top row: positions 0, 1, 2
      service.makeMove(0); // X
      service.makeMove(3); // O
      service.makeMove(1); // X
      service.makeMove(4); // O
      service.makeMove(2); // X wins
      
      const state = service.gameState();
      expect(state.status).toBe('won');
      expect(service.winner()).toBe('X');
      expect(service.isTerminal()).toBe(true);
    });
  });

  describe('Utility Methods', () => {
    it('should correctly report cell disabled state', () => {
      expect(service.isCellDisabled(0)).toBe(false);
      
      service.makeMove(0);
      expect(service.isCellDisabled(0)).toBe(true);
    });

    it('should return correct cell values', () => {
      expect(service.getCellValue(0)).toBe('');
      
      service.makeMove(0);
      expect(service.getCellValue(0)).toBe('X');
    });
  });

  describe('resetGame', () => {
    it('should reset game to initial state', () => {
      service.makeMove(0);
      service.makeMove(1);
      
      service.resetGame();
      
      const state = service.gameState();
      expect(state.board.every(cell => cell === null)).toBe(true);
      expect(state.currentPlayer).toBe('X');
      expect(state.status).toBe('playing');
      expect(state.moveHistory).toHaveLength(0);
    });
  });

  // Tests for Story 3.3: Configuration Management
  describe('Configuration Management', () => {
    describe('currentMode', () => {
      it('should return current game mode', () => {
        expect(service.currentMode()).toBe('human-vs-human');
      });
    });

    describe('currentBoardSize', () => {
      it('should return current board size', () => {
        expect(service.currentBoardSize()).toBe(3);
      });
    });

    describe('changeGameMode', () => {
      it('should start new game with different mode', () => {
        service.makeMove(0); // Make a move
        const initialMoveCount = service.gameState().moveHistory.length;
        expect(initialMoveCount).toBe(1);
        
        service.changeGameMode('human-vs-computer');
        
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.gameState().moveHistory).toHaveLength(0); // New game started
        expect(service.gameState().board.every(cell => cell === null)).toBe(true);
      });

      it('should preserve other config settings when changing mode', () => {
        service.changeBoardSize(4); // Change to 4x4
        expect(service.currentBoardSize()).toBe(4);
        
        service.changeGameMode('human-vs-computer');
        
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.currentBoardSize()).toBe(4); // Should remain 4x4
      });
    });

    describe('changeBoardSize', () => {
      it('should start new game with different board size', () => {
        service.makeMove(0); // Make a move
        const initialMoveCount = service.gameState().moveHistory.length;
        expect(initialMoveCount).toBe(1);
        
        service.changeBoardSize(4);
        
        expect(service.currentBoardSize()).toBe(4);
        expect(service.gameState().moveHistory).toHaveLength(0); // New game started
        expect(service.gameState().board.every(cell => cell === null)).toBe(true);
        expect(service.gameState().board.length).toBe(16); // 4x4 board
      });

      it('should preserve other config settings when changing board size', () => {
        service.changeGameMode('human-vs-computer');
        expect(service.currentMode()).toBe('human-vs-computer');
        
        service.changeBoardSize(4);
        
        expect(service.currentBoardSize()).toBe(4);
        expect(service.currentMode()).toBe('human-vs-computer'); // Should remain human-vs-computer
      });
    });

    describe('Game State Utilities', () => {
      it('should correctly identify if game has started', () => {
        expect(service.hasGameStarted()).toBe(false);
        
        service.makeMove(0);
        expect(service.hasGameStarted()).toBe(true);
      });

      it('should correctly identify if game is in progress', () => {
        expect(service.isGameInProgress()).toBe(false);
        
        service.makeMove(0); // X at position 0
        expect(service.isGameInProgress()).toBe(true);
        
        // Create winning condition: X wins top row (0, 1, 2)
        service.makeMove(3); // O at position 3
        service.makeMove(1); // X at position 1  
        service.makeMove(4); // O at position 4
        service.makeMove(2); // X at position 2 - X wins!
        
        expect(service.isGameInProgress()).toBe(false); // Game ended
      });
    });
  });

  // Tests for Story 3.3: Computer Player Integration
  describe('Computer Player Integration', () => {
    beforeEach(() => {
      service.changeGameMode('human-vs-computer');
    });

    it('should detect human-vs-computer mode', () => {
      expect(service.currentMode()).toBe('human-vs-computer');
    });

    it('should handle human move without triggering infinite recursion', () => {
      // Make a human move (X) 
      const success = service.makeMove(0);
      
      expect(success).toBe(true);
      expect(service.gameState().board[0]).toBe('X');
    });

    it('should handle human moves in human-vs-computer mode', () => {
      // Make a human move (X) in human-vs-computer mode
      const success = service.makeMove(0);
      
      expect(success).toBe(true);
      expect(service.gameState().board[0]).toBe('X');
      expect(service.currentMode()).toBe('human-vs-computer');
    });
  });
});