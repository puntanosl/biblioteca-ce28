auth.onAuthStateChanged(async (user) => {
  const loading = document.getElementById('loading-overlay');

  try {
    if (user) {
      console.log("Usuario autenticado:", user.email);
      State.currentUser = user;

      // 🔥 IMPORTANTE: proteger RTDB
      let snap;
      try {
        snap = await db.ref('users/' + user.uid).once('value');
      } catch (e) {
        console.error("Fallo leyendo RTDB users/uid:", e);
        // Si esto falla, igual seguimos para no bloquear la app
        snap = null;
      }

      if (snap && snap.exists && snap.exists()) {
        State.userProfile = snap.val();

        if (user.email === 'cristianmescudero@sanluis.edu.ar' && State.userProfile.role !== 'encargada') {
          State.userProfile.role = 'encargada';
          try {
            await db.ref('users/' + user.uid).update({ role: 'encargada' });
          } catch (e) {
            console.error("Fallo actualizando role en RTDB:", e);
          }
        }
      } else {
        const profile = {
          name: user.displayName || 'Usuario',
          email: user.email,
          role: 'guest',
          avatar: user.photoURL || 'https://placehold.co/100/ccc/000?text=U'
        };

        try {
          await db.ref('users/' + user.uid).set(profile);
        } catch (e) {
          console.error("Fallo creando perfil en RTDB:", e);
        }

        State.userProfile = profile;
      }

      // Listeners + fetch, pero sin bloquear UI si fallan
      try { State.initListeners(); } catch (e) { console.error("State.initListeners fallo:", e); }
      try { await State.fetchActivities(); } catch (e) { console.error("State.fetchActivities fallo:", e); }

      try { router(); } catch (e) { console.error("router fallo:", e); }

    } else {
      State.currentUser = null;
      State.userProfile = null;
      try { router(); } catch (e) { console.error("router fallo:", e); }
    }

  } catch (err) {
    console.error("ERROR GENERAL en onAuthStateChanged:", err);

  } finally {
    // ✅ SIEMPRE se ejecuta, pase lo que pase
    if (loading) loading.classList.add('hidden');
    document.getElementById('app')?.classList.remove('hidden');
  }
});
