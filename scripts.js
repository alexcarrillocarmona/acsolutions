/* 
   AC Solutions - scripts.js 2026
   Animaciones creativas, interactivas y futuristas.
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Iniciamos el fondo de partículas tecnológicas
    initTechParticles();

    // 2. Iniciamos el efecto magnético en las insignias de tecnología
    initMagneticBadges();

    // 3. Iniciamos las animaciones de entrada en el desplazamiento (scroll)
    initScrollAnimations();
});


/**
 * Crea una red dinámica de partículas en el fondo de la sección principal.
 */
function initTechParticles() {
    const canvasContainer = document.querySelector('.main-description');
    if (!canvasContainer) return;

    // Crear el elemento canvas y añadirlo al contenedor
    const canvas = document.createElement('canvas');
    canvas.classList.add('tech-particles-canvas');
    canvasContainer.prepend(canvas); // Lo ponemos al principio para que quede detrás del contenido
    const ctx = canvas.getContext('2d');

    let particles = [];
    let width, height;

    // Configuración
    const count = 50; // Menos partículas para un efecto más limpio
    const color = {
        point: 'rgba(107, 29, 56, 0.4)', // Vinotinto muy transparente
        line: 'rgba(107, 29, 56, 0.2)'    // Líneas casi invisibles
    };

    // Ajustar el canvas al contenedor
    function resize() {
        width = canvas.width = canvasContainer.offsetWidth;
        height = canvas.height = canvasContainer.offsetHeight;
        particles.forEach(p => p.resize(width, height));
    }
    window.addEventListener('resize', resize);
    resize();

    // Clase para las partículas
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Velocidad muy lenta
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        resize(w, h) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.random() * 0.1); // Solo un pequeño punto
            ctx.fillStyle = color.point;
            ctx.fill();
        }
    }

    // Inicializar partículas
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    // Bucle de animación
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Dibujar líneas primero para que queden detrás
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = color.line;
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < 150) { // Conexión sutil
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Dibujar partículas
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/**
 * Añade un sutil efecto "magnético" a las insignias de tecnología en el escritorio.
 */
function initMagneticBadges() {
    const badges = document.querySelectorAll('.tech-badge');
    const isMobile = window.matchMedia("(max-width: 991px)").matches;

    if (isMobile) return;

    badges.forEach(badge => {
        badge.addEventListener('mousemove', e => {
            const rect = badge.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3; // Desplazamiento reducido
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            
            badge.style.transform = `translate(${x}px, ${y}px)`;
        });

        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Utiliza Intersection Observer para animar la entrada secuencial del contenido.
 */
function initScrollAnimations() {
    // Añadimos clases a los elementos que queremos animar (podríamos hacerlo en el HTML, pero es más limpio así)
    const elementsToAnimate = [
        '.main-description h1',
        '.main-description .lead',
        '.main-description .fs-5',
        '.tech-badge-container'
    ];
    
    // Asignar clases de animación iniciales
    elementsToAnimate.forEach((selector, index) => {
        const el = document.querySelector(selector);
        if (el) {
            el.classList.add('animate-on-scroll');
            // Retardo secuencial
            el.style.transitionDelay = `${index * 0.15}s`;
        }
    });

    // Configurar el observador
    const observerOptions = {
        root: null, // Ventana gráfica (viewport)
        threshold: 0.2, // El elemento debe ser 20% visible
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejamos de observar una vez que ha aparecido
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Comenzar a observar
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    scrollElements.forEach(el => observer.observe(el));
}