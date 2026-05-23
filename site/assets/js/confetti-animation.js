// Confetti Fireworks Animation - Auto-triggers on page load
(function() {
  'use strict';
  
  // Canvas confetti library (embedded lightweight version)
  var confetti = (function() {
    var module = {};
    
    module.create = function(canvas, options) {
      var globalOptions = {
        resize: true,
        useWorker: true
      };
      Object.assign(globalOptions, options);
      
      var canvasContext = canvas.getContext('2d');
      var particles = [];
      var animationFrame;
      
      function confettiCannon(opts) {
        var particleCount = opts.particleCount || 50;
        var angle = opts.angle || 90;
        var spread = opts.spread || 45;
        var startVelocity = opts.startVelocity || 45;
        var decay = opts.decay || 0.05;
        var gravity = opts.gravity || 1;
        var drift = opts.drift || 0;
        var ticks = opts.ticks || 200;
        var origin = opts.origin || { x: 0.5, y: 0.5 };
        var colors = opts.colors || ['#ffffff', '#FF0000'];
        var shapes = opts.shapes || ['square', 'circle'];
        var wobble = opts.wobble || { distance: 30, speed: 7 };
        var roll = opts.roll || { speed: 10 };
        var tilt = opts.tilt || { speed: 30 };
        
        var originX = origin.x * canvas.width;
        var originY = origin.y * canvas.height;
        
        for (var i = 0; i < particleCount; i++) {
          var angleRad = (angle - spread / 2 + Math.random() * spread) * Math.PI / 180;
          var velocity = startVelocity * (0.5 + Math.random() * 0.5);
          
          particles.push({
            x: originX,
            y: originY,
            vx: Math.cos(angleRad) * velocity,
            vy: Math.sin(angleRad) * velocity,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            size: Math.random() * 2.5, // Increased from 2 to 2.5 (25% bigger)
            sizeGrowing: true,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * tilt.speed,
            tilt: Math.random() * 360,
            tiltSpeed: (Math.random() - 0.5) * tilt.speed,
            wobbleOffset: Math.random() * Math.PI * 2,
            wobbleSpeed: (Math.random() - 0.5) * wobble.speed * 2,
            roll: 0,
            rollSpeed: (Math.random() * roll.speed) + 5,
            gravity: gravity,
            decay: decay,
            drift: drift,
            ticks: ticks,
            currentTick: 0,
            opacity: 1
          });
        }
      }
      
      function update() {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        
        particles = particles.filter(function(particle) {
          particle.currentTick++;
          
          // Size animation - grow from 0 to max
          if (particle.sizeGrowing && particle.size < 2.5) { // Increased from 2 to 2.5
            particle.size += 0.2; // Increased from 0.16 to 0.2
            if (particle.size >= 2.5) { // Increased from 2 to 2.5
              particle.sizeGrowing = false;
            }
          }
          
          // Movement with decay
          particle.vx *= (1 - particle.decay);
          particle.vy *= (1 - particle.decay);
          particle.vy += particle.gravity * 0.5;
          
          // Wobble effect
          particle.wobbleOffset += particle.wobbleSpeed * 0.016;
          var wobbleX = Math.cos(particle.wobbleOffset) * 30;
          
          particle.x += particle.vx + wobbleX * 0.016;
          particle.y += particle.vy;
          
          // Rotation animations
          particle.rotation += particle.rotationSpeed;
          particle.tilt += particle.tiltSpeed;
          particle.roll += particle.rollSpeed;
          
          particle.opacity = 1 - (particle.currentTick / particle.ticks);
          
          if (particle.currentTick >= particle.ticks || particle.opacity <= 0 || particle.y > canvas.height) {
            return false;
          }
          
          canvasContext.save();
          canvasContext.translate(particle.x, particle.y);
          canvasContext.rotate(particle.rotation * Math.PI / 180);
          
          // Apply roll darkening effect
          var brightness = 1 - (Math.abs(Math.sin(particle.roll * Math.PI / 180)) * 0.25);
          var adjustedColor = adjustBrightness(particle.color, brightness);
          
          canvasContext.globalAlpha = particle.opacity;
          canvasContext.fillStyle = adjustedColor;
          
          // Apply tilt transformation
          var tiltX = Math.cos(particle.tilt * Math.PI / 180);
          
          if (particle.shape === 'circle') {
            canvasContext.beginPath();
            canvasContext.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            canvasContext.fill();
          } else {
            canvasContext.scale(tiltX, 1);
            canvasContext.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          }
          
          canvasContext.restore();
          return true;
        });
        
        if (particles.length > 0) {
          animationFrame = requestAnimationFrame(update);
        }
      }
      
      function adjustBrightness(color, factor) {
        // Simple brightness adjustment
        if (color === '#ffffff') {
          var val = Math.floor(255 * factor);
          return 'rgb(' + val + ',' + val + ',' + val + ')';
        }
        return color;
      }
      
      return function fire(opts) {
        confettiCannon(opts);
        if (!animationFrame) {
          update();
        }
      };
    };
    
    return module;
  })();
  
  // Initialize confetti on page load
  function initConfetti() {
    // Create canvas element
    var canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Add to body
    document.body.appendChild(canvas);
    
    // Handle resize
    window.addEventListener('resize', function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    
    // Create confetti instance
    var myConfetti = confetti.create(canvas, {
      resize: true
    });
    
    // Trigger fireworks animation
    triggerFireworks(myConfetti, canvas);
  }
  
  function triggerFireworks(myConfetti, canvas) {
    var duration = 3000; // 3 seconds
    var end = Date.now() + duration;
    var colors = ["#FFD700", "#FF1493"]; // Gold and Deep Pink - visible on both light and dark backgrounds
    
    var interval = setInterval(function() {
      if (Date.now() > end) {
        clearInterval(interval);
        // Remove canvas after animation completes
        setTimeout(function() {
          if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }, 2000);
        return;
      }
      
      // Left emitter (bottom-left, shooting top-right)
      myConfetti({
        particleCount: 5,
        angle: 315,
        spread: 55,
        startVelocity: Math.random() * 40 + 10, // 10-50 speed range
        origin: { x: 0, y: 0.3 },
        colors: colors,
        gravity: 1,
        decay: 0.05,
        ticks: 400,
        wobble: { distance: 30, speed: 7 },
        roll: { speed: 10 },
        tilt: { speed: 30 }
      });
      
      // Right emitter (bottom-right, shooting top-left)
      myConfetti({
        particleCount: 5,
        angle: 225,
        spread: 55,
        startVelocity: Math.random() * 40 + 10, // 10-50 speed range
        origin: { x: 1, y: 0.3 },
        colors: colors,
        gravity: 1,
        decay: 0.05,
        ticks: 400,
        wobble: { distance: 30, speed: 7 },
        roll: { speed: 10 },
        tilt: { speed: 30 }
      });
    }, 150); // Fire every 150ms (0.15 delay)
  }
  
  // Auto-start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Check if confetti has been shown before
      if (!sessionStorage.getItem('confettiShown')) {
        sessionStorage.setItem('confettiShown', 'true');
        initConfetti();
      }
    });
  } else {
    // Check if confetti has been shown before
    if (!sessionStorage.getItem('confettiShown')) {
      sessionStorage.setItem('confettiShown', 'true');
      initConfetti();
    }
  }
})();
