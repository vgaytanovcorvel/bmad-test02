# Styling Guidelines

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        game: {
          x: '#ef4444',      // Red for X
          o: '#3b82f6',      // Blue for O
          board: '#f8fafc',  // Light gray for board
          line: '#64748b',   // Gray for grid lines
        }
      },
      gridTemplateColumns: {
        '3': 'repeat(3, 1fr)',
        '4': 'repeat(4, 1fr)',
      }
    },
  },
  plugins: [],
};
```

### CSS Custom Properties

```scss
// styles/globals.scss
:root {
  --game-board-size: 300px;
  --cell-size: calc(var(--game-board-size) / var(--board-dimension));
  --board-dimension: 3; // Dynamic via CSS classes
  
  // Animation timing
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  
  // Z-index layers
  --z-board: 1;
  --z-overlay: 10;
  --z-modal: 100;
}

.board-4x4 {
  --board-dimension: 4;
}

// Responsive board sizing
@media (max-width: 640px) {
  :root {
    --game-board-size: 280px;
  }
}

@media (max-width: 480px) {
  :root {
    --game-board-size: 260px;
  }
}
```

### Component Styling Pattern

```scss
// game-board.component.scss
.game-board {
  @apply grid gap-2 p-4 bg-white rounded-lg shadow-lg;
  
  width: var(--game-board-size);
  height: var(--game-board-size);
  grid-template-columns: repeat(var(--board-dimension), 1fr);
  
  .cell {
    @apply flex items-center justify-center text-2xl font-bold border-2 border-gray-300 
           rounded transition-colors duration-150 hover:bg-gray-50 focus:outline-none 
           focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
    
    min-height: var(--cell-size);
    
    &:disabled {
      @apply cursor-not-allowed opacity-75;
    }
    
    &.occupied {
      @apply cursor-not-allowed;
    }
    
    &.winning {
      @apply bg-yellow-100 border-yellow-400;
      animation: pulse 1s ease-in-out infinite alternate;
    }
  }
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}
```
