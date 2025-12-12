// js/firebase.js

// Configuración de Firebase
// Se asume que los SDKs de Firebase (compat) ya están cargados en el HTML
const firebaseConfig = {
    apiKey: "AIzaSyDnbovgIl9X0jkAUWSgoDFt_Yk03SwHjYE",
    authDomain: "biblioteca-1621c.firebaseapp.com",
    projectId: "biblioteca-1621c",
    storageBucket: "biblioteca-1621c.appspot.com", // ✅ correcto
    messagingSenderId: "703692855064",
    appId: "1:703692855064:web:1a01f02a3f42d2625eb06d",
    databaseURL: "https://biblioteca-1621c-default-rtdb.firebaseio.com"
};

// Inicializar Firebase si no existe
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Servicios
const auth = firebase.auth();
const db = firebase.database();       // Realtime Database
const dbFs = firebase.firestore();    // Firestore
const storage = firebase.storage();   // Storage
const provider = new firebase.auth.GoogleAuthProvider();

// ✅ MUY IMPORTANTE: exponer globales (arregla "auth is not defined")
window.auth = auth;
window.db = db;
window.dbFs = dbFs;
window.storage = storage;
window.provider = provider;

// Exportar servicios (para uso como módulo)
export { auth, db, dbFs, storage, provider };

// Función auxiliar para "Secondary App" (crear usuarios sin desloguear)
export function createSecondaryApp() {
    return firebase.initializeApp(firebaseConfig, "secondary");
}
