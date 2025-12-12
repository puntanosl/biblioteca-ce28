// js/firebase.js

// Configuración de Firebase
// Se asume que los SDKs de Firebase (compat) ya están cargados en el HTML
const firebaseConfig = {
    apiKey: "AIzaSyDnbovgIl9X0jkAUWSgoDFt_Yk03SwHjYE",
    authDomain: "biblioteca-1621c.firebaseapp.com",
    projectId: "biblioteca-1621c",
    storageBucket: "biblioteca-1621c.appspot.com", // ✅ ESTA ES LA LÍNEA CORREGIDA
    messagingSenderId: "703692855064",
    appId: "1:703692855064:web:1a01f02a3f42d2625eb06d",
    databaseURL: "https://biblioteca-1621c-default-rtdb.firebaseio.com"
};

// Inicializar Firebase si no existe
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Exportar servicios
export const auth = firebase.auth();
export const db = firebase.database();       // Realtime Database
export const dbFs = firebase.firestore();    // Firestore
export const storage = firebase.storage();   // Storage
export const provider = new firebase.auth.GoogleAuthProvider();

// Función auxiliar para "Secondary App" (crear usuarios sin desloguear)
export function createSecondaryApp() {
    return firebase.initializeApp(firebaseConfig, "secondary");
}
