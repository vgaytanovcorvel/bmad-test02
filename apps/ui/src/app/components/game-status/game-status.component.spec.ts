import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameStatusComponent } from './game-status.component';
import { GameService } from '../../services/game.service';
import { signal, WritableSignal } from '@angular/core';
import { GameState } from '@libs/shared';

describe('GameStatusComponent', () => {
  let component: GameStatusComponent;
  let fixture: ComponentFixture<GameStatusComponent>;
  let mockGameService: Partial<GameService>;
  let gameStateSignal: WritableSignal<GameState>;

  const createMockGameState = (overrides: Partial<GameState> = {}): GameState => ({
    board: new Array(9).fill(null),
    currentPlayer: 'X' as const,
    moveHistory: [],
    status: 'playing' as const,
    winner: null,
    winningLine: null,
    config: {
      boardSize: 3,
      kInRow: 3,
      firstPlayer: 'X' as const,
      mode: 'human-vs-human' as const
    },
    startTime: Date.now(),
    ...overrides
  });

  beforeEach(async () => {
    gameStateSignal = signal(createMockGameState());
    
    mockGameService = {
      gameState: gameStateSignal.asReadonly(),
      isTerminal: () => false
    };

    await TestBed.configureTestingModule({
      imports: [GameStatusComponent],
      providers: [{ provide: GameService, useValue: mockGameService }]
    }).compileComponents();

    fixture = TestBed.createComponent(GameStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show current player when game is playing', () => {
    mockGameService.isTerminal = () => false;
    fixture.detectChanges();

    const statusElement = fixture.nativeElement.querySelector('[data-testid="current-player"]');
    expect(statusElement).toBeTruthy();
    expect(statusElement.textContent).toContain("X's Turn");
  });

  it('should show winner message when game is won', () => {
    const winningGameState = createMockGameState({
      status: 'won',
      winner: 'X',
      winningLine: [0, 1, 2]
    });
    gameStateSignal.set(winningGameState);
    mockGameService.isTerminal = () => true;
    
    fixture.detectChanges();

    const statusElement = fixture.nativeElement.querySelector('.winner-message');
    expect(statusElement).toBeTruthy();
    expect(statusElement.textContent).toContain('X Wins!');
  });

  it('should show draw message when game is draw', () => {
    const drawGameState = createMockGameState({
      status: 'draw',
      winner: null,
      board: ['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', 'O']
    });
    gameStateSignal.set(drawGameState);
    mockGameService.isTerminal = () => true;
    
    fixture.detectChanges();

    const statusElement = fixture.nativeElement.querySelector('.draw-message');
    expect(statusElement).toBeTruthy();
    expect(statusElement.textContent).toContain('It\'s a Draw!');
  });

  it('should have correct test id for game status', () => {
    fixture.detectChanges();
    
    const statusElement = fixture.nativeElement.querySelector('[data-testid="game-status"]');
    expect(statusElement).toBeTruthy();
  });

  it('should show O player turn when current player is O', () => {
    const oPlayerGameState = createMockGameState({
      currentPlayer: 'O'
    });
    gameStateSignal.set(oPlayerGameState);
    mockGameService.isTerminal = () => false;
    
    fixture.detectChanges();

    const statusElement = fixture.nativeElement.querySelector('[data-testid="current-player"]');
    expect(statusElement.textContent).toContain("O's Turn");
  });
});