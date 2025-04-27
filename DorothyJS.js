const text1 = document.getElementById('TextMover');
const text2 = document.getElementById('TextMover_2');
const lineaSpeed = 1;
let posicion1, posicion2;
let size_linea = true;

function initializeTextPositions() {
    if (window.innerWidth <= 767) {
        posicion1 = window.innerWidth * 0.5;
        posicion2 = -window.innerWidth * 0.5;
        size_linea = false;
    } else {
        posicion1 = text2.offsetWidth * 0.7;
        posicion2 = -text2.offsetWidth * 0.7;
        size_linea = true;
    }
    
    text1.style.transform = `translateX(${posicion1}px)`;
    text2.style.transform = `translateX(${posicion2}px)`;
}

function moverTexto1() {
    posicion1 -= lineaSpeed;
    
    // Cuando el texto sale completamente por la izquierda
    if (posicion1 < -text1.offsetWidth) {
        // Calcular la nueva posición basada en la posición actual del segundo texto
        // Colocarlo a la derecha de la pantalla, a una distancia del ancho de la ventana
        posicion1 = window.innerWidth;
        
        // Actualizar la posición sin transición para evitar efecto visual
        text1.style.transition = 'none';
        text1.style.transform = `translateX(${posicion1}px)`;
        
        // Restaurar la transición después de un pequeño retraso
        setTimeout(() => {
            text1.style.transition = 'transform 0.5s ease';
        }, 50);
    } else {
        text1.style.transform = `translateX(${posicion1}px)`;
    }
    
    requestAnimationFrame(moverTexto1);
}

function moverTexto2() {
    posicion2 -= lineaSpeed;
    
    if (posicion2 < -text2.offsetWidth) {
       
        posicion2 = window.innerWidth;
        
        
        text2.style.transition = 'none';
        text2.style.transform = `translateX(${posicion2}px)`;
        
        
        setTimeout(() => {
            text2.style.transition = 'transform 0.5s ease';
        }, 50);
    } else {
        text2.style.transform = `translateX(${posicion2}px)`;
    }
    
    requestAnimationFrame(moverTexto2);
}

function setupArrowsAnimation() {
    const lineasFlechas = document.querySelectorAll('#LineaMover');
    
    lineasFlechas.forEach((linea, index) => {
        linea.style.animation = `moverFlechas ${15 + index*2}s linear infinite`;
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
    initializeTextPositions();
    
    moverTexto1();
    moverTexto2();
    
    setupArrowsAnimation();
    
    inicializarPosicionesVers();
    moverVersiones();
    
    const mainElements = document.querySelectorAll('.fade-in');
    mainElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 200 * index);
    });
});

window.addEventListener('resize', () => {
    initializeTextPositions();
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
        this.autoplayInterval = null;
        
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
        
        this.startAutoplay();
        
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => this.stopAutoplay());
        sliderContainer.addEventListener('mouseleave', () => this.startAutoplay());
        
        window.addEventListener('resize', this.debounce(() => {
            this.updateSlider();
        }, 200));
    }
    
    goToSlide(index) {
        if (index < 0) index = this.slidesCount - 1;
        if (index >= this.slidesCount) index = 0;
        
        this.currentIndex = index;
        
        this.updateSlider();
        
        this.stopAutoplay();
        this.startAutoplay();
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
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.goToSlide(this.currentIndex + 1);
        }, 5000);
    }
    
    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }
    
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

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.slider-track')) {
        const slider = new EvolucionSlider();
        
        window.addEventListener('scroll', () => {
            const evolucionSection = document.querySelector('.evolucion-seccion');
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