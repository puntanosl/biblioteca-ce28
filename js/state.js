// js/state.js
import { auth, db, dbFs, storage, provider, createSecondaryApp } from './firebase.js';

/* 
 * State maneja toda la lógica de datos y estado de la aplicación.
 * Actúa como una combinación de "Store" y "Controller".
 */
export const State = {
    currentUser: null,
    userProfile: null,
    books: [],
    activities: [],
    notifications: [],
    messages: [],

    // Filtros para Portal Docente
    filters: { level: 'Primaria', grade: 1, division: 'A' },

    // Chat con API simulada
    iaChat: [],

    // ==========================================
    // 1. INICIALIZACIÓN Y LISTENERS
    // ==========================================
    initListeners() {
        // Sync Libros (RTDB Legacy)
        db.ref('books').on('value', snap => {
            const data = snap.val();
            this.books = data ? Object.keys(data).map(k => ({ id: k, ...data[k] })) : [];
            // Disparar evento de actualización si es necesario o dejar que Router/View refresque
            window.dispatchEvent(new CustomEvent('data-updated', { detail: 'books' }));
        });

        // Sync Notificaciones (RTDB)
        db.ref('notifications').limitToLast(20).on('value', snap => {
            const data = snap.val();
            this.notifications = data ? Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse() : [];
            window.dispatchEvent(new CustomEvent('data-updated', { detail: 'notifications' }));
        });

        // Sync Chat (RTDB)
        db.ref('chats').limitToLast(50).on('value', snap => {
            const data = snap.val();
            this.messages = data ? Object.keys(data).map(k => ({ id: k, ...data[k] })) : [];
            window.dispatchEvent(new CustomEvent('data-updated', { detail: 'chats' }));
        });
    },

    // ==========================================
    // 2. ACTIVIDADES (FIRESTORE)
    // ==========================================
    async fetchActivities() {
        try {
            const { level, grade, division } = this.filters;
            const snap = await dbFs.collection('activities')
                .where('level', '==', level)
                .where('grade', '==', parseInt(grade))
                .where('division', '==', division)
                .where('visibleToStudents', '==', true)
                .orderBy('createdAt', 'desc')
                .get();

            this.activities = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            window.dispatchEvent(new CustomEvent('data-updated', { detail: 'activities' }));
        } catch (err) {
            console.error("Error fetching activities:", err);
            this.activities = [];
            window.dispatchEvent(new CustomEvent('data-updated', { detail: 'activities' }));
        }
    },

    setFilter(key, val) {
        this.filters[key] = val;
        this.fetchActivities();
    },

    async uploadActivityBatch(files, updateProgressCallback) {
        if (!files.length) return alert('Selecciona al menos un archivo');
        const { level, grade, division } = this.filters;

        try {
            let count = 0;
            for (let file of files) {
                // 1. Subir a Storage
                const path = `activities/${level}/${grade}${division}/${Date.now()}_${file.name}`;
                const ref = storage.ref().child(path);

                // (Opcional) Podríamos reportar progreso aquí
                await ref.put(file);
                const url = await ref.getDownloadURL();

                // 2. Crear en Firestore
                await dbFs.collection('activities').add({
                    title: file.name,
                    description: 'Subido por docente',
                    fileUrl: url,
                    storagePath: path,
                    level: level,
                    grade: parseInt(grade),
                    division: division,
                    subject: 'General',
                    visibleToStudents: true,
                    createdBy: this.currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                count++;
            }
            alert(`¡Éxito! Se subieron ${count} actividades.`);
            this.fetchActivities();
        } catch (err) {
            alert('Error subiendo: ' + err.message);
        }
    },

    async deleteActivity(id, storagePath) {
        if (!confirm('¿Estás seguro de eliminar este archivo permanentemente?')) return;
        try {
            await dbFs.collection('activities').doc(id).delete();
            if (storagePath) await storage.ref().child(storagePath).delete();
            alert('Eliminado correctamente');
            this.fetchActivities();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    // ==========================================
    // 3. USUARIOS Y AUTH
    // ==========================================
    async login(email, password) {
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (err) {
            alert(err.message);
        }
    },

    async loginGoogle() {
        try {
            await auth.signInWithPopup(provider);
        } catch (err) {
            alert(err.message);
        }
    },

    logout() {
        auth.signOut();
    },

    async register(name, email, password, role, grade, division) {
        try {
            const cred = await auth.createUserWithEmailAndPassword(email, password);
            const avatar = `https://placehold.co/100/00f3ff/000?text=${name[0]}`;

            await db.ref('users/' + cred.user.uid).set({
                name, email, role,
                grade: grade || null,
                division: division || null,
                avatar
            });
            return true; // Éxito
        } catch (err) {
            alert(err.message);
            throw err;
        }
    },

    // Crear Admin (Secondary App)
    async createAdmin(email) {
        if (!email.includes('@')) return alert('Email inválido');
        if (!confirm(`¿Crear admin para ${email} con contraseña "Admin123"?`)) return;

        try {
            const tempApp = createSecondaryApp();
            const cred = await tempApp.auth().createUserWithEmailAndPassword(email, "Admin123");

            await db.ref('users/' + cred.user.uid).set({
                name: 'Admin Nuevo',
                email: email,
                role: 'encargada',
                forceReset: true,
                avatar: `https://placehold.co/100/ffbf00/000?text=A`
            });

            await tempApp.auth().signOut();
            tempApp.delete();
            return true;
        } catch (err) {
            alert('Error: ' + err.message);
            throw err;
        }
    },

    async changePassword(newPass) {
        if (newPass.length < 6) return alert('Mínimo 6 caracteres');
        try {
            await this.currentUser.updatePassword(newPass);
            await db.ref('users/' + this.currentUser.uid).update({ forceReset: null });
            this.userProfile.forceReset = null;
            alert('Contraseña actualizada correctamente.');
            location.hash = '#admin/start';
        } catch (e) {
            alert(e.message);
        }
    },

    async updateUserRole(uid, role) {
        if (!role) return;
        if (!confirm(`¿Asignar rol "${role}" al usuario?`)) return;

        try {
            // Update in RTDB
            await db.ref('users/' + uid).update({ role });
            // Update in Firestore
            try {
                await dbFs.collection('users').doc(uid).set({ role }, { merge: true });
            } catch (e) { console.log('Firestore user sync optional'); }

            alert('Rol actualizado');
            // Nota: La vista debería refrescarse sola o llamando a render
            window.dispatchEvent(new CustomEvent('refresh-admin-users'));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    // ==========================================
    // 4. OTROS (LIBROS, CHAT, IA)
    // ==========================================
    async addBook(isbn, title, author) {
        if (!title) return;
        const id = isbn || Date.now().toString();
        await db.ref('books/' + id).set({
            title, author,
            description: 'Ingresado por admin',
            available: true,
            isbn: isbn || ''
        });
        alert('Libro Agregado al Catálogo');
    },

    async sendBroadcast(level, grade, div, msg) {
        const target = `${level} ${grade} "${div}"`;
        if (!msg) return;
        await db.ref('notifications').push({
            text: msg, target,
            timestamp: new Date().toISOString(),
            by: this.userProfile.name
        });
        alert('Mensaje enviado a la nube ☁️');
        location.hash = '#admin/start';
    },

    async sendMessage(text) {
        if (!text.trim()) return;
        await db.ref('chats').push({
            text,
            sender: this.userProfile.role === 'encargada' ? 'admin' : 'user',
            userId: this.currentUser.uid,
            time: new Date().toISOString(),
            userName: this.userProfile.name
        });
    },

    async addTeacherBatch(csv) {
        const lines = csv.split('\n'); let count = 0;
        for (let line of lines) {
            const [email, name, grade, div] = line.split(',').map(s => s?.trim());
            if (email && email.includes('@')) {
                const safe = email.replace(/[.#$[\]]/g, '_');
                await db.ref('users_pre/' + safe).set({
                    email: email,
                    name: name || 'Docente',
                    role: 'docente',
                    grade: grade,
                    division: div || 'A',
                    preRegistered: true
                });
                count++;
            }
        }
        alert(`Pre-cargados ${count} docentes. Deben registrarse con el MISMO email.`);
    },

    askIA(question) {
        this.iaChat.push({ role: 'user', text: question });
        window.dispatchEvent(new CustomEvent('data-updated', { detail: 'ia' }));

        let answer = "¡Hola! Soy la IA de la Biblioteca.";
        const q = question.toLowerCase();
        if (q.includes('actividad') || q.includes('tarea'))
            answer = "Ve a la sección 'Actividades', selecciona tu Nivel, Grado y División.";
        else if (q.includes('subir') || q.includes('cargar'))
            answer = "Si eres docente, usa el botón 'Actividades', elige el curso y usa 'Subir Nueva'.";
        else if (q.includes('libro'))
            answer = "Busca en el 'Catálogo'. Puedes filtrar por título o autor.";
        else
            answer = "Intenta preguntar sobre: actividades, libros o cómo ingresar.";

        setTimeout(() => {
            this.iaChat.push({ role: 'bot', text: answer });
            window.dispatchEvent(new CustomEvent('data-updated', { detail: 'ia' }));
        }, 800);
    },

    getRoleColor(role) {
        switch (role) {
            case 'encargada': return 'var(--color-danger)';
            case 'admin': return 'var(--color-danger)';
            case 'bibliotecario': return 'var(--color-warning)';
            case 'docente': return 'var(--color-accent)';
            default: return '#555';
        }
    },

    // ==========================================
    // 5. MÓDULO ASISTENTE / IA (Búsqueda)
    // ==========================================

    // Filtro Local de Libros
    searchBooks(term) {
        if (!term) return [];
        term = term.toLowerCase();
        return this.books.filter(b =>
            b.title.toLowerCase().includes(term) ||
            b.author.toLowerCase().includes(term)
        );
    },

    // Búsqueda Externa (Serverless Netlify)
    async searchActivitiesExternal(term, subject, grade) {
        try {
            const response = await fetch('/.netlify/functions/searchActivities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ term, subject, grade })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Error en búsqueda');
            }

            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
