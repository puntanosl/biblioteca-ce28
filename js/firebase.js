// js/firebase.js

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDnbovgIl9X0jkAUWSgoDFt_Yk03SwHjYE",
  authDomain: "biblioteca-1621c.firebaseapp.com",
  projectId: "biblioteca-1621c",
  storageBucket: "biblioteca-1621c.appspot.com", // ✅ CORRECTO
  messagingSenderId: "703692855064",
  appId: "1:703692855064:web:1a01f02a3f42d2625eb06d",
  databaseURL: "https://biblioteca-1621c-default-rtdb.firebaseio.com"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exponer servicios en window (IMPORTANTE)
window.auth = firebase.auth();
window.db = firebase.database();
window.dbFs = firebase.firestore();
window.storage = firebase.storage();
window.provider = new firebase.auth.GoogleAuthProvider();
