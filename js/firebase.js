// js/firebase.js
// Usa Firebase compat cargado por <script> en index.html

const firebaseConfig = {
  apiKey: "AIzaSyDnbovgIl9X0jkAUWSgoDFt_Yk03SwHjYE",
  authDomain: "biblioteca-1621c.firebaseapp.com",
  projectId: "biblioteca-1621c",
  storageBucket: "biblioteca-1621c.appspot.com", // ✅ FIX ACÁ
  messagingSenderId: "703692855064",
  appId: "1:703692855064:web:1a01f02a3f42d2625eb06d",
  databaseURL: "https://biblioteca-1621c-default-rtdb.firebaseio.com"
};

// Inicializar Firebase si no existe
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Crear servicios
const auth = firebase.auth();
const db = firebase.database();       // Realtime Database
const dbFs = firebase.firestore();    // Firestore
const storage = firebase.storage();   // Storage
const provider = new firebase.auth.GoogleAuthProvider();

// ✅ Exponer en window (lo que tu app ahora espera)
window.auth = auth;
window.db = db;
window.dbFs = dbFs;
window.storage = storage;
window.provider = provider;

// (Opcional) exportar por si algún día querés volver a imports
export { auth, db, dbFs, storage, provider };

export function createSecondaryApp() {
  return firebase.initializeApp(firebaseConfig, "secondary");
}
