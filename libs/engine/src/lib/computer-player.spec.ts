import { ComputerPlayer } from './computer-player';
import { GameState } from '@libs/shared';
import { createEmptyBoard } from '@libs/shared';

describe('ComputerPlayer', () => {
  let computer: ComputerPlayer;

  // Helper function to create test GameState
  function createTestGameState(boardOverrides: ('X' | 'O' | null)[] = []): GameState {
    const emptyBoard = createEmptyBoard();
    const board = boardOverrides.length > 0 ? boardOverrides : emptyBoard;
    
    return {
      board: board as readonly ('X' | 'O' | null)[],
      currentPlayer: 'O', // Computer plays as O
      winner: null,
      status: 'playing',
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
});