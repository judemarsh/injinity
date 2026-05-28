/**
 * INJINITY Interactive Website Core Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Visual & Structural Components
  initParticleNetwork();
  initNavigationEffects();
  initInteractiveEstimator();
  initPortfolioFilters();
  initScrollReveal();
  initContactForm();
});

/**
 * 1. Performance-Optimized Particle Network Background
 */
function initParticleNetwork() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];
  const maxParticles = 60;
  
  // Interaction Radius & Mouse Coordinates
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Track Resize
  function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  // Particle Blueprint
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce at screen edges
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 2;
          this.y += Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      ctx.fillStyle = `rgba(138, 43, 226, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.hypot(dx, dy);

        if (distance < 110) {
          const opacity = (1 - (distance / 110)) * 0.15;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  // Bind Listeners
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrameId);
    setCanvasDimensions();
    animate();
  });

  setCanvasDimensions();
  animate();
}

/**
 * 2. Sticky Navigation Header and Mobile Toggle
 */
function initNavigationEffects() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Sticky Scroll Class Trigger
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  });

  // Mobile Slide-Out Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('open');
      
      // Transform Menu Icon SVG Lines
      const lineMid = document.getElementById('line-mid');
      const lineTop = document.getElementById('line-top');
      const lineBot = document.getElementById('line-bot');

      if (mobileToggle.classList.contains('open')) {
        lineMid.style.opacity = '0';
        lineTop.style.transform = 'translateY(6px) rotate(45deg)';
        lineTop.style.transformOrigin = 'center';
        lineBot.style.transform = 'translateY(-6px) rotate(-45deg)';
        lineBot.style.transformOrigin = 'center';
      } else {
        lineMid.style.opacity = '1';
        lineTop.style.transform = 'none';
        lineBot.style.transform = 'none';
      }
    });

    // Close Menu on Link Clicks
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('open');
        const lineMid = document.getElementById('line-mid');
        const lineTop = document.getElementById('line-top');
        const lineBot = document.getElementById('line-bot');
        if (lineMid) lineMid.style.opacity = '1';
        if (lineTop) lineTop.style.transform = 'none';
        if (lineBot) lineBot.style.transform = 'none';
      });
    });
  }

  // Active Link Selection Highlight
  function highlightActiveLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/**
 * 3. Interactive Project Estimator
 */
function initInteractiveEstimator() {
  const platformCards = document.querySelectorAll('#step-platforms .option-card');
  const featureCards = document.querySelectorAll('#step-features .option-card');
  const complexitySlider = document.getElementById('complexity-slider');
  const complexityLabel = document.getElementById('complexity-label');
  
  // Breakdown Display DOM Targets
  const bdPlatform = document.getElementById('bd-platform');
  const bdFeatures = document.getElementById('bd-features');
  const bdComplexity = document.getElementById('bd-complexity');
  const calculatedTotal = document.getElementById('calculated-total');

  if (!platformCards.length || !complexitySlider) return;

  // Single Selection for Platforms
  platformCards.forEach(card => {
    card.addEventListener('click', () => {
      platformCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      calculateCost();
    });
  });

  // Multiple Selections for Features
  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      calculateCost();
    });
  });

  // Slide Input Change
  complexitySlider.addEventListener('input', () => {
    const val = parseFloat(complexitySlider.value);
    complexityLabel.textContent = `Scale Complexity (${val}x)`;
    calculateCost();
  });

  // Main Calculation Routine
  function calculateCost() {
    let platformCost = 0;
    let platformName = '';
    let featuresCost = 0;
    let selectedFeaturesNames = [];

    // Evaluate Platform Cost
    const selectedPlatform = document.querySelector('#step-platforms .option-card.selected');
    if (selectedPlatform) {
      platformCost = parseInt(selectedPlatform.getAttribute('data-value'), 10);
      platformName = selectedPlatform.querySelector('span').textContent;
    }

    // Evaluate Features Cost
    const selectedFeatures = document.querySelectorAll('#step-features .option-card.selected');
    selectedFeatures.forEach(feature => {
      featuresCost += parseInt(feature.getAttribute('data-value'), 10);
      selectedFeaturesNames.push(feature.querySelector('span').textContent);
    });

    // Evaluate Complexity Factor
    const complexityVal = parseFloat(complexitySlider.value);

    // Compute Total
    const subtotal = platformCost + featuresCost;
    const grandTotal = Math.round(subtotal * complexityVal);

    // Update Layout Card
    if (bdPlatform) {
      bdPlatform.textContent = `${platformName} ($${platformCost.toLocaleString()})`;
    }
    if (bdFeatures) {
      bdFeatures.textContent = selectedFeaturesNames.length > 0
        ? `${selectedFeaturesNames.join(', ')} ($${featuresCost.toLocaleString()})`
        : `None ($0)`;
    }
    if (bdComplexity) {
      bdComplexity.textContent = `${complexityVal}x`;
    }
    if (calculatedTotal) {
      calculatedTotal.textContent = `$${grandTotal.toLocaleString()}`;
    }
  }

  // Run First Calculation
  calculateCost();
}

/**
 * 4. Portfolio Filters Showcase
 */
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!filterButtons.length || !portfolioItems.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Manage Active state of buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const activeFilter = button.getAttribute('data-filter');

      // Sort Showcase Cards
      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (activeFilter === 'all' || itemCategory === activeFilter) {
          item.style.display = 'flex';
          // Force reflow for seamless animations
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * 5. Scroll-Triggered Reveal System
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve to trigger transition once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });
}

/**
 * 6. Contact Console Form Submission
 */
function initContactForm() {
  const form = document.getElementById('inquiry-form');
  const statusBox = document.getElementById('form-status-box');
  const submitBtn = document.getElementById('btn-submit-form');

  if (!form || !statusBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // UI Loading feedback
    submitBtn.textContent = 'Transmitting Parameters...';
    submitBtn.disabled = true;
    
    // Simulate secure network transaction
    setTimeout(() => {
      statusBox.textContent = 'Transmission complete. Our systems engineering lead will connect with you in 2-4 business hours.';
      statusBox.className = 'form-status success';
      
      // Reset Form fields
      form.reset();
      submitBtn.textContent = 'Submit Parameters';
      submitBtn.disabled = false;

      // Scroll Status into viewport view
      statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Auto fadeout success block after 8 seconds
      setTimeout(() => {
        statusBox.style.display = 'none';
      }, 8000);
      
    }, 1500);
  });
}
