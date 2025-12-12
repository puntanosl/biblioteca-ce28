// js/app.js
import { auth, db } from './firebase.js';
import { State } from './state.js';
import { router } from './router.js';

// Exponer State globalmente para que funciones onclick en HTML funcionen
window.State = State;

async function initApp() {
    console.log("Iniciando App Modular...");

    // 1. Service Worker para PWA
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./service-worker.js');
            console.log('SW registrado');
        } catch (e) {
            console.error('SW fallo', e);
        }
    }

    // 2. Auth Listener
    auth.onAuthStateChanged(async (user) => {
        const loading = document.getElementById('loading-overlay');

        if (user) {
            // Usuario logueado
            console.log("Usuario autenticado:", user.email);
            State.currentUser = user;

            // Cargar Perfil de RTDB
            const snap = await db.ref('users/' + user.uid).once('value');
            if (snap.exists()) {
                State.userProfile = snap.val();

                // Super Admin Force Role
                if (user.email === 'cristianmescudero@sanluis.edu.ar' && State.userProfile.role !== 'encargada') {
                    State.userProfile.role = 'encargada';
                    db.ref('users/' + user.uid).update({ role: 'encargada' });
                }
            } else {
                // Registro si no existe
                const profile = {
                    name: user.displayName || 'Usuario',
                    email: user.email,
                    role: 'guest',
                    avatar: user.photoURL || 'https://placehold.co/100/ccc/000?text=U'
                };
                await db.ref('users/' + user.uid).set(profile);
                State.userProfile = profile;
            }

            // Iniciar Listeners de Datos en tiempo real
            State.initListeners();
            // Fetch inicial de actividades (por defecto)
            State.fetchActivities();

            // Check Force Reset
            if (State.userProfile.forceReset) {
                // TODO: Agregar vista force pass
            }

            router(); // Ir a home o donde determine el router
        } else {
            // No autenticado
            State.currentUser = null;
            State.userProfile = null;
            router(); // Irá a login/welcome
        }

        // Ocultar Loading
        if (loading) loading.classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    });

    // 3. Router Listener
    window.addEventListener('hashchange', router);

    // 4. Update Listeners (Custom Events desde State)
    window.addEventListener('data-updated', (e) => {
        // Simple re-render si estamos en la vista afectada
        const hash = location.hash;
        console.log('Datos actualizados:', e.detail);

        // Estrategia simple: re-ejecutar router para refrescar vista actual
        // En una app más compleja, Views.update() sería mejor.
        router();
    });
}

// Iniciar
window.onload = initApp;
