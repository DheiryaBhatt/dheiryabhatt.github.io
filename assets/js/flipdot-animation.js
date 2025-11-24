// Flipdot Animation JavaScript - True Dot Matrix Display
class FlipDotAnimation {
  constructor(containerId, text, options = {}) {
    this.container = document.getElementById(containerId);
    this.text = text;
    this.delay = options.delay || 10; // Delay between dot flips
    this.autoStart = options.autoStart !== false;
    this.loop = options.loop || false;
    this.loopDelay = options.loopDelay || 3000;
    this.dotSize = options.dotSize || 2;
    this.rows = 7; // Standard flipdot display height
    this.cols = this.text.length * 6; // 5 chars + 1 space per character
    
    this.dotMatrix = this.createDotMatrix();
    this.init();
  }
  
  // 5x7 dot matrix patterns for each character
  createDotMatrix() {
    return {
      'W': [
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [1,1,0,1,1],
        [1,0,0,0,1]
      ],
      'E': [
        [1,1,1,1,1],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,1,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,1,1]
      ],
      'L': [
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,1,1]
      ],
      'C': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      'D': [
        [1,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,0]
      ],
      'O': [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      'M': [
        [1,0,0,0,1],
        [1,1,0,1,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1]
      ],
      'T': [
        [1,1,1,1,1],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0]
      ],
      '!': [
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,0,0,0],
        [0,0,1,0,0]
      ],
      'S': [
        [0,1,1,1,1],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [0,1,1,1,0],
        [0,0,0,0,1],
        [0,0,0,0,1],
        [1,1,1,1,0]
      ],
      'B': [
        [1,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,0]
      ],
      'G': [
        [0,1,1,1,1],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,1,1,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      '\'': [
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ],
      ' ': [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ]
    };
  }

  init() {
    if (!this.container) {
      console.error('Container not found');
      return;
    }
    
    this.createDotDisplay();
    
    if (this.autoStart) {
      this.start();
    }
  }
  
  createDotDisplay() {
    this.container.innerHTML = '';
    
    // Create dot grid
    this.dotGrid = [];
    this.container.style.display = 'grid';
    this.container.style.gridTemplateColumns = `repeat(${this.cols}, ${this.dotSize}px)`;
    this.container.style.gridTemplateRows = `repeat(${this.rows}, ${this.dotSize}px)`;
    this.container.style.gap = '1px';
    
    for (let row = 0; row < this.rows; row++) {
      this.dotGrid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const dot = document.createElement('div');
        dot.className = 'flipdot-dot';
        dot.style.width = this.dotSize + 'px';
        dot.style.height = this.dotSize + 'px';
        this.container.appendChild(dot);
        this.dotGrid[row][col] = dot;
      }
    }
  }
  
  async start() {
    // Reset all dots to off state
    this.resetAllDots();
    
    // Wait a moment before starting
    await this.sleep(300);
    
    // Create text pattern in dot matrix
    const textPattern = this.createTextPattern();
    
    // Animate dots from right to left
    const allDots = this.getAllDotsToFlip(textPattern);
    
    // Sort dots by column (left to right)
    allDots.sort((a, b) => a.col - b.col);
    
    // Animate each dot with delay
    for (let i = 0; i < allDots.length; i++) {
      const { row, col } = allDots[i];
      this.flipDot(row, col);
      await this.sleep(this.delay);
    }
    
    // If loop is enabled, restart after delay
    if (this.loop) {
      setTimeout(() => {
        this.start();
      }, this.loopDelay);
    }
  }
  
  createTextPattern() {
    const pattern = [];
    for (let row = 0; row < this.rows; row++) {
      pattern[row] = [];
      for (let col = 0; col < this.cols; col++) {
        pattern[row][col] = 0;
      }
    }
    
    let currentCol = 0;
    for (let i = 0; i < this.text.length; i++) {
      const char = this.text[i].toUpperCase();
      const charPattern = this.dotMatrix[char] || this.dotMatrix[' '];
      
      // Place character pattern in the grid
      for (let row = 0; row < this.rows && row < charPattern.length; row++) {
        for (let col = 0; col < 5 && currentCol + col < this.cols; col++) {
          if (charPattern[row] && charPattern[row][col]) {
            pattern[row][currentCol + col] = 1;
          }
        }
      }
      currentCol += 6; // 5 character width + 1 space
    }
    
    return pattern;
  }
  
  getAllDotsToFlip(pattern) {
    const dots = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (pattern[row][col] === 1) {
          dots.push({ row, col });
        }
      }
    }
    return dots;
  }
  
  async flipDot(row, col) {
    if (this.dotGrid[row] && this.dotGrid[row][col]) {
      const dot = this.dotGrid[row][col];
      dot.classList.add('flipped');
      return new Promise(resolve => {
        setTimeout(resolve, 10);
      });
    }
  }
  
  resetAllDots() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.dotGrid[row] && this.dotGrid[row][col]) {
          this.dotGrid[row][col].classList.remove('flipped');
        }
      }
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  reset() {
    this.resetAllDots();
  }
  
  // Manual control methods
  flipAll() {
    const textPattern = this.createTextPattern();
    const allDots = this.getAllDotsToFlip(textPattern);
    allDots.forEach(({ row, col }) => {
      if (this.dotGrid[row] && this.dotGrid[row][col]) {
        this.dotGrid[row][col].classList.add('flipped');
      }
    });
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if flipdot container exists on the page
  const flipdotContainer = document.getElementById('flipdot-animation');
  if (flipdotContainer) {
    // Initialize the animation
    window.flipdotAnimation = new FlipDotAnimation('flipdot-animation', "Deebot's Blog!", {
      delay: 10,
      autoStart: true,
      loop: true,
      loopDelay: 4000
    });
  }
});

// Export for manual use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FlipDotAnimation;
}