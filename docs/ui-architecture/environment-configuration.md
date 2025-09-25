# Environment Configuration

### Environment Files

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  appName: 'Tic Tac Toe Showcase',
  version: '1.3.0',
  buildHash: 'dev-build',
  
  // Game configuration
  game: {
    supportedBoardSizes: [3, 4] as const,
    defaultBoardSize: 3,
    kValue: 3, // Both 3x3 and 4x4 use k=3
    computerMoveDelay: 300, // ms
    animationDuration: 150, // ms
  },
  
  // Feature flags
  features: {
    animations: true,
    soundEffects: false, // Future feature
    statistics: false,   // Future feature
  },
  
  // Analytics (future)
  analytics: {
    enabled: false,
    trackingId: null,
  }
};
```

```typescript
// environments/environment.prod.ts
export const environment = {
  production: true,
  appName: 'Tic Tac Toe Showcase',
  version: '1.3.0',
  buildHash: process.env['BUILD_HASH'] || 'unknown',
  
  game: {
    supportedBoardSizes: [3, 4] as const,
    defaultBoardSize: 3,
    kValue: 3,
    computerMoveDelay: 300,
    animationDuration: 150,
  },
  
  features: {
    animations: true,
    soundEffects: false,
    statistics: false,
  },
  
  analytics: {
    enabled: false,
    trackingId: null,
  }
};
```

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { angular } from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => ({
  plugins: [
    angular(),
    nxViteTsPaths(),
  ],
  define: {
    'process.env.BUILD_HASH': JSON.stringify(
      process.env['BUILD_HASH'] || 'local-build'
    ),
  },
  build: {
    target: 'es2022',
    outDir: 'dist/apps/ui',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@angular/core', '@angular/common', '@angular/router'],
          engine: ['@libs/engine'],
        },
      },
    },
  },
  server: {
    port: 4200,
    host: '0.0.0.0',
  },
  preview: {
    port: 4300,
    host: '0.0.0.0',
  },
}));
```

### Static Hosting Configuration

```json
// vercel.json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/apps/ui",
  "framework": null
}
```

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist/apps/ui"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
