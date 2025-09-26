import { createEmptyBoard, isValidPosition, isCellEmpty, getOpponent, formatPlayerSymbol } from './utils';
import { GameState, Player, Cell, GameConfig } from './types';

// Helper function to create test GameConfig
function createTestConfig(): GameConfig {
  return {
    boardSize: 3,
    kInRow: 3,
    firstPlayer: 'X',
    mode: 'human-vs-human'
  };
}

describe('Shared Library Integration Tests', () => {
  describe('Board and Position Validation Integration', () => {
    it('should create valid board and validate all positions', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(9);
      
      // All positions should be valid and empty initially
      for (let i = 0; i < 9; i++) {
        expect(isValidPosition(i)).toBe(true);
        expect(isCellEmpty(board, i)).toBe(true);
      }
    });

    it('should handle board state changes through gameplay simulation', () => {
      // Create a mutable board for simulation
      const mutableBoard: Cell[] = Array(9).fill(null);
      
      const gameSequence: { position: number; player: Player }[] = [
        { position: 0, player: 'X' },
        { position: 4, player: 'O' },
        { position: 1, player: 'X' },
        { position: 3, player: 'O' },
      ];

      gameSequence.forEach(({ position, player }) => {
        // Validate position before move
        expect(isValidPosition(position)).toBe(true);
        expect(isCellEmpty(mutableBoard, position)).toBe(true);
        
        // Make move
        mutableBoard[position] = player;
        
        // Validate position after move
        expect(isCellEmpty(mutableBoard, position)).toBe(false);
      });

      // Verify final board state
      expect(mutableBoard[0]).toBe('X');
      expect(mutableBoard[1]).toBe('X');
      expect(mutableBoard[3]).toBe('O');
      expect(mutableBoard[4]).toBe('O');
      
      // Verify empty cells
      expect(isCellEmpty(mutableBoard, 2)).toBe(true);
      expect(isCellEmpty(mutableBoard, 5)).toBe(true);
    });

    it('should validate edge cases and boundary conditions', () => {
      const board = createEmptyBoard();
      
      // Invalid positions
      expect(isValidPosition(-1)).toBe(false);
      expect(isValidPosition(9)).toBe(false);
      expect(isValidPosition(1.5)).toBe(false);
      
      // These should return false for invalid positions
      expect(isCellEmpty(board, -1)).toBe(false);
      expect(isCellEmpty(board, 9)).toBe(false);
    });
  });

  describe('Player and Game State Integration', () => {
    it('should handle player alternation correctly', () => {
      let currentPlayer: Player = 'X';
      const players: Player[] = [];
      
      // Simulate 6 moves with alternating players
      for (let i = 0; i < 6; i++) {
        players.push(currentPlayer);
        currentPlayer = getOpponent(currentPlayer);
      }
      
      expect(players).toEqual(['X', 'O', 'X', 'O', 'X', 'O']);
    });

    it('should format player symbols consistently', () => {
      const config = createTestConfig();
      const board: readonly Cell[] = ['X', 'O', 'X', null, null, null, 'O', 'X', null];
      
      const gameState: GameState = {
        board,
        currentPlayer: 'O',
        winner: null,
        status: 'playing',
        moveHistory: [],
        winningLine: null,
        config,
        startTime: Date.now()
      };

      // Test formatting for all board positions
      gameState.board.forEach((cell) => {
        const formatted = formatPlayerSymbol(cell);
        
        if (cell === 'X') {
          expect(formatted).toBe('X');
        } else if (cell === 'O') {
          expect(formatted).toBe('O');
        } else {
          expect(formatted).toBe('');
        }
      });
    });

    it('should maintain data consistency across utility functions', () => {
      // Create a mutable board for testing
      const mutableBoard: Cell[] = Array(9).fill(null);
      mutableBoard[0] = 'X';
      mutableBoard[4] = 'O';
      mutableBoard[8] = 'X';
      
      // Convert to readonly for function calls
      const board = mutableBoard as readonly Cell[];
      
      // Verify consistency
      expect(isValidPosition(0) && !isCellEmpty(board, 0)).toBe(true);
      expect(isValidPosition(4) && !isCellEmpty(board, 4)).toBe(true);
      expect(isValidPosition(8) && !isCellEmpty(board, 8)).toBe(true);
      
      // Empty cells should still be valid positions but empty
      expect(isValidPosition(1) && isCellEmpty(board, 1)).toBe(true);
      expect(isValidPosition(5) && isCellEmpty(board, 5)).toBe(true);
      
      // Formatting should work for populated cells
      expect(formatPlayerSymbol(board[0])).toBe('X');
      expect(formatPlayerSymbol(board[4])).toBe('O');
      expect(formatPlayerSymbol(board[1])).toBe('');
    });
  });

  describe('Game State Validation Integration', () => {
    it('should create and validate complete game state objects', () => {
      const config = createTestConfig();
      const initialState: GameState = {
        board: createEmptyBoard(),
        currentPlayer: 'X',
        winner: null,
        status: 'playing',
        moveHistory: [],
        winningLine: null,
        config,
        startTime: Date.now()
      };

      // Validate initial state
      expect(initialState.board.every(cell => cell === null)).toBe(true);
      expect(initialState.currentPlayer).toBe('X');
      expect(initialState.status).toBe('playing');
      expect(initialState.moveHistory).toHaveLength(0);

      // Create immutable updated state
      const mutableBoard: Cell[] = [...initialState.board];
      mutableBoard[0] = 'X';
      
      const updatedState: GameState = {
        ...initialState,
        board: mutableBoard as readonly Cell[],
        currentPlayer: getOpponent(initialState.currentPlayer),
        moveHistory: [{
          player: 'X',
          position: 0,
          timestamp: Date.now()
        }]
      };

      // Validate updated state
      expect(updatedState.board[0]).toBe('X');
      expect(updatedState.currentPlayer).toBe('O');
      expect(updatedState.moveHistory).toHaveLength(1);
      expect(updatedState.moveHistory[0].player).toBe('X');
      expect(updatedState.moveHistory[0].position).toBe(0);
    });

    it('should handle terminal game states', () => {
      const config = createTestConfig();
      const board: readonly Cell[] = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
      
      // Winning state
      const winningState: GameState = {
        board,
        currentPlayer: 'O',
        winner: 'X',
        status: 'won',
        moveHistory: [
          { player: 'X', position: 0, timestamp: Date.now() - 5000 },
          { player: 'O', position: 3, timestamp: Date.now() - 4000 },
          { player: 'X', position: 1, timestamp: Date.now() - 3000 },
          { player: 'O', position: 4, timestamp: Date.now() - 2000 },
          { player: 'X', position: 2, timestamp: Date.now() - 1000 },
        ],
        winningLine: [0, 1, 2],
        config,
        startTime: Date.now() - 6000,
        endTime: Date.now() - 1000
      };

      // Validate winning state
      expect(winningState.status).toBe('won');
      expect(winningState.winner).toBe('X');
      expect(winningState.winningLine).toEqual([0, 1, 2]);
      expect(winningState.moveHistory).toHaveLength(5);

      // Verify board positions match move history
      expect(winningState.board[0]).toBe('X');
      expect(winningState.board[1]).toBe('X');
      expect(winningState.board[2]).toBe('X');
      expect(winningState.board[3]).toBe('O');
      expect(winningState.board[4]).toBe('O');
    });
  });
});