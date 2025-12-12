// js/app.js
import './firebase.js'; // ✅ IMPORT SOLO PARA EJECUTAR Y CREAR window.auth / window.db
import { State } from './state.js';
import { router } from './router.js';

// Exponer State globalmente para que funciones onclick en HTML funcionen
window.State = State;

async function initApp() {
  console.log("Iniciando App Modular...");

  // ✅ Chequeo: Firebase debe estar listo
  if (!window.auth || !window.db) {
    console.error("Firebase no está listo. Revisá que index.html cargue los SDK compat y que js/firebase.js setee window.auth y window.db");
    return;
  }

  const auth = window.auth;
  const db = window.db;

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

      State.initListeners();
      State.fetchActivities();

      router();
    } else {
      State.currentUser = null;
      State.userProfile = null;
      router();
    }

    if (loading) loading.classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
  });

  // 3. Router Listener
  window.addEventListener('hashchange', router);

  // 4. Update Listeners
  window.addEventListener('data-updated', (e) => {
    console.log('Datos actualizados:', e.detail);
    router();
  });
}

// Iniciar
window.onload = initApp;
