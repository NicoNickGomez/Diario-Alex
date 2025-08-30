
/**
 * Archivo principal de lógica global del sitio.
 * No cargar otros scripts de navegación o modales.
 * Factor M - JavaScript Principal
 * Script unificado que maneja toda la funcionalidad del sitio
 * Incluye: carga de componentes, navegación móvil, modales y utilidades
 */

(function() {

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    loadHeaderAndFooter();
    initNavigation();
    initModals();
    initSmoothScroll();
    initArticleCards();
}

function loadComponent(placeholderId, filePath, callback) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = data;
                if (typeof callback === 'function') callback();
            }
        })
        .catch(err => console.error('Error cargando', filePath, err));
}

function loadHeaderAndFooter() {
    const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
    loadComponent('header-placeholder', basePath + 'header.html', function() {
        initNavigation();
        updateNavigationLinks(basePath);
    });
    loadComponent('footer-placeholder', basePath + 'footer.html');
}

function updateNavigationLinks(basePath) {
    const navLinks = document.querySelectorAll('#primary-navigation a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            // Si ya es una ruta relativa que empieza con "pages/", agregar el basePath
            if (href.startsWith('pages/')) {
                link.setAttribute('href', basePath + href);
            }
            // Si es "index.html", manejarlo según la ubicación
            else if (href === 'index.html') {
                link.setAttribute('href', basePath + href);
            }
        }
    });
}

function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', toggleMobileMenu);

        // Cerrar menú al hacer clic en enlaces
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });
    }
}

function toggleMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    if (!menuToggle || !primaryNav) return;

    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

    // Actualizar atributos ARIA para accesibilidad
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    primaryNav.setAttribute('aria-expanded', String(!isExpanded));
    primaryNav.setAttribute('aria-hidden', String(isExpanded));

    // Toggle clase para animación - usar las clases que ya existen en CSS
    if (isExpanded) {
        menuToggle.classList.remove('open');
    } else {
        menuToggle.classList.add('open');
        // Accesibilidad: mover foco al primer enlace del menú
        const firstLink = primaryNav.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }
    }
}

function closeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    
    if (menuToggle && primaryNav) {
        menuToggle.setAttribute('aria-expanded', 'false');
        primaryNav.setAttribute('aria-expanded', 'false');
        primaryNav.setAttribute('aria-hidden', 'true');
        menuToggle.classList.remove('open');
    }
}

function initModals() {
    let lastFocusedElement = null;

    // Función global para abrir modales
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        lastFocusedElement = document.activeElement;
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        
        // Enfocar el primer elemento enfocable del modal
        const focusableElement = modal.querySelector('.modal-content') || modal;
        focusableElement.focus();
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    };

    // Función global para cerrar modales
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        
        // Restaurar el foco
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
    };

    // Cerrar modal al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            window.closeModal(event.target.id);
        }
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="display: block"]');
            openModals.forEach(modal => {
                window.closeModal(modal.id);
            });
        }
    });
}

function initSmoothScroll() {
    // Smooth scroll para todos los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    e.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function initArticleCards() {
    document.querySelectorAll('.article-card, .featured-article').forEach(card => {
        card.addEventListener('click', function() {
            // En implementación real, navegaría al artículo completo
            console.log('Navegando al artículo...');
            // window.location.href = '/articulo/' + this.dataset.id;
        });
    });
}

})();


