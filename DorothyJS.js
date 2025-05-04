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
        this.isMobile = window.innerWidth < 768;
        
        this.init();
    }
    
    init() {
        this.setSlidePositions();
        this.updateSlider();
        
        // Configurar índices de diapositivas para animación
        this.slides.forEach((slide, index) => {
            slide.style.setProperty('--slide-index', index);
        });
        
        // Configurar botones de navegación
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.goToSlide(this.currentIndex - 1));
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.goToSlide(this.currentIndex + 1));
        
        // Configurar indicadores
        this.indicators.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Configurar marcadores de línea de tiempo
        this.timelineMarkers.forEach((marker, index) => {
            marker.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Configurar eventos táctiles
        this.setupTouchEvents();
        
        // Configurar eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.goToSlide(this.currentIndex - 1);
            if (e.key === 'ArrowRight') this.goToSlide(this.currentIndex + 1);
        });
        
        // Manejar cambios de tamaño de ventana
        window.addEventListener('resize', this.debounce(() => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth < 768;
            
            // Solo recalcular si cambió entre móvil y escritorio
            if (wasMobile !== this.isMobile) {
                this.setSlidePositions();
            }
            
            this.updateSlider();
        }, 200));
        
        // Precargar imágenes para evitar saltos
        this.preloadImages();
    }
    
    setSlidePositions() {
        // Asegurar que todos los slides tienen la misma anchura y el track es lo suficientemente ancho
        const containerWidth = this.track.parentElement.offsetWidth;
        
        this.slides.forEach(slide => {
            slide.style.width = `${containerWidth}px`;
        });
        
        this.track.style.width = `${containerWidth * this.slidesCount}px`;
    }
    
    preloadImages() {
        // Precargar todas las imágenes para evitar problemas de visualización durante la transición
        const slideImages = document.querySelectorAll('.slide-image img');
        
        slideImages.forEach(img => {
            const image = new Image();
            image.src = img.src;
        });
    }
    
    goToSlide(index) {
        // Gestionar navegación circular
        if (index < 0) index = this.slidesCount - 1;
        if (index >= this.slidesCount) index = 0;
        
        this.currentIndex = index;
        this.updateSlider();
    }
    
    updateSlider() {
        // Actualizar la posición del slider
        const slideWidth = this.slides[0].offsetWidth;
        const newPosition = -this.currentIndex * slideWidth;
        
        this.track.style.transform = `translateX(${newPosition}px)`;
        this.prevTranslate = newPosition;
        
        // Actualizar clases activas en slides
        this.slides.forEach((slide, index) => {
            if (index === this.currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Actualizar indicadores
        this.indicators.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('active');
                dot.removeAttribute('aria-current');
            }
        });
        
        // Actualizar marcadores de línea de tiempo
        this.timelineMarkers.forEach((marker, index) => {
            if (index === this.currentIndex) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    }
    
    setupTouchEvents() {
        // Configurar eventos táctiles para dispositivos móviles
        this.track.addEventListener('touchstart', this.touchStart.bind(this), { passive: false });
        this.track.addEventListener('touchmove', this.touchMove.bind(this), { passive: false });
        this.track.addEventListener('touchend', this.touchEnd.bind(this));
        
        // Configurar eventos de ratón para desktop
        this.track.addEventListener('mousedown', this.touchStart.bind(this));
        this.track.addEventListener('mousemove', this.touchMove.bind(this));
        this.track.addEventListener('mouseup', this.touchEnd.bind(this));
        this.track.addEventListener('mouseleave', this.touchEnd.bind(this));
    }
    
    touchStart(event) {
        if (event.type === 'touchstart') {
            event.preventDefault(); // Evitar desplazamiento de página en móviles
        }
        
        this.isDragging = true;
        this.startPos = this.getPositionX(event);
        this.currentTranslate = this.prevTranslate;
        this.animationID = requestAnimationFrame(this.animation.bind(this));
        this.track.style.cursor = 'grabbing';
    }
    
    touchMove(event) {
        if (!this.isDragging) return;
            
        if (event.type === 'touchmove') {
            event.preventDefault(); // Evitar desplazamiento de página en móviles
        }
        
        const currentPosition = this.getPositionX(event);
        this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
    }
    
    touchEnd() {
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        
        // Umbral adaptativo para dispositivos móviles vs desktop
        const threshold = this.isMobile ? 40 : 80;
        
        if (movedBy < -threshold && this.currentIndex < this.slidesCount - 1) {
            this.goToSlide(this.currentIndex + 1);
        } else if (movedBy > threshold && this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        } else {
            // Volver a la posición original si no se cumple el umbral
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

/**
 * Timeline Slider - Control para mostrar la evolución de Dorothy
 */
class TimelineSlider {
  constructor(selector = '.timeline-section') {
    // Elementos principales
    this.container = document.querySelector(selector);
    if (!this.container) return;
    
    // Navegación
    this.prevBtn = this.container.querySelector('.timeline-prev');
    this.nextBtn = this.container.querySelector('.timeline-next');
    
    // Slides
    this.slides = Array.from(this.container.querySelectorAll('.timeline-slide'));
    this.totalSlides = this.slides.length;
    
    // Marcadores
    this.markers = Array.from(this.container.querySelectorAll('.timeline-marker'));
    this.progressBar = this.container.querySelector('.timeline-progress-bar');
    
    // Estado inicial
    this.currentIndex = 0;
    this.isAnimating = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isMobile = window.innerWidth < 768;
    
    // Inicialización
    this.init();
  }
  
  /**
   * Inicializa el slider
   */
  init() {
    // Configurar transiciones iniciales
    this.updateProgressBar();
    this.setupEventListeners();
    
    // Precargar imágenes para evitar saltos
    this.preloadImages();
    
    // Actualizaciones al redimensionar la ventana
    window.addEventListener('resize', this.debounce(() => {
      this.isMobile = window.innerWidth < 768;
    }, 150));
    
    // Habilitar animaciones después de cargar
    setTimeout(() => {
      this.container.classList.add('loaded');
    }, 100);
  }
  
  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Botones de navegación
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.goToSlide(this.currentIndex - 1));
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.goToSlide(this.currentIndex + 1));
    }
    
    // Marcadores de timeline
    this.markers.forEach((marker, index) => {
      marker.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Eventos de teclado
    document.addEventListener('keydown', (e) => {
      if (this.isElementInViewport(this.container)) {
        if (e.key === 'ArrowLeft') this.goToSlide(this.currentIndex - 1);
        if (e.key === 'ArrowRight') this.goToSlide(this.currentIndex + 1);
      }
    });
    
    // Eventos táctiles
    this.setupTouchEvents();
  }
  
  /**
   * Configurar eventos táctiles para dispositivos móviles
   */
  setupTouchEvents() {
    const slider = this.container.querySelector('.timeline-slider');
    
    slider.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }
  
  /**
   * Manejar el gesto de deslizamiento
   */
  handleSwipe() {
    // Umbral adaptativo basado en el ancho de la pantalla
    const threshold = this.isMobile ? 50 : 100;
    const swipeDiff = this.touchStartX - this.touchEndX;
    
    if (swipeDiff > threshold) {
      // Deslizamiento hacia la izquierda (siguiente)
      this.goToSlide(this.currentIndex + 1);
    } else if (swipeDiff < -threshold) {
      // Deslizamiento hacia la derecha (anterior)
      this.goToSlide(this.currentIndex - 1);
    }
  }
  
  /**
   * Va a la diapositiva especificada
   * @param {number} index - Índice de la diapositiva
   */
  goToSlide(index) {
    // Evitar animaciones múltiples simultáneas
    if (this.isAnimating) return;
    
    // Manejar límites (opcionalmente pueden ser cíclicos)
    if (index < 0) index = 0;
    if (index >= this.totalSlides) index = this.totalSlides - 1;
    
    // Si ya estamos en esta diapositiva
    if (index === this.currentIndex) return;
    
    this.isAnimating = true;
    
    // Determinar dirección
    const direction = index > this.currentIndex ? 'next' : 'prev';
    
    // Actualizar clases para animación
    this.slides.forEach((slide) => slide.classList.remove('active', 'prev'));
    this.markers.forEach((marker) => marker.classList.remove('active'));
    
    // Añadir clase 'prev' a la diapositiva actual antes de cambiar
    this.slides[this.currentIndex].classList.add('prev');
    
    // Actualizar índice actual y activar nueva diapositiva
    this.currentIndex = index;
    this.slides[this.currentIndex].classList.add('active');
    this.markers[this.currentIndex].classList.add('active');
    
    // Actualizar barra de progreso
    this.updateProgressBar();
    
    // Desbloquear animaciones después de la transición
    setTimeout(() => {
      this.isAnimating = false;
    }, 600); // Coincidir con la duración de la transición en CSS
  }
  
  /**
   * Actualiza la barra de progreso según la diapositiva actual
   */
  updateProgressBar() {
    if (!this.progressBar) return;
    
    const progressPercentage = (this.currentIndex / (this.totalSlides - 1)) * 100;
    this.progressBar.style.width = `${progressPercentage}%`;
  }
  
  /**
   * Precarga imágenes para evitar saltos durante las transiciones
   */
  preloadImages() {
    const imageElements = this.container.querySelectorAll('.card-image img');
    
    imageElements.forEach(img => {
      const image = new Image();
      image.src = img.src;
    });
  }
  
  /**
   * Comprueba si un elemento está visible en el viewport
   * @param {HTMLElement} element - Elemento a comprobar
   * @returns {boolean} - Verdadero si el elemento es visible
   */
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
  
  /**
   * Limita la frecuencia de ejecución de una función
   * @param {Function} func - Función a ejecutar
   * @param {number} wait - Tiempo de espera en ms
   * @returns {Function} - Función con debounce
   */
  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

// Inicializar todo cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
    // Inicializar animación de texto
    setupTextAnimation();
    
    // Inicializar posiciones de versiones si existen
    if (document.querySelectorAll("#Vers li").length > 0) {
        inicializarPosicionesVers();
        moverVersiones();
    }
    
    // Efectos de aparición si existen elementos con la clase fade-in
    const mainElements = document.querySelectorAll('.fade-in');
    mainElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 200 * index);
    });
    
    // Inicializar el slider original si existe
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
    
    // Inicializar el nuevo slider de timeline si existe
    if (document.querySelector('.timeline-section')) {
        const timelineSlider = new TimelineSlider();
    }
});

window.addEventListener('resize', () => {
    // Solo inicializar posiciones de versiones si existen
    if (document.querySelectorAll("#Vers li").length > 0) {
        inicializarPosicionesVers();
    }
});