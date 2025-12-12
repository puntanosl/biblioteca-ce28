// js/router.js
import { State } from './state.js';
import { Views } from './views.js';

export function router() {
    // 1. Verificar Autenticación
    const hash = location.hash || '#welcome';
    const noAuthRoutes = ['#welcome', '#login', '#register'];

    if (!State.currentUser && !noAuthRoutes.includes(hash)) {
        location.hash = '#welcome';
        return;
    }

    // 2. Elementos del DOM
    const main = document.getElementById('main-content');
    const nav = document.getElementById('bottom-nav');

    // Limpiar vista
    main.innerHTML = '';
    nav.classList.add('hidden'); // Ocultar por defecto

    // 3. Renderizar Vista según Hash
    switch (hash) {
        case '#welcome':
            Views.renderWelcome(main);
            break;
        case '#login':
            Views.renderLogin(main);
            break;
        case '#register':
            Views.renderRegister(main);
            break;
        case '#home':
            Views.renderHome(main);
            showNav(nav);
            break;
        case '#catalog':
            Views.renderCatalog(main);
            showNav(nav);
            break;
        case '#teacher-portal':
            Views.renderTeacherPortal(main);
            showNav(nav);
            break;
        case '#ia':
            Views.renderIA(main);
            showNav(nav);
            break;
        case '#ia/books':
            Views.renderIABooks(main);
            showNav(nav);
            break;
        case '#ia/activities':
            Views.renderIAActivities(main);
            showNav(nav);
            break;
        case '#chat':
            Views.renderInbox(main);
            showNav(nav);
            break;

        // Rutas Admin
        case '#admin/start':
            checkAdmin(() => Views.renderAdminHome(main));
            showNav(nav);
            break;
        case '#admin/users':
            checkAdmin(() => Views.renderAdminUsers(main));
            showNav(nav);
            break;
        case '#admin/teachers':
            checkAdmin(() => Views.renderAdminTeachers(main));
            showNav(nav);
            break;
        case '#admin/inventory':
            checkAdmin(() => Views.renderAdminInventory(main));
            showNav(nav);
            break;
        case '#admin/comms':
            checkAdmin(() => Views.renderAdminComms(main));
            showNav(nav);
            break;

        default:
            // Sub-rutas dinámicas
            if (hash.startsWith('#book/')) {
                const id = hash.split('/')[1];
                Views.renderBookDetail(main, id);
            } else {
                location.hash = '#home'; // Fallback
            }
            break;
    }

    // Renderizar iconos Lucide
    if (window.lucide) window.lucide.createIcons();
}

function checkAdmin(callback) {
    if (State.userProfile?.role === 'encargada') {
        callback();
    } else {
        alert('Acceso Denegado');
        location.hash = '#home';
    }
}

function showNav(nav) {
    nav.classList.remove('hidden');
    nav.innerHTML = getNavHTML();
    if (window.lucide) window.lucide.createIcons();
}

function getNavHTML() {
    const role = State.userProfile?.role;
    // Iconos simples para la barra
    return `
        <button class="nav-item ${location.hash.includes('home') ? 'active' : ''}" onclick="location.hash='#home'">
            <i data-lucide="home"></i> Inicio
        </button>
        ${role === 'encargada' ?
            `<button class="nav-item ${location.hash.includes('admin') ? 'active' : ''}" onclick="location.hash='#admin/start'">
                <i data-lucide="shield"></i> Admin
             </button>` :
            `<button class="nav-item ${location.hash.includes('portal') ? 'active' : ''}" onclick="location.hash='#teacher-portal'">
                <i data-lucide="book-open"></i> Actividades
             </button>`
        }
        <button class="nav-item ${location.hash.includes('ia') ? 'active' : ''}" onclick="location.hash='#ia'">
            <i data-lucide="brain-circuit"></i> IA
        </button>
        <button class="nav-item ${location.hash.includes('chat') ? 'active' : ''}" onclick="location.hash='#chat'">
            <i data-lucide="message-circle"></i> Chat
        </button>
    `;
}
