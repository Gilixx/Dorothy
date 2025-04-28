// Función para manejar la animación del texto "SIGUE LA LINEA"
function setupTextAnimation() {
    const text1 = document.getElementById('TextMover');
    const text2 = document.getElementById('TextMover_2');
    
    if (!text1 || !text2) return;
    
    const container = document.getElementById('LineaConten');
    const containerWidth = container.offsetWidth;
    
    // Velocidad de movimiento
    const speed = 1.5;
    
    // Calculamos anchos de texto
    const textWidth = text1.offsetWidth;
    
    // Posiciones iniciales
    let position1 = containerWidth;
    let position2 = position1 + textWidth + 100; // Espacio entre textos
    
    // Establecemos posiciones iniciales
    text1.style.transform = `translateX(${position1}px)`;
    text2.style.transform = `translateX(${position2}px)`;
    
    // Función de animación para el primer texto
    function animateText1() {
        position1 -= speed;
        
        // Reiniciar posición cuando sale completamente de la pantalla
        if (position1 < -textWidth) {
            position1 = position2 + textWidth + 100;
        }
        
        text1.style.transform = `translateX(${position1}px)`;
        requestAnimationFrame(animateText1);
    }
    
    // Función de animación para el segundo texto
    function animateText2() {
        position2 -= speed;
        
        // Reiniciar posición cuando sale completamente de la pantalla
        if (position2 < -textWidth) {
            position2 = position1 + textWidth + 100;
        }
        
        text2.style.transform = `translateX(${position2}px)`;
        requestAnimationFrame(animateText2);
    }
    
    // Iniciar animaciones
    animateText1();
    animateText2();
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
        const newContainerWidth = container.offsetWidth;
        const newTextWidth = text1.offsetWidth;
        
        // Reposicionar si está fuera de la vista
        if (position1 < -newTextWidth) {
            position1 = newContainerWidth;
        }
        
        if (position2 < -newTextWidth) {
            position2 = newContainerWidth;
        }
        
        // Si las posiciones están muy juntas, separarlas
        const gap = Math.abs(position1 - position2);
        if (gap < newTextWidth) {
            if (position1 < position2) {
                position2 = position1 + newTextWidth + 100;
            } else {
                position1 = position2 + newTextWidth + 100;
            }
        }
        
        // Actualizar posiciones
        text1.style.transform = `translateX(${position1}px)`;
        text2.style.transform = `translateX(${position2}px)`;
    });
}

// Función para animar las flechas
function setupArrowsAnimation() {
    const lineasFlechas = document.querySelectorAll('.linea-flechas');
    
    lineasFlechas.forEach((linea, index) => {
        // Posición inicial
        let position = -100;
        const speed = 0.2; // Velocidades ligeramente diferentes para cada línea
        
        function animateArrow() {
            position += speed;
            
            // Reiniciar cuando llega al final
            if (position > 100) {
                position = -100;
            }
            
            linea.style.transform = `translateX(${position}%)`;
            requestAnimationFrame(animateArrow);
        }
        
        animateArrow();
    });
}

function scrollToPos(pos) {
    const element = document.getElementById(pos);
    if (!element) return;
    
    const posPx = element.getBoundingClientRect().top - 100;
    window.scrollTo({
        top: posPx + window.scrollY, 
        behavior: "smooth"
    });
    
    const myDropdown = document.getElementById("myDropdown");
    if (myDropdown && myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
    }
}

let size = true;

function inicializarPosicionesVers() {
    const versiones = document.querySelectorAll("#Vers li");
    let posicionActual = 0;
    
    versiones.forEach((item) => {
        item.style.transform = `translateX(${posicionActual}px)`;
        posicionActual += item.offsetWidth + 20;
    });
}

function moverVersiones() {
    const versiones = document.querySelectorAll("#Vers li");
    const velocidad_Vers = 0.4;
    
    versiones.forEach((item) => {
        let posItem = item.style.transform ?
            parseFloat(item.style.transform.replace('translateX(', '').replace('px)', '')) : 0;

        posItem -= velocidad_Vers;

        if (posItem < -item.offsetWidth - 30) {
            const lastVersion = [...versiones].reduce((max, v) => {
                const pos = v.style.transform ? 
                    parseFloat(v.style.transform.replace('translateX(', '').replace('px)', '')) : 0;
                return pos > max ? pos : max;
            }, 0);
            
            posItem = lastVersion + versiones[0].offsetWidth + 20;
            
            item.style.opacity = "0";
            item.style.transform = `translateX(${posItem}px)`;
            
            setTimeout(() => {
                item.style.opacity = "1";
            }, 50);
        } else {
            item.style.transform = `translateX(${posItem}px)`;
        }
    });
    
    if (window.innerWidth <= 767 && size == true) {
        size = false;
        inicializarPosicionesVers();
    } else if (window.innerWidth > 767 && size == false) {
        size = true;
        inicializarPosicionesVers();
    }
    
    requestAnimationFrame(moverVersiones);
}

const header = document.getElementById('headLinks');
let prevScrollpos = window.pageYOffset;
let scrollingUp = 0;
let scrollingDown = 10;

window.onscroll = function() {
    const currentScrollPos = window.pageYOffset;

    if (prevScrollpos < currentScrollPos) {
        scrollingDown++;
        scrollingUp = 0;
    } else {
        scrollingUp++;
        scrollingDown = 0;
    }

    if (prevScrollpos < currentScrollPos && currentScrollPos > 200 && scrollingDown > 10) {
        const myDropdown = document.getElementById("myDropdown");
        if (myDropdown && myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
        header.style.top = "-90px";
    } else if (scrollingUp > 5 || currentScrollPos < 100) {
        header.style.top = "0";
    }
    
    prevScrollpos = currentScrollPos;
};

function dropDownFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
        const myDropdown = document.getElementById("myDropdown");
        if (myDropdown && myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    // Inicializar animación de texto y flechas
    setupTextAnimation();
    setupArrowsAnimation();
    
    // Inicializar posiciones de versiones
    inicializarPosicionesVers();
    moverVersiones();
    
    // Efectos de aparición si existen elementos con la clase fade-in
    const mainElements = document.querySelectorAll('.fade-in');
    mainElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 200 * index);
    });
    
    // Inicializar el slider si existe
    if (document.querySelector('.slider-track')) {
        const slider = new EvolucionSlider();
        
        window.addEventListener('scroll', () => {
            const evolucionSection = document.querySelector('.evolucion-seccion');
            if (!evolucionSection) return;
            
            const rect = evolucionSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const scrollPosition = window.scrollY;
                const parallaxElements = document.querySelectorAll('.slide-image img');
                
                parallaxElements.forEach(el => {
                    const speed = 0.05;
                    const yPos = -(scrollPosition * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
            }
        });
    }
});

window.addEventListener('resize', () => {
    // Actualización en cambios de tamaño de ventana
    inicializarPosicionesVers();
});

class EvolucionSlider {
    constructor() {
        this.track = document.querySelector('.slider-track');
        this.slides = Array.from(document.querySelectorAll('.slider-slide'));
        this.indicators = Array.from(document.querySelectorAll('.indicator-dot'));
        this.timelineMarkers = Array.from(document.querySelectorAll('.timeline-marker'));
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        this.currentIndex = 0;
        this.slidesCount = this.slides.length;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        
        // Sin autoplay
        
        this.init();
    }
    
    init() {
        this.updateSlider();
        
        this.slides.forEach((slide, index) => {
            slide.style.setProperty('--slide-index', index);
        });
        
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.goToSlide(this.currentIndex - 1));
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.goToSlide(this.currentIndex + 1));
        
        this.indicators.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.timelineMarkers.forEach((marker, index) => {
            marker.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.setupTouchEvents();
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.goToSlide(this.currentIndex - 1);
            if (e.key === 'ArrowRight') this.goToSlide(this.currentIndex + 1);
        });
        
        // Sin autoplay
        
        window.addEventListener('resize', this.debounce(() => {
            this.updateSlider();
        }, 200));
    }
    
    goToSlide(index) {
        if (index < 0) index = this.slidesCount - 1;
        if (index >= this.slidesCount) index = 0;
        
        this.currentIndex = index;
        
        this.updateSlider();
        
        // Sin autoplay
    }
    
    updateSlider() {
        const slideWidth = this.slides[0].offsetWidth;
        const newPosition = -this.currentIndex * slideWidth;
        
        this.track.style.transform = `translateX(${newPosition}px)`;
        
        this.slides.forEach((slide, index) => {
            if (index === this.currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        this.indicators.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('active');
                dot.removeAttribute('aria-current');
            }
        });
        
        this.timelineMarkers.forEach((marker, index) => {
            if (index === this.currentIndex) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    }
    
    setupTouchEvents() {
        this.track.addEventListener('touchstart', this.touchStart.bind(this));
        this.track.addEventListener('touchmove', this.touchMove.bind(this));
        this.track.addEventListener('touchend', this.touchEnd.bind(this));
        
        this.track.addEventListener('mousedown', this.touchStart.bind(this));
        this.track.addEventListener('mousemove', this.touchMove.bind(this));
        this.track.addEventListener('mouseup', this.touchEnd.bind(this));
        this.track.addEventListener('mouseleave', this.touchEnd.bind(this));
    }
    
    touchStart(event) {
        this.isDragging = true;
        this.startPos = this.getPositionX(event);
        this.animationID = requestAnimationFrame(this.animation.bind(this));
        this.track.style.cursor = 'grabbing';
    }
    
    touchMove(event) {
        if (this.isDragging) {
            const currentPosition = this.getPositionX(event);
            this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
        }
    }
    
    touchEnd() {
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        
        if (movedBy < -100 && this.currentIndex < this.slidesCount - 1) {
            this.goToSlide(this.currentIndex + 1);
        } else if (movedBy > 100 && this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        } else {
            this.goToSlide(this.currentIndex);
        }
        
        this.track.style.cursor = 'grab';
    }
    
    getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    animation() {
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        if (this.isDragging) requestAnimationFrame(this.animation.bind(this));
    }
    
    // Sin métodos de autoplay
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}