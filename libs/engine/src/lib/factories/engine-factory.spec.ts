/**
 * EngineFactory Unit Tests
 * 
 * Comprehensive test suite for the EngineFactory class.
 * Tests factory creation, configuration validation, and pre-configured methods.
 * 
 * @since 2.7.0
 */

import { EngineFactory } from './engine-factory';
import { TicTacToeEngine } from '../implementations/tic-tac-toe-engine';
import type { GameConfig, Player, BoardSize, GameMode } from '@libs/shared';

describe('EngineFactory', () => {
  describe('createEngine', () => {
    it('should create engine with valid 3x3 configuration', () => {
      const config: GameConfig = {
        boardSize: 3 as BoardSize,
        kInRow: 3,
        firstPlayer: 'X' as Player,
        mode: 'human-vs-human' as GameMode
      };
      
      const engine = EngineFactory.createEngine(config);
      
      expect(engine).toBeInstanceOf(TicTacToeEngine);
      
      const gameState = engine.initialState(config);
      expect(gameState.config).toEqual(config);
      expect(gameState.board.length).toBe(9);
      expect(gameState.currentPlayer).toBe('X');
    });
    
    it('should create engine with valid 4x4 configuration', () => {
      const config: GameConfig = {
        boardSize: 4 as BoardSize,
        kInRow: 3,
        firstPlayer: 'O' as Player,
        mode: 'human-vs-computer' as GameMode
      };
      
      const engine = EngineFactory.createEngine(config);
      
      expect(engine).toBeInstanceOf(TicTacToeEngine);
      
      const gameState = engine.initialState(config);
      expect(gameState.config).toEqual(config);
      expect(gameState.board.length).toBe(16);
      expect(gameState.currentPlayer).toBe('O');
    });
    
    it('should create engine with computer-vs-computer mode', () => {
      const config: GameConfig = {
        boardSize: 3 as BoardSize,
        kInRow: 3,
        firstPlayer: 'X' as Player,
        mode: 'computer-vs-computer' as GameMode
      };
      
      const engine = EngineFactory.createEngine(config);
      
      expect(engine).toBeInstanceOf(TicTacToeEngine);
      
      const gameState = engine.initialState(config);
      expect(gameState.config.mode).toBe('computer-vs-computer');
    });
  });
  
  describe('Configuration Validation', () => {
    it('should throw error for null configuration', () => {
      expect(() => EngineFactory.createEngine(null as unknown as GameConfig))
        .toThrow('GameConfig is required');
    });
    
    it('should throw error for undefined configuration', () => {
      expect(() => EngineFactory.createEngine(undefined as unknown as GameConfig))
        .toThrow('GameConfig is required');
    });
    
    it('should throw error for invalid board size', () => {
      const invalidConfig = {
        boardSize: 5, // Invalid
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      } as unknown as GameConfig;
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid board size: 5. Must be 3, 4, or 7');
    });
    
    it('should throw error for zero board size', () => {
      const invalidConfig = {
        boardSize: 0, // Invalid
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      } as unknown as GameConfig;
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid board size: 0. Must be 3, 4, or 7');
    });
    
    it('should throw error for negative board size', () => {
      const invalidConfig = {
        boardSize: -1, // Invalid
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      } as unknown as GameConfig;
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid board size: -1. Must be 3, 4, or 7');
    });
    
    it('should throw error for invalid k value - too high', () => {
      const invalidConfig: GameConfig = {
        boardSize: 3 as BoardSize,
        kInRow: 4, // Invalid for both 3x3 and 4x4
        firstPlayer: 'X' as Player,
        mode: 'human-vs-human' as GameMode
      };
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid k value: 4. Must be 3 for 3x3 and 4x4 boards');
    });
    
    it('should throw error for invalid k value - too low', () => {
      const invalidConfig: GameConfig = {
        boardSize: 3 as BoardSize,
        kInRow: 2, // Invalid
        firstPlayer: 'X' as Player,
        mode: 'human-vs-human' as GameMode
      };
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid k value: 2. Must be 3 for 3x3 and 4x4 boards');
    });
    
    it('should throw error for invalid first player', () => {
      const invalidConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'Y', // Invalid
        mode: 'human-vs-human'
      } as unknown as GameConfig;
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid first player: Y. Must be \'X\' or \'O\'');
    });
    
    it('should throw error for empty first player', () => {
      const invalidConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: '', // Invalid
        mode: 'human-vs-human'
      } as unknown as GameConfig;
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid first player: . Must be \'X\' or \'O\'');
    });
    
    it('should throw error for invalid game mode', () => {
      const invalidConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'invalid-mode' // Invalid
      } as unknown as GameConfig;
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid game mode: invalid-mode. Must be \'human-vs-human\', \'human-vs-computer\', or \'computer-vs-computer\'');
    });
    
    it('should throw error for empty game mode', () => {
      const invalidConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: '' // Invalid
      } as unknown as GameConfig;
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid game mode: . Must be \'human-vs-human\', \'human-vs-computer\', or \'computer-vs-computer\'');
    });
  });
  
  describe('Pre-configured Factory Methods', () => {
    describe('create3x3Engine', () => {
      it('should create 3x3 engine with default settings', () => {
        const engine = EngineFactory.create3x3Engine();
        
        expect(engine).toBeInstanceOf(TicTacToeEngine);
        
        // Get the default config by creating initial state with expected config
        const expectedConfig: GameConfig = {
          boardSize: 3 as BoardSize,
          kInRow: 3,
          firstPlayer: 'X' as Player,
          mode: 'human-vs-human' as GameMode
        };
        
        const gameState = engine.initialState(expectedConfig);
        expect(gameState.config.boardSize).toBe(3);
        expect(gameState.config.kInRow).toBe(3);
        expect(gameState.config.firstPlayer).toBe('X');
        expect(gameState.config.mode).toBe('human-vs-human');
        expect(gameState.board.length).toBe(9);
      });
      
      it('should create 3x3 engine with custom first player', () => {
        const engine = EngineFactory.create3x3Engine('O');
        
        const expectedConfig: GameConfig = {
          boardSize: 3 as BoardSize,
          kInRow: 3,
          firstPlayer: 'O' as Player,
          mode: 'human-vs-human' as GameMode
        };
        
        const gameState = engine.initialState(expectedConfig);
        expect(gameState.config.firstPlayer).toBe('O');
        expect(gameState.currentPlayer).toBe('O');
      });
    });
    
    describe('create4x4Engine', () => {
      it('should create 4x4 engine with default settings', () => {
        const engine = EngineFactory.create4x4Engine();
        
        expect(engine).toBeInstanceOf(TicTacToeEngine);
        
        const expectedConfig: GameConfig = {
          boardSize: 4 as BoardSize,
          kInRow: 3,
          firstPlayer: 'X' as Player,
          mode: 'human-vs-human' as GameMode
        };
        
        const gameState = engine.initialState(expectedConfig);
        expect(gameState.config.boardSize).toBe(4);
        expect(gameState.config.kInRow).toBe(3);
        expect(gameState.config.firstPlayer).toBe('X');
        expect(gameState.config.mode).toBe('human-vs-human');
        expect(gameState.board.length).toBe(16);
      });
      
      it('should create 4x4 engine with custom first player', () => {
        const engine = EngineFactory.create4x4Engine('O');
        
        const expectedConfig: GameConfig = {
          boardSize: 4 as BoardSize,
          kInRow: 3,
          firstPlayer: 'O' as Player,
          mode: 'human-vs-human' as GameMode
        };
        
        const gameState = engine.initialState(expectedConfig);
        expect(gameState.config.firstPlayer).toBe('O');
        expect(gameState.currentPlayer).toBe('O');
      });
    });
    
    describe('createHumanVsComputerEngine', () => {
      it('should create 3x3 human vs computer engine', () => {
        const engine = EngineFactory.createHumanVsComputerEngine(3, 'X');
        
        expect(engine).toBeInstanceOf(TicTacToeEngine);
        
        const expectedConfig: GameConfig = {
          boardSize: 3 as BoardSize,
          kInRow: 3,
          firstPlayer: 'X' as Player,
          mode: 'human-vs-computer' as GameMode
        };
        
        const gameState = engine.initialState(expectedConfig);
        expect(gameState.config.mode).toBe('human-vs-computer');
        expect(gameState.config.boardSize).toBe(3);
        expect(gameState.board.length).toBe(9);
      });
      
      it('should create 4x4 human vs computer engine', () => {
        const engine = EngineFactory.createHumanVsComputerEngine(4, 'O');
        
        const expectedConfig: GameConfig = {
          boardSize: 4 as BoardSize,
          kInRow: 3,
          firstPlayer: 'O' as Player,
          mode: 'human-vs-computer' as GameMode
        };
        
        const gameState = engine.initialState(expectedConfig);
        expect(gameState.config.mode).toBe('human-vs-computer');
        expect(gameState.config.boardSize).toBe(4);
        expect(gameState.config.firstPlayer).toBe('O');
        expect(gameState.board.length).toBe(16);
      });
      
      it('should use default first player when not specified', () => {
        const engine = EngineFactory.createHumanVsComputerEngine(3);
        
        const expectedConfig: GameConfig = {
          boardSize: 3 as BoardSize,
          kInRow: 3,
          firstPlayer: 'X' as Player,
          mode: 'human-vs-computer' as GameMode
        };
        
        const gameState = engine.initialState(expectedConfig);
        expect(gameState.config.firstPlayer).toBe('X');
      });
      
      it('should create 7x7 human vs computer engine', () => {
        const engine = EngineFactory.createHumanVsComputerEngine(7, 'X');
        
        const expectedConfig: GameConfig = {
          boardSize: 7 as BoardSize,
          kInRow: 4,
          firstPlayer: 'X' as Player,
          mode: 'human-vs-computer' as GameMode
        };
        
        const gameState = engine.initialState(expectedConfig);
        expect(gameState.config.mode).toBe('human-vs-computer');
        expect(gameState.config.boardSize).toBe(7);
        expect(gameState.config.kInRow).toBe(4);
        expect(gameState.board.length).toBe(49);
      });
    });
    
    describe('create7x7Engine', () => {
      it('should create engine with default first player X', () => {
        const engine = EngineFactory.create7x7Engine();
        
        expect(engine).toBeInstanceOf(TicTacToeEngine);
        
        const expectedConfig: GameConfig = {
          boardSize: 7 as BoardSize,
          kInRow: 4,
          firstPlayer: 'X' as Player,
          mode: 'human-vs-human' as GameMode
        };
        
        const gameState = engine.initialState(expectedConfig);
        expect(gameState.config.boardSize).toBe(7);
        expect(gameState.config.kInRow).toBe(4);
        expect(gameState.config.firstPlayer).toBe('X');
        expect(gameState.config.mode).toBe('human-vs-human');
        expect(gameState.board.length).toBe(49);
        expect(gameState.currentPlayer).toBe('X');
      });
      
      it('should create engine with specified first player O', () => {
        const engine = EngineFactory.create7x7Engine('O');
        
        const expectedConfig: GameConfig = {
          boardSize: 7 as BoardSize,
          kInRow: 4,
          firstPlayer: 'O' as Player,
          mode: 'human-vs-human' as GameMode
        };
        
        const gameState = engine.initialState(expectedConfig);
        expect(gameState.config.firstPlayer).toBe('O');
        expect(gameState.currentPlayer).toBe('O');
        expect(gameState.board.length).toBe(49);
      });
    });
  });
  
  describe('7x7 Configuration Validation', () => {
    it('should accept valid 7x7 configuration with k=4', () => {
      const config: GameConfig = {
        boardSize: 7 as BoardSize,
        kInRow: 4,
        firstPlayer: 'X' as Player,
        mode: 'human-vs-human' as GameMode
      };
      
      expect(() => EngineFactory.createEngine(config)).not.toThrow();
      
      const engine = EngineFactory.createEngine(config);
      const gameState = engine.initialState(config);
      expect(gameState.board.length).toBe(49);
    });
    
    it('should throw error for 7x7 board with invalid k value (k=3)', () => {
      const invalidConfig: GameConfig = {
        boardSize: 7 as BoardSize,
        kInRow: 3,
        firstPlayer: 'X' as Player,
        mode: 'human-vs-human' as GameMode
      };
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid k value: 3. Must be 4 for 7x7 board');
    });
    
    it('should throw error for 7x7 board with invalid k value (k=5)', () => {
      const invalidConfig: GameConfig = {
        boardSize: 7 as BoardSize,
        kInRow: 5,
        firstPlayer: 'X' as Player,
        mode: 'human-vs-human' as GameMode
      };
      
      expect(() => EngineFactory.createEngine(invalidConfig))
        .toThrow('Invalid k value: 5. Must be 4 for 7x7 board');
    });
  });
  
  describe('Configuration Propagation', () => {
    let engine: TicTacToeEngine;
    let config: GameConfig;
    
    beforeEach(() => {
      config = {
        boardSize: 3 as BoardSize,
        kInRow: 3,
        firstPlayer: 'X' as Player,
        mode: 'human-vs-human' as GameMode
      };
      engine = EngineFactory.createEngine(config) as TicTacToeEngine;
    });
    
    it('should preserve config through state transitions', () => {
      let gameState = engine.initialState(config);
      expect(gameState.config).toEqual(config);
      
      const move1 = { player: 'X' as Player, position: 0, timestamp: Date.now() };
      gameState = engine.applyMove(gameState, move1);
      expect(gameState.config).toEqual(config);
      
      const move2 = { player: 'O' as Player, position: 1, timestamp: Date.now() };
      gameState = engine.applyMove(gameState, move2);
      expect(gameState.config).toEqual(config);
    });
    
    it('should maintain config immutability', () => {
      const gameState = engine.initialState(config);
      const originalConfig = gameState.config;
      
      const move = { player: 'X' as Player, position: 4, timestamp: Date.now() };
      const newState = engine.applyMove(gameState, move);
      
      expect(newState.config).toBe(originalConfig); // Same reference
    });
    
    it('should preserve config for 4x4 board through multiple moves', () => {
      const config4x4: GameConfig = {
        boardSize: 4 as BoardSize,
        kInRow: 3,
        firstPlayer: 'O' as Player,
        mode: 'human-vs-computer' as GameMode
      };
      
      const engine4x4 = EngineFactory.createEngine(config4x4) as TicTacToeEngine;
      let gameState = engine4x4.initialState(config4x4);
      
      expect(gameState.config).toEqual(config4x4);
      expect(gameState.board.length).toBe(16);
      
      // Apply several moves
      const moves = [
        { player: 'O' as Player, position: 0, timestamp: Date.now() },
        { player: 'X' as Player, position: 1, timestamp: Date.now() },
        { player: 'O' as Player, position: 4, timestamp: Date.now() },
        { player: 'X' as Player, position: 5, timestamp: Date.now() }
      ];
      
      moves.forEach(move => {
        gameState = engine4x4.applyMove(gameState, move);
        expect(gameState.config).toEqual(config4x4);
      });
    });
  });
  
  describe('Integration with Engine Interface', () => {
    it('should work with all engine methods for 3x3', () => {
      const config: GameConfig = {
        boardSize: 3 as BoardSize,
        kInRow: 3,
        firstPlayer: 'X' as Player,
        mode: 'human-vs-human' as GameMode
      };
      
      const engine = EngineFactory.createEngine(config);
      const gameState = engine.initialState(config);
      
      // Test all engine methods
      expect(engine.legalMoves(gameState)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      expect(engine.isTerminal(gameState)).toBe(false);
      expect(engine.kInRow(gameState)).toEqual([]);
      
      // Apply move and test again
      const move = { player: 'X' as Player, position: 4, timestamp: Date.now() };
      const newState = engine.applyMove(gameState, move);
      
      expect(engine.legalMoves(newState).length).toBe(8);
      expect(newState.board[4]).toBe('X');
      expect(newState.currentPlayer).toBe('O');
    });
    
    it('should work with all engine methods for 4x4', () => {
      const config: GameConfig = {
        boardSize: 4 as BoardSize,
        kInRow: 3,
        firstPlayer: 'O' as Player,
        mode: 'human-vs-computer' as GameMode
      };
      
      const engine = EngineFactory.createEngine(config);
      const gameState = engine.initialState(config);
      
      // Test all engine methods
      expect(engine.legalMoves(gameState)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
      expect(engine.isTerminal(gameState)).toBe(false);
      expect(engine.kInRow(gameState)).toEqual([]);
      
      // Apply move and test again
      const move = { player: 'O' as Player, position: 8, timestamp: Date.now() };
      const newState = engine.applyMove(gameState, move);
      
      expect(engine.legalMoves(newState).length).toBe(15);
      expect(newState.board[8]).toBe('O');
      expect(newState.currentPlayer).toBe('X');
    });
  });
});