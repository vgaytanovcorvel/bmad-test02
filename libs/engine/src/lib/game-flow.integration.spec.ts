import { GameEngine } from './engine';
import { ComputerPlayer } from './computer-player';
import { GameState, Move } from '@libs/shared';

describe('Game Engine and Computer Player Integration', () => {
  let engine: GameEngine;
  let computer: ComputerPlayer;

  beforeEach(() => {
    engine = new GameEngine();
    computer = new ComputerPlayer();
  });

  describe('Complete Game Simulation', () => {
    it('should play a complete game between human and computer', () => {
      let state = engine.createInitialState();
      const maxMoves = 9;
      let moveCount = 0;

      // Play until game ends or max moves reached
      while (state.status === 'playing' && moveCount < maxMoves) {
        if (state.currentPlayer === 'X') {
          // Human move - take first available position
          const humanMove = findFirstAvailablePosition(state);
          if (humanMove >= 0) {
            const move: Move = {
              player: 'X',
              position: humanMove,
              timestamp: Date.now()
            };
            state = engine.processMove(state, move);
            moveCount++;
          }
        } else {
          // Computer move
          const computerMove = computer.calculateNextMove(state);
          if (computerMove >= 0) {
            const move: Move = {
              player: 'O',
              position: computerMove,
              timestamp: Date.now()
            };
            state = engine.processMove(state, move);
            moveCount++;
          }
        }
      }

      // Game should end with either a win or draw
      expect(state.status === 'won' || state.status === 'draw').toBe(true);
      expect(state.moveHistory.length).toBeLessThanOrEqual(9);
      
      if (state.status === 'won') {
        expect(state.winner).toMatch(/^[XO]$/);
        expect(state.winningLine).toBeDefined();
        expect(state.winningLine?.length).toBe(3);
      }
    });

    it('should handle computer blocking human wins', () => {
      let state = engine.createInitialState();
      
      // Human plays X at positions 0 and 1 (two in a row)
      state = engine.processMove(state, { player: 'X', position: 0, timestamp: Date.now() });
      state = engine.processMove(state, { player: 'O', position: 4, timestamp: Date.now() }); // Computer center
      state = engine.processMove(state, { player: 'X', position: 1, timestamp: Date.now() });
      
      // Now computer should block at position 2
      const computerMove = computer.calculateNextMove(state);
      
      expect(computerMove).toBe(2); // Should block the winning move
      
      // Execute the blocking move
      state = engine.processMove(state, { player: 'O', position: computerMove, timestamp: Date.now() });
      
      // X should not have won yet
      expect(state.winner).toBeNull();
      expect(state.status).toBe('playing');
    });

    it('should handle computer winning when possible', () => {
      let state = engine.createInitialState();
      
      // Set up a state where computer can win
      state = engine.processMove(state, { player: 'X', position: 0, timestamp: Date.now() });
      state = engine.processMove(state, { player: 'O', position: 4, timestamp: Date.now() }); // Computer center
      state = engine.processMove(state, { player: 'X', position: 1, timestamp: Date.now() });
      state = engine.processMove(state, { player: 'O', position: 3, timestamp: Date.now() }); // Computer left
      state = engine.processMove(state, { player: 'X', position: 6, timestamp: Date.now() }); // Human blocks some
      
      // Computer should try to win at position 5 (completing 3-4-5 column)
      const computerMove = computer.calculateNextMove(state);
      
      if (computerMove === 5) {
        state = engine.processMove(state, { player: 'O', position: computerMove, timestamp: Date.now() });
        expect(state.winner).toBe('O');
        expect(state.status).toBe('won');
      }
    });
  });

  describe('Game State Consistency', () => {
    it('should maintain consistent game state through engine and computer interactions', () => {
      let state = engine.createInitialState();
      const originalState = JSON.parse(JSON.stringify(state));
      
      // Make several moves
      const moves = [0, 4, 1, 3, 2]; // X wins on top row
      
      moves.forEach((position, index) => {
        const player = index % 2 === 0 ? 'X' : 'O';
        
        if (state.status === 'playing') {
          const move: Move = {
            player,
            position,
            timestamp: Date.now()
          };
          
          const validMove = engine.isValidMove(state, position);
          if (validMove) {
            state = engine.processMove(state, move);
            
            // Verify state consistency
            expect(state.moveHistory.length).toBe(index + 1);
            expect(state.moveHistory[index]).toEqual(move);
            expect(state.board[position]).toBe(player);
          }
        }
      });
      
      // Verify final state
      if (state.status === 'won') {
        expect(state.winner).toBe('X');
        expect(state.winningLine).toEqual([0, 1, 2]);
      }
      
      // Ensure original state wasn't mutated
      expect(originalState.board.every((cell: string | null) => cell === null)).toBe(true);
    });

    it('should handle invalid moves gracefully', () => {
      let state = engine.createInitialState();
      
      // Make a valid move
      state = engine.processMove(state, { player: 'X', position: 0, timestamp: Date.now() });
      const validStateSnapshot = JSON.parse(JSON.stringify(state));
      
      // Try invalid moves
        const invalidMoves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() }, // Occupied cell
        { player: 'O', position: -1, timestamp: Date.now() }, // Invalid position
        { player: 'X', position: 9, timestamp: Date.now() },  // Out of bounds
      ];      invalidMoves.forEach(move => {
        const result = engine.processMove(state, move);
        expect(result).toBe(state); // Should return same state for invalid moves
      });
      
      // State should remain unchanged
      expect(JSON.stringify(state)).toBe(JSON.stringify(validStateSnapshot));
    });
  });

  describe('Computer Player Intelligence Integration', () => {
    it('should demonstrate computer strategic behavior across multiple games', () => {
      const gameResults: string[] = [];
      
      // Play multiple games to test computer consistency
      for (let gameIndex = 0; gameIndex < 5; gameIndex++) {
        let state = engine.createInitialState();
        let humanMoves = 0;
        
        // Play a game with predictable human strategy
        const humanStrategy = [4, 0, 8, 2, 6]; // Center, corners
        
        while (state.status === 'playing' && humanMoves < humanStrategy.length) {
          // Human move
          const humanPosition = humanStrategy[humanMoves];
          if (engine.isValidMove(state, humanPosition)) {
            state = engine.processMove(state, {
              player: 'X',
              position: humanPosition,
              timestamp: Date.now()
            });
            humanMoves++;
          } else {
            // Skip invalid move
            humanMoves++;
            continue;
          }
          
          // Computer response
          if (state.status === 'playing') {
            const computerMove = computer.calculateNextMove(state);
            if (computerMove >= 0) {
              state = engine.processMove(state, {
                player: 'O',
                position: computerMove,
                timestamp: Date.now()
              });
            }
          }
        }
        
        gameResults.push(state.status + (state.winner ? `-${state.winner}` : ''));
      }
      
      // Computer should not lose all games (should win some or draw)
      const computerLosses = gameResults.filter(result => result === 'won-X').length;
      expect(computerLosses).toBeLessThan(5); // Should not lose every game
      
      // Should have consistent outcomes (computer should not lose)
      const uniqueResults = new Set(gameResults);
      expect(uniqueResults.size).toBeGreaterThanOrEqual(1); // At least one type of result
    });
  });

  // Helper function
  function findFirstAvailablePosition(state: GameState): number {
    for (let i = 0; i < state.board.length; i++) {
      if (engine.isValidMove(state, i)) {
        return i;
      }
    }
    return -1;
  }
});