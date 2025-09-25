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

  it('should render inline controls', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const controls = compiled.querySelector('[data-testid="game-controls"]');
    expect(controls).toBeTruthy();
  });

  it('should render game title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent?.trim()).toBe('Tic Tac Toe');
  });

  it('should render control buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.control-button');
    expect(buttons.length).toBe(3);
    
    expect(buttons[0].textContent?.trim()).toBe('3x3 / 4x4');
    expect(buttons[1].textContent?.trim()).toBe('Human vs Human / Human vs Computer');
    expect(buttons[2].textContent?.trim()).toBe('New Game');
  });

  it('should render board placeholder', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const placeholder = compiled.querySelector('.board-placeholder');
    expect(placeholder).toBeTruthy();
    expect(placeholder?.textContent).toContain('Game Board Component');
  });
});