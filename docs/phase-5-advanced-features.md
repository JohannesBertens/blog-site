# Phase 5: Advanced Features & Polish

## Overview
This phase adds the finishing touches that transform the blog into a professional developer-focused platform with terminal-inspired animations, keyboard navigation, and micro-interactions that enhance the user experience.

## Terminal-Style Loading Animations

### LoadingScreen.astro
```astro
---
// src/components/LoadingScreen.astro
---

<div class="loading-screen" id="loading-screen">
  <div class="loading-terminal">
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="terminal-title">loading...</div>
    </div>
    <div class="terminal-content">
      <div class="loading-line">
        <span class="prompt">$</span>
        <span class="command typing">Initializing blog...</span>
        <span class="cursor">_</span>
      </div>
      <div class="loading-output" id="loading-output">
        <!-- Dynamic loading messages -->
      </div>
      <div class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill" id="loading-progress"></div>
        </div>
        <div class="progress-text" id="loading-percentage">0%</div>
      </div>
    </div>
  </div>
</div>

<style>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 1;
    transition: opacity 0.5s ease;
  }

  .loading-screen.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .loading-terminal {
    width: 90%;
    max-width: 500px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .terminal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-4);
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-primary);
  }

  .terminal-dots {
    display: flex;
    gap: var(--space-1);
  }

  .dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
  }

  .dot.red { background-color: #ff5f56; }
  .dot.yellow { background-color: #ffbd2e; }
  .dot.green { background-color: #27c93f; }

  .terminal-title {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .terminal-content {
    padding: var(--space-6);
    background: var(--code-bg);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
  }

  .loading-line {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
  }

  .prompt {
    color: var(--accent-green);
  }

  .command {
    color: var(--text-primary);
  }

  .typing {
    position: relative;
  }

  .typing::after {
    content: '';
    position: absolute;
    right: -0.5rem;
    top: 0;
    width: 2px;
    height: 1.2em;
    background: var(--accent-cyan);
    animation: blink 1s infinite;
  }

  .cursor {
    color: var(--accent-cyan);
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  .loading-output {
    margin-bottom: var(--space-4);
    padding-left: var(--space-4);
    color: var(--text-secondary);
    font-size: var(--fluid-text-xs);
    line-height: 1.6;
  }

  .output-line {
    margin-bottom: var(--space-1);
    opacity: 0;
    animation: fadeInUp 0.3s ease forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .loading-progress {
    margin-top: var(--space-4);
  }

  .progress-bar {
    height: 4px;
    background: var(--bg-tertiary);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: var(--space-2);
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-green) 0%, var(--accent-cyan) 100%);
    width: 0%;
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .progress-text {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--accent-cyan);
    text-align: right;
  }
</style>

<script>
  // Loading sequence simulation
  const loadingMessages = [
    'Loading components...',
    'Parsing Markdown content...',
    'Applying syntax highlighting...',
    'Building table of contents...',
    'Calculating reading time...',
    'Optimizing images...',
    'Initializing analytics...',
    'Ready to launch!'
  ];

  let messageIndex = 0;
  let progress = 0;

  function addLoadingMessage() {
    const output = document.getElementById('loading-output');
    if (output && messageIndex < loadingMessages.length) {
      const line = document.createElement('div');
      line.className = 'output-line';
      line.textContent = `> ${loadingMessages[messageIndex]}`;
      line.style.animationDelay = `${messageIndex * 0.1}s`;
      output.appendChild(line);

      messageIndex++;

      // Add next message
      if (messageIndex < loadingMessages.length) {
        setTimeout(addLoadingMessage, 300);
      }
    }
  }

  function updateProgress() {
    const progressBar = document.getElementById('loading-progress');
    const progressText = document.getElementById('loading-percentage');

    if (progressBar && progressText) {
      progress += Math.random() * 15 + 5; // Random progress increment

      if (progress > 100) progress = 100;

      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${Math.round(progress)}%`;

      if (progress < 100) {
        setTimeout(updateProgress, 200);
      } else {
        // Hide loading screen
        setTimeout(() => {
          const loadingScreen = document.getElementById('loading-screen');
          if (loadingScreen) {
            loadingScreen.classList.add('hidden');
          }
        }, 500);
      }
    }
  }

  // Start loading sequence
  setTimeout(addLoadingMessage, 500);
  setTimeout(updateProgress, 800);
</script>
```

## Custom Scrollbar Styling

### Scrollbar Styles (animations.css)
```css
/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  transition: all 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
  border-color: var(--accent-cyan);
}

::-webkit-scrollbar-corner {
  background: var(--bg-primary);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--bg-tertiary) var(--bg-primary);
}

/* Terminal-style scrollbar for code blocks */
.terminal-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.terminal-scrollbar::-webkit-scrollbar-track {
  background: var(--code-bg);
  border-radius: 4px;
}

.terminal-scrollbar::-webkit-scrollbar-thumb {
  background: var(--accent-green);
  border-radius: 4px;
  opacity: 0.5;
}

.terminal-scrollbar::-webkit-scrollbar-thumb:hover {
  opacity: 1;
  background: var(--accent-cyan);
}
```

## Keyboard Navigation System

### KeyboardNavigation.astro
```astro
---
// src/components/KeyboardNavigation.astro
---

<div class="keyboard-help" id="keyboard-help">
  <div class="help-overlay" id="help-overlay"></div>
  <div class="help-modal">
    <div class="help-header">
      <h3 class="help-title">
        <span class="help-icon">⌨️</span>
        Keyboard Shortcuts
      </h3>
      <button class="help-close" id="help-close">×</button>
    </div>
    <div class="help-content">
      <div class="shortcut-group">
        <h4>Navigation</h4>
        <div class="shortcut-item">
          <kbd>G</kbd> <kbd>H</kbd>
          <span>Go to Home</span>
        </div>
        <div class="shortcut-item">
          <kbd>G</kbd> <kbd>B</kbd>
          <span>Go to Blog</span>
        </div>
        <div class="shortcut-item">
          <kbd>G</kbd> <kbd>A</kbd>
          <span>Go to About</span>
        </div>
      </div>
      <div class="shortcut-group">
        <h4>Content</h4>
        <div class="shortcut-item">
          <kbd>/</kbd>
          <span>Search Posts</span>
        </div>
        <div class="shortcut-item">
          <kbd>T</kbd>
          <span>Toggle Table of Contents</span>
        </div>
        <div class="shortcut-item">
          <kbd>J</kbd> / <kbd>K</kbd>
          <span>Next/Previous Post</span>
        </div>
      </div>
      <div class="shortcut-group">
        <h4>Theme</h4>
        <div class="shortcut-item">
          <kbd>D</kbd>
          <span>Toggle Dark Mode</span>
        </div>
        <div class="shortcut-item">
          <kbd>+</kbd> / <kbd>-</kbd>
          <span>Increase/Decrease Font Size</span>
        </div>
      </div>
      <div class="shortcut-group">
        <h4>Utility</h4>
        <div class="shortcut-item">
          <kbd>?</kbd>
          <span>Show this help</span>
        </div>
        <div class="shortcut-item">
          <kbd>ESC</kbd>
          <span>Close modals/panels</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="keyboard-hint" id="keyboard-hint">
  Press <kbd>?</kbd> for keyboard shortcuts
</div>

<style>
  .keyboard-help {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: none;
  }

  .keyboard-help.active {
    display: block;
  }

  .help-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
  }

  .help-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    padding: 0;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  .help-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-6);
    border-bottom: 1px solid var(--border-primary);
    background: var(--bg-tertiary);
  }

  .help-title {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-lg);
    color: var(--text-primary);
    margin: 0;
  }

  .help-icon {
    font-size: 1.2em;
  }

  .help-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: var(--fluid-text-xl);
    cursor: pointer;
    padding: var(--space-2);
    border-radius: 0.25rem;
    transition: all 0.2s ease;
  }

  .help-close:hover {
    background: var(--bg-primary);
    color: var(--accent-red);
  }

  .help-content {
    padding: var(--space-6);
    overflow-y: auto;
    max-height: calc(80vh - 80px);
  }

  .shortcut-group {
    margin-bottom: var(--space-6);
  }

  .shortcut-group h4 {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    color: var(--accent-cyan);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 var(--space-3) 0;
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--border-primary);
  }

  .shortcut-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) 0;
    color: var(--text-secondary);
  }

  kbd {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 0.25rem;
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--accent-green);
    box-shadow: 0 2px 0 var(--bg-primary);
    min-width: 2rem;
    text-align: center;
  }

  .keyboard-hint {
    position: fixed;
    bottom: var(--space-4);
    right: var(--space-4);
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    padding: var(--space-3) var(--space-4);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    opacity: 0.7;
    transition: all 0.2s ease;
    z-index: 100;
  }

  .keyboard-hint:hover {
    opacity: 1;
    border-color: var(--accent-cyan);
    color: var(--accent-cyan);
  }

  /* Focus indicators for keyboard navigation */
  .focusable {
    outline: 2px solid var(--accent-cyan);
    outline-offset: 2px;
  }

  .focusable:focus {
    outline: 2px solid var(--accent-cyan);
    outline-offset: 2px;
    border-radius: 0.25rem;
  }

  /* Skip to content link for accessibility */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--accent-green);
    color: var(--text-inverse);
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-weight: var(--font-medium);
    z-index: 100;
  }

  .skip-link:focus {
    top: 6px;
  }
</style>

<script>
  // Keyboard navigation system
  class KeyboardNavigation {
    constructor() {
      this.shortcuts = new Map();
      this.init();
    }

    init() {
      this.setupShortcuts();
      this.setupEventListeners();
      this.setupKeyboardHint();
    }

    setupShortcuts() {
      // Navigation shortcuts
      this.addShortcut('g h', () => this.navigate('/'));
      this.addShortcut('g b', () => this.navigate('/blog'));
      this.addShortcut('g a', () => this.navigate('/about'));

      // Content shortcuts
      this.addShortcut('/', () => this.focusSearch());
      this.addShortcut('t', () => this.toggleTOC());
      this.addShortcut('j', () => this.navigateNext());
      this.addShortcut('k', () => this.navigatePrevious());

      // Theme shortcuts
      this.addShortcut('d', () => this.toggleDarkMode());
      this.addShortcut('+', () => this.increaseFontSize());
      this.addShortcut('-', () => this.decreaseFontSize());

      // Utility shortcuts
      this.addShortcut('?', () => this.showHelp());
      this.addShortcut('Escape', () => this.closeModals());

      // Global shortcuts
      this.addShortcut('ctrl+k', () => this.openCommandPalette());
    }

    addShortcut(keys, callback) {
      this.shortcuts.set(keys.toLowerCase(), callback);
    }

    setupEventListeners() {
      let currentKeys = [];
      let timeout;

      document.addEventListener('keydown', (e) => {
        // Ignore when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
          return;
        }

        // Handle modifiers
        const key = [
          e.ctrlKey ? 'ctrl' : '',
          e.altKey ? 'alt' : '',
          e.shiftKey ? 'shift' : '',
          e.metaKey ? 'meta' : '',
          e.key.toLowerCase()
        ].filter(Boolean).join(' ');

        currentKeys.push(key);

        // Clear timeout and set new one
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          currentKeys = [];
        }, 1000);

        // Check for matching shortcut
        const shortcut = currentKeys.join(' ');
        if (this.shortcuts.has(shortcut)) {
          e.preventDefault();
          this.shortcuts.get(shortcut)();
          currentKeys = [];
        }
      });
    }

    setupKeyboardHint() {
      // Show hint after user has been on page for 10 seconds
      setTimeout(() => {
        const hint = document.getElementById('keyboard-hint');
        if (hint && localStorage.getItem('keyboard-hint-dismissed') !== 'true') {
          hint.style.opacity = '1';
        }
      }, 10000);

      // Dismiss hint on click
      const hint = document.getElementById('keyboard-hint');
      if (hint) {
        hint.addEventListener('click', () => {
          hint.style.display = 'none';
          localStorage.setItem('keyboard-hint-dismissed', 'true');
        });
      }
    }

    navigate(url) {
      window.location.href = url;
    }

    focusSearch() {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]');
      if (searchInput) {
        searchInput.focus();
      }
    }

    toggleTOC() {
      const toc = document.querySelector('.toc-container');
      if (toc) {
        toc.style.display = toc.style.display === 'none' ? 'block' : 'none';
      }
    }

    navigateNext() {
      const nextLink = document.querySelector('a[rel="next"], .next-post a');
      if (nextLink) {
        this.navigate(nextLink.href);
      }
    }

    navigatePrevious() {
      const prevLink = document.querySelector('a[rel="prev"], .prev-post a');
      if (prevLink) {
        this.navigate(prevLink.href);
      }
    }

    toggleDarkMode() {
      document.documentElement.classList.toggle('dark-mode');
      localStorage.setItem('theme',
        document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light'
      );
    }

    increaseFontSize() {
      document.documentElement.style.fontSize =
        parseFloat(getComputedStyle(document.documentElement).fontSize) + 1 + 'px';
    }

    decreaseFontSize() {
      document.documentElement.style.fontSize =
        parseFloat(getComputedStyle(document.documentElement).fontSize) - 1 + 'px';
    }

    showHelp() {
      const help = document.getElementById('keyboard-help');
      if (help) {
        help.classList.add('active');
      }
    }

    closeModals() {
      const help = document.getElementById('keyboard-help');
      if (help) {
        help.classList.remove('active');
      }
    }

    openCommandPalette() {
      // Implement command palette functionality
      console.log('Command palette not implemented yet');
    }
  }

  // Help modal functionality
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize keyboard navigation
    new KeyboardNavigation();

    // Setup help modal close button
    const helpClose = document.getElementById('help-close');
    const helpOverlay = document.getElementById('help-overlay');
    const keyboardHelp = document.getElementById('keyboard-help');

    function closeHelp() {
      if (keyboardHelp) {
        keyboardHelp.classList.remove('active');
      }
    }

    if (helpClose) {
      helpClose.addEventListener('click', closeHelp);
    }

    if (helpOverlay) {
      helpOverlay.addEventListener('click', closeHelp);
    }

    // Close help on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeHelp();
      }
    });
  });
</script>
```

## Command Palette Component

### CommandPalette.astro
```astro
---
// src/components/CommandPalette.astro
---

<div class="command-palette" id="command-palette">
  <div class="palette-overlay" id="palette-overlay"></div>
  <div class="palette-modal">
    <div class="palette-header">
      <div class="palette-search">
        <span class="search-icon">></span>
        <input
          type="text"
          id="palette-input"
          placeholder="Type a command or search..."
          autocomplete="off"
        />
      </div>
      <div class="palette-actions">
        <button class="palette-close" id="palette-close">×</button>
      </div>
    </div>
    <div class="palette-content">
      <div class="palette-section">
        <h4 class="section-title">Quick Actions</h4>
        <div class="command-list" id="quick-actions">
          <div class="command-item" data-action="home">
            <span class="command-icon">🏠</span>
            <span class="command-text">Go to Home</span>
            <span class="command-shortcut">g h</span>
          </div>
          <div class="command-item" data-action="blog">
            <span class="command-icon">📝</span>
            <span class="command-text">Browse Blog Posts</span>
            <span class="command-shortcut">g b</span>
          </div>
          <div class="command-item" data-action="about">
            <span class="command-icon">👤</span>
            <span class="command-text">About Me</span>
            <span class="command-shortcut">g a</span>
          </div>
          <div class="command-item" data-action="search">
            <span class="command-icon">🔍</span>
            <span class="command-text">Search Posts</span>
            <span class="command-shortcut">/</span>
          </div>
          <div class="command-item" data-action="theme">
            <span class="command-icon">🌙</span>
            <span class="command-text">Toggle Dark Mode</span>
            <span class="command-shortcut">d</span>
          </div>
        </div>
      </div>

      <div class="palette-section" id="search-results" style="display: none;">
        <h4 class="section-title">Search Results</h4>
        <div class="command-list" id="search-list">
          <!-- Search results will be populated here -->
        </div>
      </div>
    </div>
    <div class="palette-footer">
      <div class="palette-hints">
        <kbd>↑</kbd> <kbd>↓</kbd> Navigate
        <kbd>Enter</kbd> Select
        <kbd>ESC</kbd> Close
      </div>
    </div>
  </div>
</div>

<style>
  .command-palette {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    display: none;
  }

  .command-palette.active {
    display: block;
  }

  .palette-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
  }

  .palette-modal {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    width: 90%;
    max-width: 600px;
    max-height: 70vh;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideDown 0.2s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .palette-header {
    display: flex;
    align-items: center;
    padding: var(--space-4);
    border-bottom: 1px solid var(--border-primary);
    background: var(--bg-tertiary);
  }

  .palette-search {
    display: flex;
    align-items: center;
    flex: 1;
    gap: var(--space-3);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    padding: var(--space-3) var(--space-4);
  }

  .search-icon {
    color: var(--accent-green);
    font-family: var(--font-mono);
    font-weight: var(--font-bold);
  }

  .palette-input {
    flex: 1;
    background: none;
    border: none;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-base);
    outline: none;
  }

  .palette-input::placeholder {
    color: var(--text-muted);
  }

  .palette-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: var(--fluid-text-xl);
    cursor: pointer;
    padding: var(--space-2);
    margin-left: var(--space-3);
    border-radius: 0.25rem;
    transition: all 0.2s ease;
  }

  .palette-close:hover {
    background: var(--bg-primary);
    color: var(--accent-red);
  }

  .palette-content {
    overflow-y: auto;
    max-height: calc(70vh - 140px);
  }

  .palette-section {
    padding: var(--space-4);
  }

  .section-title {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 var(--space-3) 0;
    padding: 0 var(--space-2);
  }

  .command-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .command-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-secondary);
  }

  .command-item:hover,
  .command-item.selected {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .command-item.selected {
    background: rgba(63, 185, 80, 0.1);
    border-left: 2px solid var(--accent-green);
  }

  .command-icon {
    font-size: 1.2em;
    width: 1.5rem;
    text-align: center;
  }

  .command-text {
    flex: 1;
    font-family: var(--font-sans);
    font-size: var(--fluid-text-sm);
  }

  .command-shortcut {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-muted);
    background: var(--bg-primary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid var(--border-primary);
  }

  .palette-footer {
    padding: var(--space-3) var(--space-4);
    border-top: 1px solid var(--border-primary);
    background: var(--bg-tertiary);
  }

  .palette-hints {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-muted);
  }

  .palette-hints kbd {
    padding: 0.125rem 0.375rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: 0.125rem;
    color: var(--accent-green);
  }
</style>

<script>
  // Command palette functionality
  class CommandPalette {
    constructor() {
      this.isOpen = false;
      this.selectedIndex = 0;
      this.commands = [];
      this.init();
    }

    init() {
      this.setupCommands();
      this.setupEventListeners();
    }

    setupCommands() {
      // Quick action commands
      this.commands = [
        { id: 'home', text: 'Go to Home', icon: '🏠', shortcut: 'g h', action: () => this.navigate('/') },
        { id: 'blog', text: 'Browse Blog Posts', icon: '📝', shortcut: 'g b', action: () => this.navigate('/blog') },
        { id: 'about', text: 'About Me', icon: '👤', shortcut: 'g a', action: () => this.navigate('/about') },
        { id: 'search', text: 'Search Posts', icon: '🔍', shortcut: '/', action: () => this.focusSearch() },
        { id: 'theme', text: 'Toggle Dark Mode', icon: '🌙', shortcut: 'd', action: () => this.toggleTheme() }
      ];
    }

    setupEventListeners() {
      const palette = document.getElementById('command-palette');
      const overlay = document.getElementById('palette-overlay');
      const closeBtn = document.getElementById('palette-close');
      const input = document.getElementById('palette-input');

      // Open palette
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          this.open();
        }
      });

      // Close palette
      const closePalette = () => this.close();

      if (overlay) overlay.addEventListener('click', closePalette);
      if (closeBtn) closeBtn.addEventListener('click', closePalette);

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;

        switch(e.key) {
          case 'ArrowDown':
            e.preventDefault();
            this.selectNext();
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.selectPrevious();
            break;
          case 'Enter':
            e.preventDefault();
            this.executeSelected();
            break;
          case 'Escape':
            e.preventDefault();
            this.close();
            break;
        }
      });

      // Search functionality
      if (input) {
        input.addEventListener('input', (e) => {
          this.handleSearch(e.target.value);
        });
      }
    }

    open() {
      const palette = document.getElementById('command-palette');
      const input = document.getElementById('palette-input');

      if (palette && input) {
        palette.classList.add('active');
        input.value = '';
        input.focus();
        this.isOpen = true;
        this.selectedIndex = 0;
        this.updateSelection();
        this.showQuickActions();
      }
    }

    close() {
      const palette = document.getElementById('command-palette');
      if (palette) {
        palette.classList.remove('active');
        this.isOpen = false;
      }
    }

    selectNext() {
      const items = this.getVisibleItems();
      this.selectedIndex = (this.selectedIndex + 1) % items.length;
      this.updateSelection();
    }

    selectPrevious() {
      const items = this.getVisibleItems();
      this.selectedIndex = this.selectedIndex <= 0 ? items.length - 1 : this.selectedIndex - 1;
      this.updateSelection();
    }

    updateSelection() {
      const items = this.getVisibleItems();
      items.forEach((item, index) => {
        item.classList.toggle('selected', index === this.selectedIndex);
      });
    }

    getVisibleItems() {
      const quickActions = document.querySelectorAll('#quick-actions .command-item:not([style*="display: none"])');
      const searchResults = document.querySelectorAll('#search-list .command-item:not([style*="display: none"])');
      return [...quickActions, ...searchResults];
    }

    executeSelected() {
      const items = this.getVisibleItems();
      const selectedItem = items[this.selectedIndex];

      if (selectedItem) {
        const action = selectedItem.dataset.action;
        const command = this.commands.find(cmd => cmd.id === action);

        if (command && command.action) {
          command.action();
          this.close();
        }
      }
    }

    handleSearch(query) {
      const quickActions = document.getElementById('quick-actions');
      const searchResults = document.getElementById('search-results');
      const searchList = document.getElementById('search-list');

      if (!query.trim()) {
        this.showQuickActions();
        return;
      }

      // Filter quick actions
      const filteredCommands = this.commands.filter(cmd =>
        cmd.text.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredCommands.length > 0) {
        this.displayFilteredCommands(filteredCommands);
      } else {
        this.searchPosts(query);
      }
    }

    showQuickActions() {
      const quickActions = document.getElementById('quick-actions');
      const searchResults = document.getElementById('search-results');

      if (quickActions) quickActions.parentElement.style.display = 'block';
      if (searchResults) searchResults.style.display = 'none';

      // Show all commands
      this.commands.forEach(cmd => {
        const element = document.querySelector(`[data-action="${cmd.id}"]`);
        if (element) {
          element.style.display = 'flex';
        }
      });

      this.selectedIndex = 0;
      this.updateSelection();
    }

    displayFilteredCommands(commands) {
      const quickActions = document.getElementById('quick-actions');
      const searchResults = document.getElementById('search-results');

      if (quickActions) quickActions.parentElement.style.display = 'block';
      if (searchResults) searchResults.style.display = 'none';

      // Hide non-matching commands
      this.commands.forEach(cmd => {
        const element = document.querySelector(`[data-action="${cmd.id}"]`);
        if (element) {
          element.style.display = commands.includes(cmd) ? 'flex' : 'none';
        }
      });

      this.selectedIndex = 0;
      this.updateSelection();
    }

    async searchPosts(query) {
      // This would integrate with your search API
      const searchResults = document.getElementById('search-results');
      const searchList = document.getElementById('search-list');

      if (searchResults && searchList) {
        searchResults.style.display = 'block';
        searchList.innerHTML = '<div class="command-item">Searching...</div>';

        // Simulate search delay
        setTimeout(() => {
          const results = this.mockSearchResults(query);

          if (results.length > 0) {
            searchList.innerHTML = results.map(result => `
              <div class="command-item" data-action="post-${result.id}">
                <span class="command-icon">📄</span>
                <span class="command-text">${result.title}</span>
                <span class="command-shortcut">${result.date}</span>
              </div>
            `).join('');
          } else {
            searchList.innerHTML = '<div class="command-item">No results found</div>';
          }

          this.selectedIndex = 0;
          this.updateSelection();
        }, 300);
      }
    }

    mockSearchResults(query) {
      // Mock search results - replace with actual search implementation
      return [
        { id: 1, title: `Post about ${query}`, date: 'Dec 15' },
        { id: 2, title: `Advanced ${query} tutorial`, date: 'Dec 10' }
      ];
    }

    navigate(url) {
      window.location.href = url;
    }

    focusSearch() {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]');
      if (searchInput) {
        searchInput.focus();
      }
    }

    toggleTheme() {
      document.documentElement.classList.toggle('dark-mode');
    }
  }

  // Initialize command palette
  document.addEventListener('DOMContentLoaded', () => {
    new CommandPalette();
  });
</script>
```

## Micro-interactions and Animations

### Animation Utilities (animations.css)
```css
/* Smooth transitions for interactive elements */
.transition-all {
  transition: all 0.2s ease;
}

.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.transition-transform {
  transition: transform 0.2s ease;
}

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(63, 185, 80, 0.3);
}

/* Loading states */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(63, 185, 80, 0.1), transparent);
  animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Pulse animations */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.pulse-scale {
  animation: pulse-scale 2s infinite;
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Typing animation */
.typing-effect {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 2s steps(40, end);
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

/* Terminal cursor blink */
.cursor-blink::after {
  content: '_';
  animation: blink 1s infinite;
  color: var(--accent-cyan);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Fade in animations */
.fade-in {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in-up {
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide animations */
.slide-in-left {
  animation: slideInLeft 0.3s ease;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-right {
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Notification animations */
.notification-enter {
  animation: notificationSlideIn 0.3s ease;
}

@keyframes notificationSlideIn {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification-exit {
  animation: notificationSlideOut 0.3s ease;
}

@keyframes notificationSlideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}
```

## Implementation Steps

1. **Create the LoadingScreen component** with terminal-style animations
2. **Build the KeyboardNavigation system** with comprehensive shortcuts
3. **Implement the CommandPalette** for power users
4. **Add custom scrollbar styling** throughout the application
5. **Create micro-interaction animations** for enhanced UX
6. **Integrate all components** into the main layout
7. **Test keyboard navigation** and accessibility features
8. **Optimize animations** for performance

## Files to Modify/Created

- **New components**:
  - `src/components/LoadingScreen.astro`
  - `src/components/KeyboardNavigation.astro`
  - `src/components/CommandPalette.astro`

- **New stylesheets**:
  - `src/styles/animations.css` (all animations and transitions)

- **Files to update**:
  - `src/layouts/Layout.astro` (integrate all new components)
  - `src/styles/global.css` (import animations.css)
  - All existing components (add hover effects and transitions)

This final phase adds the professional polish that elevates the blog from a simple website to a sophisticated developer platform with terminal aesthetics and powerful user interaction capabilities.