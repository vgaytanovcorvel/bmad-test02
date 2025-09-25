import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create game page', () => {
    expect(component).toBeTruthy();
  });

  it('should render game page with correct data-testid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const gamePage = compiled.querySelector('[data-testid="game-page"]');
    expect(gamePage).toBeTruthy();
  });

  it('should render centered board container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const boardContainer = compiled.querySelector('[data-testid="game-board-container"]');
    expect(boardContainer).toBeTruthy();
  });

  it('should render game title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent?.trim()).toBe('Tic Tac Toe');
  });

  it('should render game controls component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const gameControls = compiled.querySelector('app-game-controls');
    expect(gameControls).toBeTruthy();
  });

  it('should render game board and status components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const gameBoard = compiled.querySelector('app-game-board');
    const gameStatus = compiled.querySelector('app-game-status');
    expect(gameBoard).toBeTruthy();
    expect(gameStatus).toBeTruthy();
  });
});