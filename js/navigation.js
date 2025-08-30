/**
 * Script para manejar la navegación y modales en la página.
 * 
 * Espera a que el DOM esté completamente cargado antes de ejecutar.
 */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const expanded = primaryNav.getAttribute('aria-expanded') === 'true';
            primaryNav.setAttribute('aria-expanded', String(!expanded));
            primaryNav.setAttribute('aria-hidden', String(expanded));
            menuToggle.setAttribute('aria-expanded', String(!expanded));
            menuToggle.classList.toggle('open', !expanded);
            // Mueve el foco al primer enlace al abrir el menú
            if (!expanded) {
                const firstLink = primaryNav.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });

        // Cierra el menú con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && primaryNav.getAttribute('aria-expanded') === 'true') {
                primaryNav.setAttribute('aria-expanded', 'false');
                primaryNav.setAttribute('aria-hidden', 'true');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('open');
                menuToggle.focus();
            }
        });

        // Cierra el menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (
                primaryNav.getAttribute('aria-expanded') === 'true' &&
                !primaryNav.contains(e.target) &&
                !menuToggle.contains(e.target)
            ) {
                primaryNav.setAttribute('aria-expanded', 'false');
                primaryNav.setAttribute('aria-hidden', 'true');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('open');
            }
        });

        // Cierra el menú al hacer clic en un enlace (en móvil)
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    primaryNav.setAttribute('aria-expanded', 'false');
                    primaryNav.setAttribute('aria-hidden', 'true');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.classList.remove('open');
                }
            });
        });
    }

    // Desplazamiento suave para enlaces internos
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Funciones globales para modales (sin cambios)
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    };
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    };
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };
});
