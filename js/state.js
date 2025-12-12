// js/state.js

export const State = {
  currentUser: null,
  userProfile: null,
  activities: [],

  initListeners() {
    console.log("Inicializando listeners de datos...");

    const db = window.db;
    if (!db || !this.currentUser) return;

    // Escuchar cambios en el perfil del usuario
    db.ref("users/" + this.currentUser.uid).on("value", (snap) => {
      if (snap.exists()) {
        this.userProfile = snap.val();
        window.dispatchEvent(
          new CustomEvent("data-updated", {
            detail: { type: "userProfile" },
          })
        );
      }
    });
  },

  async fetchActivities(filters = {}) {
    console.log("Buscando actividades...", filters);

    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(
        `/.netlify/functions/searchActivities?${params}`
      );
      const data = await res.json();

      if (data.ok) {
        this.activities = data.items;
        window.dispatchEvent(
          new CustomEvent("data-updated", {
            detail: { type: "activities" },
          })
        );
      }
    } catch (err) {
      console.error("Error al buscar actividades", err);
    }
  },

  logout() {
    const auth = window.auth;
    if (!auth) return;

    auth.signOut().then(() => {
      this.currentUser = null;
      this.userProfile = null;
      location.hash = "#/login";
    });
  },
};
