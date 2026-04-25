// =========================================
// script.js - Kore Digital
// =========================================

// 1. Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

// 2. Mobile Menu Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            const icon = mobileMenu.classList.contains('flex') ? 'x' : 'menu';
            mobileMenuBtn.innerHTML = `<i data-lucide="${icon}" class="w-8 h-8"></i>`;
            lucide.createIcons();
        });
    }
});

// Helper function to close menu on link click
window.toggleMenu = function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        mobileMenuBtn.innerHTML = `<i data-lucide="menu" class="w-8 h-8"></i>`;
        lucide.createIcons();
    }
};

// 3. Anti-Gravity Interactive Hero Canvas
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    const heroSection = document.querySelector('.hero-home');
    
    // Only run if the elements exist (prevents errors on secondary pages like Contact or About)
    if (!canvas || !heroSection) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let hw = heroSection.offsetWidth;
    let hh = heroSection.offsetHeight;
    
    // Mouse Interaction Configuration
    let mouse = { x: null, y: null, radius: 150 };
    
    heroSection.addEventListener('mousemove', function(event) {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    
    heroSection.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    // Handle Window Resize dynamically
    window.addEventListener('resize', function() {
        hw = heroSection.offsetWidth;
        hh = heroSection.offsetHeight;
        canvas.width = hw;
        canvas.height = hh;
        initParticles();
    });

    // Particle Physics Class
    class FloatingShape {
        constructor() {
            this.x = Math.random() * hw;
            this.y = Math.random() * hh;
            this.size = Math.random() * 6 + 3; 
            
            // Anti-gravity logic (drifting UP)
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * -1.2 - 0.2; 
            
            // Branding Colors (Primary Blue, Soft Whites, Purples)
            this.color = ['#5c67ff', '#8b93ff', '#ffffff', '#e0e7ff'][Math.floor(Math.random() * 4)];
            this.opacity = Math.random() * 0.5 + 0.1;
            
            this.type = Math.floor(Math.random() * 3); // 0: filled orb, 1: hollow ring, 2: plus sign
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 1.5;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.lineWidth = 1.5;
            
            ctx.beginPath();
            if (this.type === 0) { 
                ctx.arc(0, 0, this.size / 1.5, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 1) { 
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.stroke();
            } else if (this.type === 2) { 
                ctx.moveTo(-this.size, 0);
                ctx.lineTo(this.size, 0);
                ctx.moveTo(0, -this.size);
                ctx.lineTo(0, this.size);
                ctx.stroke();
            }
            ctx.restore();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            // Reset shape when it floats out of bounds
            if (this.y < 0 - this.size * 2) {
                this.y = hh + this.size * 2;
                this.x = Math.random() * hw;
            }
            if (this.x < 0 - this.size * 2) this.x = hw + this.size * 2;
            if (this.x > hw + this.size * 2) this.x = 0 - this.size * 2;

            // Interactive Mouse Repulsion Engine
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    this.x -= forceDirectionX * force * 2.5;
                    this.y -= forceDirectionY * force * 2.5;
                }
            }
            this.draw();
        }
    }

    function initParticles() {
        canvas.width = hw;
        canvas.height = hh;
        particlesArray = [];
        // Adjust density: fewer particles on mobile devices
        const numParticles = window.innerWidth < 768 ? 25 : 60;
        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(new FloatingShape());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        requestAnimationFrame(animateParticles);
    }

    // Initialize and run
    initParticles();
    animateParticles();
});

// === 4. AJAX Form Submission & Success Message ===
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    if (form && successMessage && submitBtn) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // Stop the page from redirecting
            
            // Change button to show loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-70', 'cursor-not-allowed');

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Hide the form
                    form.classList.add('hidden');
                    
                    // Show the success message smoothly
                    successMessage.classList.remove('hidden');
                    successMessage.classList.add('flex');
                    
                    // Re-initialize Lucide icons for the new check-circle icon
                    lucide.createIcons(); 
                } else {
                    alert('Oops! There was a problem submitting your form. Please try again.');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                }
            } catch (error) {
                alert('Oops! There was a network error. Please try again.');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            }
        });
    }
});
