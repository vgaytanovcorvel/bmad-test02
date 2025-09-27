# Manual Testing Instructions
**Tic-Tac-Toe Showcase - Cross-Browser Smoke Testing**

## Pre-Testing Setup

### 1. Start Application Servers

**Development Server (with hot reload):**
```bash
cd path/to/tic-tac-toe-showcase
pnpm nx serve ui
# Access at: http://localhost:4200/
```

**Production Server (optimized build):**
```bash
cd path/to/tic-tac-toe-showcase  
pnpm nx serve-static ui
# Access at: http://localhost:4201/
```

### 2. Prepare Testing Environment

**Required Browsers:**
- Google Chrome (latest version)
- Mozilla Firefox (latest version) 
- Microsoft Edge (latest version)
- Safari (if available on system)

**Testing Documents:**
- `browser-testing-checklist.md` - For detailed test execution
- `browser-compatibility-report.md` - For documenting results

## Testing Protocol

### Phase 1: Desktop Browser Testing

**For Each Browser (Chrome, Firefox, Edge, Safari):**

#### Step 1: Browser Setup
1. Open fresh browser window
2. Clear cache and cookies
3. Open Developer Tools (F12)
4. Position console tab visible for error monitoring
5. Note browser version in testing documentation

#### Step 2: Main Game Page Testing (`/`)
1. Navigate to http://localhost:4200/ or http://localhost:4201/
2. **Page Load Verification:**
   - Page loads without errors
   - 3x3 game board displays correctly
   - Game controls are visible and properly styled
   - No console errors or warnings logged

3. **Game Functionality Testing:**
   - Click cell (0,0) - top-left cell
   - Verify "X" appears in clicked cell
   - Verify turn indicator shows "O" as next player
   - Click cell (0,1) - top-middle cell  
   - Verify "O" appears in clicked cell
   - Verify turn indicator shows "X" as next player
   - Continue alternating until win condition or draw

4. **Win Condition Testing:**
   - Play moves to create winning line: X(0,0), O(1,0), X(0,1), O(1,1), X(0,2)
   - Verify win detection displays correctly
   - Verify winning line is highlighted (if implemented)
   - Verify game becomes non-interactive after win

5. **Game Reset Testing:**
   - Click reset/new game button
   - Verify board clears completely
   - Verify game returns to initial state
   - Verify X starts first in new game

6. **Error Monitoring:**
   - Check browser console for any JavaScript errors
   - Note any warnings or unusual log messages
   - Document any visual rendering issues

#### Step 3: Health Page Testing (`/health`)
1. Navigate to http://localhost:4200/health or http://localhost:4201/health  
2. **Page Load Verification:**
   - Health page loads successfully
   - Build information displays correctly
   - System status indicators are visible
   - No console errors during page load

3. **Content Verification:**
   - Build hash is displayed (e.g., "SCBEDFNL")
   - Environment information shows correctly
   - All health check data renders properly
   - Page styling consistent with main application

4. **Navigation Testing:**
   - Use browser back button to return to game
   - Verify main game still functions after navigation
   - Test direct URL access to `/health` in new tab

#### Step 4: Credits Page Testing (`/credits`)
1. Navigate to http://localhost:4200/credits or http://localhost:4201/credits
2. **Page Load Verification:**
   - Credits page loads without errors
   - Dependency table displays correctly
   - All content renders properly
   - No console errors or warnings

3. **Content and Accessibility Testing:**
   - Verify dependency table has proper headers
   - Check that all dependency names and versions display
   - Verify license links are accessible (if implemented)
   - Test table scrolling/responsiveness if needed

4. **Navigation Testing:**
   - Navigate back to main game using browser navigation
   - Test direct URL access to `/credits` in new tab
   - Verify SPA routing works correctly

#### Step 5: SPA Routing and Navigation Testing
1. **Direct URL Navigation:**
   - Test http://localhost:4200/unknown-route
   - Verify appropriate handling (redirect or 404 page)
   - Test each valid route in new browser tab
   - Verify all routes load correctly when accessed directly

2. **Browser Navigation:**
   - Navigate between all three pages using address bar
   - Use browser back/forward buttons extensively  
   - Verify browser history maintains correct state
   - Test page refresh on each route

#### Step 6: Responsive Design Testing (Desktop)
1. **Viewport Scaling:**
   - Test at 1920px width (desktop large)
   - Test at 1366px width (desktop standard)
   - Test at 1024px width (desktop small/tablet)
   - Verify layout maintains usability at all sizes

2. **Zoom Testing:**
   - Test at 50% zoom level
   - Test at 100% zoom level (baseline)
   - Test at 150% zoom level
   - Test at 200% zoom level
   - Verify text remains readable and interactive elements accessible

### Phase 2: Mobile Viewport Testing

#### Step 1: Mobile Viewport Setup
1. Open browser Developer Tools (F12)
2. Enable device simulation/responsive design mode
3. Set viewport to 375px width (iPhone standard)
4. Set user agent to mobile device (if option available)

#### Step 2: Mobile Game Testing
1. **Touch Interface Testing:**
   - Use mouse to simulate touch on game cells
   - Verify touch targets are adequately sized (≥44px)
   - Test game functionality with simulated touch input
   - Verify touch feedback/response

2. **Mobile Layout Testing:**
   - Verify game board scales appropriately
   - Check that controls remain accessible
   - Verify text remains readable at mobile sizes
   - Test portrait orientation (375px width)

3. **Mobile Navigation Testing:**
   - Test navigation between all three routes
   - Verify mobile-friendly navigation elements
   - Check address bar behavior (if applicable)
   - Test page refresh and direct URL access

#### Step 3: Landscape Mobile Testing
1. **Landscape Viewport:**
   - Switch to 667px width (landscape mobile)
   - Verify layout adapts appropriately
   - Test all functionality in landscape mode
   - Check horizontal scrolling is not required

### Phase 3: Performance and Load Testing

#### Step 1: Performance Measurement
1. **Load Time Testing:**
   - Use browser Developer Tools Network tab
   - Clear cache and hard refresh
   - Measure initial page load time
   - Document bundle sizes and load times
   - Test both development and production builds

2. **Interaction Response Testing:**
   - Measure time from cell click to visual update
   - Test game reset response time
   - Verify smooth transitions and animations
   - Check for any lag or stuttering

#### Step 2: Memory and Resource Testing
1. **Resource Monitoring:**
   - Monitor CPU usage during gameplay
   - Check memory consumption during extended use
   - Verify no memory leaks during repeated games
   - Monitor network requests and caching

## Issue Documentation Protocol

### Issue Severity Classification

**Critical Issues (🔴):**
- Application fails to load
- Core game functionality broken
- JavaScript errors preventing usage
- Major layout/rendering failures

**Minor Issues (🟡):**
- Visual inconsistencies between browsers
- Performance differences
- Minor layout irregularities
- Non-critical console warnings

**Informational (🔵):**
- Browser-specific behaviors (not issues)
- Performance differences within acceptable range
- Minor visual variations that don't affect usability

### Issue Documentation Format

For each issue found, document:

```markdown
## Issue #[Number]: [Brief Description]

**Severity:** [Critical/Minor/Informational]
**Browser:** [Browser name and version]
**Environment:** [Development/Production build]
**URL:** [Specific URL where issue occurs]

**Description:**
[Detailed description of the issue]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Console Output:**
[Include if helpful]

**Workaround:**
[Any available workaround, if applicable]

**Impact Assessment:**
[How this affects user experience]
```

## Testing Completion Checklist

### Per Browser Completion
- [ ] Main game functionality tested and documented
- [ ] Health page tested and documented  
- [ ] Credits page tested and documented
- [ ] SPA routing tested and documented
- [ ] Responsive design tested and documented
- [ ] Performance measured and documented
- [ ] All issues documented with proper severity
- [ ] Browser compatibility rating assigned

### Overall Testing Completion
- [ ] All available browsers tested
- [ ] Mobile viewport testing completed
- [ ] Cross-browser comparison completed
- [ ] Performance benchmarks completed
- [ ] Browser compatibility report updated
- [ ] Issue summary prepared
- [ ] Testing recommendations documented

## Quick Testing Summary Format

After completing all testing, provide this summary:

```markdown
## Testing Summary - [Date]

**Browsers Tested:** [List with versions]
**Testing Duration:** [Time spent]
**Critical Issues Found:** [Number]
**Minor Issues Found:** [Number]

**Browser Rankings:**
1. [Best performing browser]
2. [Second best]
3. [Third]
4. [Fourth if tested]

**Key Findings:**
- [Most important finding]
- [Second most important]
- [Third most important]

**Recommendations:**
- [Primary recommendation]
- [Secondary recommendation]

**Release Assessment:** [Ready/Not Ready/Ready with Notes]
```

## Troubleshooting Common Issues

### Server Won't Start
- Verify Node.js and pnpm are installed
- Run `pnpm install` to ensure dependencies are available
- Check that ports 4200/4201 are not in use by other applications

### Browser Cache Issues  
- Hard refresh with Ctrl+F5 (or Cmd+Shift+R on Mac)
- Open Developer Tools → Network tab → check "Disable cache"
- Clear browser cache and cookies for localhost

### Console Errors
- Ignore warnings about Tailwind utility classes (expected during development)
- Focus on JavaScript runtime errors or failed network requests
- Document any errors that appear consistently across page loads

This comprehensive testing protocol ensures thorough cross-browser validation while maintaining consistency and documentation standards.