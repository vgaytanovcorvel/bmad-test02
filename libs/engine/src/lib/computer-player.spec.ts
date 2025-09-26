import { ComputerPlayer } from './computer-player';
import { GameState } from '@libs/shared';
import { createEmptyBoard } from '@libs/shared';

describe('ComputerPlayer', () => {
  let computer: ComputerPlayer;

  // Helper function to create test GameState
  function createTestGameState(
    boardOverrides: ('X' | 'O' | null)[] = [],
    currentPlayer: 'X' | 'O' = 'O',
    status: 'playing' | 'won' | 'draw' = 'playing',
    winner: 'X' | 'O' | null = null
  ): GameState {
    const emptyBoard = createEmptyBoard();
    const board = boardOverrides.length > 0 ? boardOverrides : emptyBoard;
    
    return {
      board: board as readonly ('X' | 'O' | null)[],
      currentPlayer,
      winner,
      status,
      moveHistory: [],
      winningLine: null,
      config: {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-computer'
      },
      startTime: Date.now()
    };
  }

  beforeEach(() => {
    computer = new ComputerPlayer();
  });

  describe('calculateNextMove', () => {
    it('should take winning move when available', () => {
      // O can win by playing position 2
      const state = createTestGameState([
        'O', 'O', null,
        'X', 'X', null,
        null, null, null
      ]);

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(2);
    });

    it('should block opponent winning move', () => {
      // X is about to win at position 2, O should block
      const state = createTestGameState([
        'X', 'X', null,
        'O', null, null,
        null, null, null
      ]);

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(2);
    });

    it('should take center when available', () => {
      const state = createTestGameState([
        'X', null, null,
        null, null, null,
        null, null, null
      ]);

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(4); // Center position
    });

    it('should prefer corners when center is taken', () => {
      const state = createTestGameState([
        null, null, null,
        null, 'X', null,
        null, null, null
      ]);

      const move = computer.calculateNextMove(state);
      
      expect([0, 2, 6, 8]).toContain(move); // Should be a corner
    });

    it('should take any available position as fallback', () => {
      const state = createTestGameState([
        'X', 'O', 'X',
        'X', 'O', 'O',
        'O', 'X', null
      ]);

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(8); // Only position left
    });

    it('should prioritize winning over blocking', () => {
      // Both O and X have two in a row
      const state = createTestGameState([
        'O', 'O', null, // O can win at 2
        'X', 'X', null, // X can win at 5
        null, null, null
      ]);

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(2); // Should take the win instead of blocking
    });
  });

  describe('Computer Player Optimization Tests (AC 2)', () => {
    it('should recognize and take immediate win opportunity', () => {
      // Computer (O) has two in a row - top row, can win at position 2
      const state = createTestGameState([
        'O', 'O', null,
        'X', null, null,
        null, null, null
      ], 'O');

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(2); // Should take the winning position
    });

    it('should recognize diagonal win opportunity', () => {
      // Computer (O) can win diagonally at position 8
      const state = createTestGameState([
        'O', null, null,
        null, 'O', null,
        null, null, null
      ], 'O');

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(8); // Should take the diagonal win
    });

    it('should block opponent immediate win threat', () => {
      // Opponent (X) has two in a row, computer must block at position 2
      const state = createTestGameState([
        'X', 'X', null,
        'O', null, null,
        null, null, null
      ], 'O');

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(2); // Should block opponent's win
    });

    it('should block opponent diagonal threat', () => {
      // Opponent (X) threatens diagonal win, computer must block at position 8
      const state = createTestGameState([
        'X', null, null,
        null, 'X', null,
        null, null, null
      ], 'O');

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(8); // Should block diagonal threat
    });

    it('should choose optimal move when multiple options exist', () => {
      // After win/block, should prefer center
      const state = createTestGameState([
        'X', null, null,
        null, null, null,
        null, null, 'O'
      ], 'O');

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(4); // Should take center as optimal strategy
    });

    it('should choose corner when center is unavailable', () => {
      // Center taken, should prefer corner
      const state = createTestGameState([
        null, null, null,
        null, 'X', null,
        null, null, 'O'
      ], 'O');

      const move = computer.calculateNextMove(state);
      
      expect([0, 2, 6]).toContain(move); // Should choose available corner
    });

    it('should handle edge cases - full board scenario', () => {
      // Almost full board, should find the last available spot
      const state = createTestGameState([
        'X', 'O', 'X',
        'O', 'X', 'O',
        'O', 'X', null
      ], 'O');

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(8); // Only available position
    });

    it('should handle game over states gracefully', () => {
      // Game already won by X
      const state = createTestGameState([
        'X', 'X', 'X',
        'O', 'O', null,
        null, null, null
      ], 'O', 'won', 'X');

      const move = computer.calculateNextMove(state);
      
      // Should still return a valid move (the algorithm doesn't check game state)
      expect([5, 6, 7, 8]).toContain(move);
    });

    it('should make deterministic moves for testing', () => {
      // Same board state should always produce same move
      const boardState: ('X' | 'O' | null)[] = [
        'X', null, null,
        null, 'O', null,
        null, null, null
      ];
      
      const state1 = createTestGameState(boardState, 'O');
      const state2 = createTestGameState(boardState, 'O');

      const move1 = computer.calculateNextMove(state1);
      const move2 = computer.calculateNextMove(state2);
      
      expect(move1).toBe(move2); // Should be deterministic
    });

    it('should prioritize winning over all other considerations', () => {
      // Computer can win even though opponent also threatens
      const state = createTestGameState([
        'O', 'O', null, // Computer can win at 2
        'X', 'X', null, // Opponent can win at 5
        null, null, null
      ], 'O');

      const move = computer.calculateNextMove(state);
      
      expect(move).toBe(2); // Should take win instead of blocking
    });

    it('should handle multiple win opportunities correctly', () => {
      // Computer has multiple ways to win - should pick one
      const state = createTestGameState([
        'O', 'O', null, // Can win at 2
        null, 'O', null, // Can also win at 3 (column)
        null, null, null
      ], 'O');

      const move = computer.calculateNextMove(state);
      
      expect([2, 3]).toContain(move); // Should pick either winning move
    });

    it('should handle multiple blocking opportunities', () => {
      // Multiple opponent threats - should block one
      const state = createTestGameState([
        'X', 'X', null, // Threat at 2
        'X', null, null, // Threat at 4 (column)
        null, null, null
      ], 'O');

      const move = computer.calculateNextMove(state);
      
      expect([2, 4]).toContain(move); // Should block one of the threats
    });
  });
});