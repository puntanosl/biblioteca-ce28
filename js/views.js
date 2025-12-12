// js/views.js
import { UI } from './ui.js';
// State se asume global (window.State) para los onclicks, o se importa para lectura.
import { State } from './state.js';

export const Views = {
    renderWelcome(el) {
        el.innerHTML = `
            <div style="text-align:center; padding-top: 5vh;">
                <img src="https://placehold.co/140x140/00f3ff/020617?text=CLOUD" style="border-radius:50%; box-shadow:0 0 40px var(--color-accent-glow); margin-bottom:1.5rem;">
                <h1 style="font-size:2rem; margin-bottom:0.5rem; line-height:1.2;">BIBLIOTECA<br>Dr. René Favaloro</h1>
                <p style="opacity:0.8;">Sistema Conectado (V9)</p>

                <div style="margin-top: 1.5rem; display:flex; flex-direction:column; gap:10px;">
                    <button class="btn btn-google" onclick="State.loginGoogle()"><i data-lucide="mail"></i> Continuar con Google</button>
                    <button class="btn btn-primary" onclick="location.hash='#ia'"><i data-lucide="brain-circuit"></i> Consulta IA (Invitado)</button>

                    <hr style="border-color:rgba(255,255,255,0.1); width:100%; margin: 10px 0;">
                    <p style="font-size:0.8rem; margin:0;">Opciones Avanzadas</p>

                    <button class="btn btn-secondary" style="background:rgba(255,191,0,0.1); color:#ffbf00; border-color:#ffbf00;" onclick="location.hash='#login'">🔒 SOLO DOCENTES</button>
                    <button class="btn btn-secondary" onclick="location.hash='#login'">📧 Alumnos / Padres</button>
                    <button class="btn btn-secondary" style="font-size:0.8rem; padding:0.5rem;" onclick="location.hash='#login'">🛡️ Administradores</button>
                </div>
            </div>
        `;
    },

    showWelcomeModal(user, pass) {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="card" style="max-width:400px; text-align:center; border:2px solid var(--color-success);">
                <i data-lucide="check-circle" style="width:60px; height:60px; color:var(--color-success); margin-bottom:1rem;"></i>
                <h2>¡BIENVENIDO/A!</h2>
                <p>Registro exitoso.</p>
                <div style="background:rgba(255,255,255,0.1); padding:1rem; border-radius:12px; margin:1rem 0; text-align:left;">
                    <p><b>Usuario:</b> ${user}</p>
                    <p><b>Contraseña:</b> ${pass}</p>
                </div>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);
        lucide.createIcons();
    },

    renderLogin(el) {
        el.innerHTML = `
            ${UI.header('Acceder')}
            ${UI.btnBack()}
            <div class="card">
                <button class="btn btn-google" onclick="State.loginGoogle()" style="margin-bottom:1.5rem;"><i data-lucide="mail"></i> Google</button>
                <hr style="border-color:rgba(255,255,255,0.1); margin-bottom:1.5rem;">
                <form onsubmit="event.preventDefault(); State.login(this.email.value, this.pass.value)">
                    ${UI.input('email', 'Email', 'email')}
                    ${UI.input('pass', 'Contraseña', 'password')}
                    <button class="btn btn-primary">Entrar</button>
                    <p style="text-align:center; margin-top:1rem; font-size:0.9rem;">
                        ¿No tienes cuenta? <a href="#register">Regístrate aquí</a>
                    </p>
                </form>
            </div>
        `;
    },

    renderRegister(el) {
        el.innerHTML = `
            ${UI.header('Crear Cuenta')}
            ${UI.btnBack()}
            <div class="card">
                 <form onsubmit="event.preventDefault(); State.register(this.n.value, this.e.value, this.p.value, 'padre', this.g.value, this.d.value).then(() => Views.showWelcomeModal(this.e.value, this.p.value))">
                    ${UI.input('n', 'Nombre Completo')}
                    ${UI.input('e', 'Email', 'email')}
                    ${UI.input('p', 'Contraseña', 'password')}
                    <label class="input-label">Grado del Alumno</label>
                    <select name="g" class="select" style="margin-bottom:10px"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>
                     <label class="input-label">División</label>
                    <select name="d" class="select" style="margin-bottom:10px"><option>A</option><option>B</option></select>
                    <button class="btn btn-primary">Registrar</button>
                 </form>
            </div>
        `;
    },

    renderHome(el) {
        const p = State.userProfile;
        const role = p.role;
        el.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                <div>
                    <h2 style="margin:0;">Hola, ${p.name.split(' ')[0]} 👋</h2>
                    <small style="opacity:0.7; text-transform:capitalize;">${role}</small>
                </div>
                <button class="btn btn-secondary" onclick="State.logout()" style="width:auto; padding:0.5rem; font-size:0.8rem;">Salir</button>
            </div>

            ${State.notifications.length > 0 ? `
                <div class="card" style="border-left:4px solid var(--color-accent);">
                    <div style="display:flex; justify-content:space-between;">
                        <h4>📢 Notificación</h4>
                        <small>${State.notifications[0].date || 'Hoy'}</small>
                    </div>
                    <p style="margin-top:5px;">${State.notifications[0].text}</p>
                </div>
            ` : ''}

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                <div class="card" onclick="location.hash='#catalog'" style="text-align:center; padding:1.5rem 1rem;">
                    <i data-lucide="book" style="width:40px; height:40px; color:cyan; margin-bottom:10px;"></i>
                    <h4>Catálogo</h4>
                </div>
                <div class="card" onclick="location.hash='#ia'" style="text-align:center; padding:1.5rem 1rem; border-color:var(--color-accent);">
                    <i data-lucide="brain-circuit" style="width:40px; height:40px; color:#c084fc; margin-bottom:10px;"></i>
                    <h4>Consultar IA</h4>
                </div>
                <div class="card" onclick="location.hash='#teacher-portal'" style="text-align:center; padding:1.5rem 1rem;">
                    <i data-lucide="file-text" style="width:40px; height:40px; color:#00ff9d; margin-bottom:10px;"></i>
                    <h4>Actividades</h4>
                </div>
                <div class="card" onclick="location.hash='#chat'" style="text-align:center; padding:1.5rem 1rem;">
                    <i data-lucide="message-circle" style="width:40px; height:40px; color:white; margin-bottom:10px;"></i>
                    <h4>Consultas</h4>
                </div>
                ${role === 'encargada' ? `
                <div class="card" onclick="location.hash='#admin/start'" style="text-align:center; padding:1.5rem 1rem; border:1px solid var(--color-warning);">
                    <i data-lucide="shield" style="width:40px; height:40px; color:var(--color-warning); margin-bottom:10px;"></i>
                    <h4 style="color:var(--color-warning)">Admin</h4>
                </div>
                ` : ''}
            </div>
        `;
    },

    renderCatalog(el) {
        const renderList = (list) => {
            return list.map(b => `
                <div class="card" onclick="location.hash='#book/${b.id}'" style="display:flex; gap:15px; align-items:center;">
                    <div style="width:60px; height:80px; background:#1e293b; border-radius:8px; display:flex; align-items:center; justify-content:center;">
                        <i data-lucide="book" style="opacity:0.5;"></i>
                    </div>
                    <div>
                        <h4 style="margin:0;">${b.title}</h4>
                        <p style="margin:0; font-size:0.9rem; opacity:0.7;">${b.author}</p>
                        ${b.available ? '<span class="badge badge-success">Disponible</span>' : '<span class="badge" style="background:#334155;">Prestado</span>'}
                    </div>
                </div>
            `).join('');
        };

        el.innerHTML = `
            ${UI.header('Catálogo de Libros')}
            ${UI.btnBack()}
            <div style="margin-bottom:1rem;">
                <input class="input" placeholder="Buscar..." onkeyup="
                    const term = this.value.toLowerCase();
                    const filtered = State.books.filter(b => b.title.toLowerCase().includes(term));
                    document.getElementById('b-list').innerHTML = '${renderList(State.books)}'.replace(/State.books/g, 'filtered'); 
                    // Nota: Hack simple para string. Mejor usar funcion externa.
                    // Para simplificar views.js, usaremos un evento global o redibujado.
                "> 
            </div>
            <div id="b-list">
                ${State.books.length === 0 ? '<p>Cargando...</p>' : renderList(State.books)}
            </div>
        `;
        // Pequeño fix para búsqueda inline: Re-render completo es mejor
        const input = el.querySelector('input');
        input.onkeyup = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = State.books.filter(b => b.title.toLowerCase().includes(term));
            el.querySelector('#b-list').innerHTML = renderList(filtered);
            lucide.createIcons();
        }
    },

    renderBookDetail(el, id) {
        const b = State.books.find(x => x.id === id);
        if (!b) { el.innerHTML = '<p>Libro no encontrado</p>' + UI.btnBack(); return; }
        el.innerHTML = `
            ${UI.header(b.title)}
            ${UI.btnBack()}
            <div class="card" style="text-align:center;">
                <div style="width:120px; height:160px; background:#1e293b; border-radius:12px; margin:0 auto 1.5rem; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
                    <i data-lucide="book" style="width:50px; height:50px; color:cyan;"></i>
                </div>
                <h3>${b.title}</h3>
                <p style="color:cyan;">${b.author}</p>
                <hr style="border-color:rgba(255,255,255,0.1); margin:1rem 0;">
                <p>${b.description || 'Sin descripción.'}</p>
                <div style="margin-top:1.5rem;">
                     ${b.available ? `<button class="btn btn-primary" onclick="alert('Solicita en mostrador')">📚 Solicitar</button>` : `<button class="btn btn-secondary" disabled>No Disponible</button>`}
                </div>
            </div>
        `;
    },

    renderTeacherPortal(el) {
        const isAdmin = State.userProfile.role === 'encargada';
        el.innerHTML = `
            ${UI.header('Actividades', 'Nube')}
            
            <div class="tab-group">
                <button class="tab ${State.filters.level === 'Primaria' ? 'active' : ''}" onclick="State.setFilter('level','Primaria')">Primaria</button>
                <button class="tab ${State.filters.level === 'Secundaria' ? 'active' : ''}" onclick="State.setFilter('level','Secundaria')">Secundaria</button>
            </div>
            
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <select id="sel-grade" class="select" onchange="State.setFilter('grade', this.value)">
                    ${[1, 2, 3, 4, 5, 6].map(g => `<option value="${g}" ${State.filters.grade == g ? 'selected' : ''}>${g}°</option>`).join('')}
                </select>
                <select id="sel-div" class="select" onchange="State.setFilter('division', this.value)">
                    <option ${State.filters.division == 'A' ? 'selected' : ''}>A</option>
                    <option ${State.filters.division == 'B' ? 'selected' : ''}>B</option>
                </select>
            </div>

            <div class="card">
                <h4>Subir (Docente)</h4>
                 <input type="file" id="f-upload" class="input" multiple>
                 <button class="btn btn-teacher" onclick="State.uploadActivityBatch(document.getElementById('f-upload').files)">Subir a Nube</button>
            </div>
            
            <div id="activities-list">
            ${State.activities.map(a => `
                 <div class="card" style="padding:0.8rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; gap:5px; align-items:center;">
                            <i data-lucide="file-text" style="width:16px;"></i> <b>${a.title}</b>
                        </div>
                    </div>
                    <div style="display:flex; gap:5px;">
                        <a href="${a.fileUrl}" target="_blank" class="btn btn-secondary" style="width:auto; padding:5px 10px;"><i data-lucide="eye"></i></a>
                        ${isAdmin ? `<button class="btn btn-danger" style="width:auto; padding:5px 10px;" onclick="State.deleteActivity('${a.id}','${a.storagePath}')"><i data-lucide="trash-2"></i></button>` : ''}
                    </div>
                </div>
            `).join('')}
            </div>
        `;
    },

    renderAdminHome(el) {
        el.innerHTML = `
            ${UI.header('Panel Admin ☁️')}
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                 <div class="card" onclick="location.hash='#admin/inventory'">
                    <i data-lucide="library" style="color:#00f3ff; margin-bottom:5px;"></i>
                    <h4>Bibliotecario</h4>
                </div>
                 <div class="card" onclick="location.hash='#admin/teachers'">
                    <i data-lucide="users" style="color:orange; margin-bottom:5px;"></i>
                    <h4>Docentes</h4>
                </div>
                 <div class="card" onclick="location.hash='#admin/comms'"><h4>📢 Comms</h4></div>
                 <div class="card" onclick="location.hash='#teacher-portal'"><h4>📂 Archivos</h4></div>
                 <div class="card" onclick="location.hash='#admin/users'" style="border-color:var(--color-warning);">
                    <h4>👥 Admins</h4>
                 </div>
            </div>
        `;
    },

    renderAdminUsers(el) {
        // Matriz de Roles
        const isSuper = State.currentUser?.email?.toLowerCase() === 'cristianmescudero@sanluis.edu.ar';
        if (!isSuper) {
            el.innerHTML = UI.alert('danger', '⛔ Acceso Exclusivo Super Admin');
            return;
        }

        firebase.database().ref('users').once('value').then(snap => {
            const users = snap.val() || {};
            const list = Object.keys(users).map(k => ({ uid: k, ...users[k] }));

            el.innerHTML = `
                ${UI.header('Matriz de Roles')}
                ${UI.btnBack()}
                
                <div class="card" style="border:1px solid var(--color-warning);">
                    <h4>Agregar Admin</h4>
                    <form onsubmit="event.preventDefault(); State.createAdmin(this.em.value).then(()=>Views.showWelcomeModal(this.em.value,'Admin123'))" style="display:flex; gap:10px; margin-top:10px;">
                        <input name="em" class="input" placeholder="Email" required>
                        <button class="btn btn-primary">Crear</button>
                    </form>
                </div>

                <div class="card">
                    <h4>Usuarios (${list.length})</h4>
                    <div style="overflow-x:auto;">
                        <table style="width:100%; font-size:0.85rem;">
                            ${list.map(u => `
                                <tr style="border-bottom:1px solid #333;">
                                    <td style="padding:8px;">
                                        <b>${u.name}</b><br><small>${u.email}</small>
                                    </td>
                                    <td style="padding:8px;">
                                        <span class="badge" style="background:${State.getRoleColor(u.role)}">${u.role || 'guest'}</span>
                                    </td>
                                    <td style="padding:8px;">
                                        <select onchange="State.updateUserRole('${u.uid}', this.value)" style="padding:5px; border-radius:5px;">
                                            <option value="">Rol...</option>
                                            <option value="admin">Admin</option>
                                            <option value="bibliotecario">Bibliotecario</option>
                                            <option value="docente">Docente</option>
                                            <option value="alumno">Alumno</option>
                                        </select>
                                    </td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                </div>
            `;
        });
        el.innerHTML = UI.spinner();
    },

    renderAdminTeachers(el) {
        el.innerHTML = `
            ${UI.header('Gestión Docentes')}
            ${UI.btnBack()}
            <div class="card">
                <h4>Carga Manual</h4>
                <form onsubmit="event.preventDefault(); State.register(this.n.value, this.e.value, 'Docente123', 'docente').then(()=>alert('Docente creado'))">
                    ${UI.input('n', 'Nombre')}
                    ${UI.input('e', 'Email', 'email')}
                    <button class="btn btn-teacher">Registrar</button>
                </form>
            </div>
            <div class="card" style="border-top:2px solid orange;">
                <h4>Carga CSV</h4>
                <textarea id="csv-data" class="textarea" rows="4" placeholder="email,nombre,grado,division"></textarea>
                <button class="btn btn-primary" onclick="State.addTeacherBatch(document.getElementById('csv-data').value)">Procesar</button>
            </div>
        `;
    },

    renderAdminInventory(el) {
        el.innerHTML = `
            ${UI.header('Inventario')}
            ${UI.btnBack()}
            <div class="card">
                <h4>Nuevo Libro</h4>
                <form onsubmit="event.preventDefault(); State.addBook(this.code.value, this.t.value, this.a.value)">
                    ${UI.input('code', 'ISBN / Código')}
                    ${UI.input('t', 'Título')}
                    ${UI.input('a', 'Autor')}
                    <button class="btn btn-primary">Guardar</button>
                </form>
            </div>
        `;
    },

    renderAdminComms(el) {
        el.innerHTML = `
            ${UI.header('Comunicación')}
             <div class="card">
                <select id="comms-lvl" class="select"><option>Primaria</option><option>Secundaria</option></select>
                <select id="comms-grade" class="select"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>
                <select id="comms-div" class="select"><option>A</option><option>B</option></select>
                <textarea id="comms-msg" class="textarea" placeholder="Mensaje..."></textarea>
                <button class="btn btn-primary" onclick="State.sendBroadcast(
                    document.getElementById('comms-lvl').value,
                    document.getElementById('comms-grade').value,
                    document.getElementById('comms-div').value,
                    document.getElementById('comms-msg').value
                )">Enviar</button>
            </div>
        `;
    },

    renderIA(el) {
        el.innerHTML = `
            ${UI.header('Asistente IA 🤖')}
            ${UI.btnBack()}
            <div class="card" style="text-align:center; padding:2rem 1rem;">
                <p>¿Qué necesitas hoy?</p>
                <button class="btn btn-primary" onclick="location.hash='#ia/books'" style="margin-bottom:1rem; padding:1.5rem;">
                    <i data-lucide="book" style="width:30px; height:30px;"></i><br>
                    Buscar Libros
                </button>
                <button class="btn btn-secondary" onclick="location.hash='#ia/activities'" style="padding:1.5rem; background:rgba(0,243,255,0.1); border:1px solid var(--color-accent);">
                    <i data-lucide="globe" style="width:30px; height:30px;"></i><br>
                    Buscar Actividades
                </button>
            </div>
        `;
    },

    renderIABooks(el) {
        el.innerHTML = `
            ${UI.header('Buscador de Libros')}
            <button onclick="location.hash='#ia'" class="btn btn-secondary">Volver</button>
            
            <div class="card">
                <input class="input" placeholder="Ej: El Principito, Matemática..." onkeyup="
                    const term = this.value;
                    const res = State.searchBooks(term);
                    const list = document.getElementById('ia-book-list');
                    if(term.length < 2) { list.innerHTML = '<p>Escribe para buscar...</p>'; return; }
                    
                    if(res.length === 0) {
                        list.innerHTML = '<p>No encontré libros con ese nombre.</p>';
                    } else {
                        list.innerHTML = res.map(b => \`
                            <div class='card' style='margin-bottom:10px; border-left:3px solid cyan;'>
                                <b>\${b.title}</b><br>
                                <small>\${b.author}</small><br>
                                \${b.available ? '<span class=badge style=background:green>Disponible</span>' : '<span class=badge>Prestado</span>'}
                            </div>
                        \`).join('');
                    }
                ">
            </div>
            <div id="ia-book-list" style="padding-bottom:100px;"></div>
        `;
    },

    renderIAActivities(el) {
        el.innerHTML = `
            ${UI.header('Actividades Online', 'Liveworksheets / ArbolABC')}
            <button onclick="location.hash='#ia'" class="btn btn-secondary">Volver</button>

            <div class="card">
                <form onsubmit="
                    event.preventDefault();
                    const btn = this.querySelector('button');
                    const list = document.getElementById('ia-web-list');
                    const term = this.t.value;
                    const sub = this.s.value;
                    const grade = this.g.value;

                    if(!term) return;

                    btn.disabled = true;
                    btn.innerHTML = '<i class=spin data-lucide=loader-2></i> Buscando...';
                    lucide.createIcons();
                    list.innerHTML = '';

                    State.searchActivitiesExternal(term, sub, grade)
                        .then(results => {
                            btn.disabled = false;
                            btn.innerText = 'Buscar Actividades';
                            
                            if(results.length === 0) {
                                list.innerHTML = '<div class=card>No encontramos resultados. Probá con una palabra más simple (ej: fracciones).</div>';
                                return;
                            }

                            list.innerHTML = results.map(r => \`
                                <div class='card' style='margin-bottom:15px; border:1px solid \${r.source=='liveworksheets'?'#ff8c00':'#00bfff'};'>
                                    <div style='display:flex; justify-content:space-between;'>
                                        <small style='color:\${r.source=='liveworksheets'?'#ff8c00':'#00bfff'}; text-transform:uppercase;'>\${r.source}</small>
                                        <i data-lucide='external-link' style='width:16px;'></i>
                                    </div>
                                    <h4 style='margin:10px 0;'>\${r.title}</h4>
                                    <a href='\${r.link}' target='_blank' class='btn btn-primary' style='font-size:0.9rem;'>Abrir Actividad</a>
                                    <p style='font-size:0.75rem; opacity:0.6; margin-top:10px; text-align:center;'>
                                        ⚠️ Este recurso se abrirá en un sitio web externo.<br>
                                        La Biblioteca no es responsable del contenido.
                                    </p>
                                </div>
                            \`).join('');
                            lucide.createIcons();
                        })
                        .catch(err => {
                            btn.disabled = false;
                            btn.innerText = 'Buscar';
                            list.innerHTML = '<div class=card style=border-color:red>Error: ' + err.message + '</div>';
                        });
                ">
                    <label class="input-label">Materia</label>
                    <select name="s" class="select" style="margin-bottom:10px;">
                        <option>Matemática</option>
                        <option>Lengua / Prácticas del Lenguaje</option>
                        <option>Ciencias Naturales</option>
                        <option>Ciencias Sociales</option>
                        <option>Inglés</option>
                        <option>Tecnología</option>
                    </select>

                    <label class="input-label">Grado</label>
                    <select name="g" class="select" style="margin-bottom:10px;">
                        <option value="1">1° Grado</option>
                        <option value="2">2° Grado</option>
                        <option value="3">3° Grado</option>
                        <option value="4">4° Grado</option>
                        <option value="5">5° Grado</option>
                        <option value="6">6° Grado</option>
                    </select>

                    <label class="input-label">Tema</label>
                    <input name="t" class="input" placeholder="Ej: fracciones, verbo, plantas..." required style="margin-bottom:15px;">

                    <button class="btn btn-primary">Buscar Actividades</button>
                </form>
            </div>
            
            <div id="ia-web-list" style="padding-bottom:100px;"></div>
        `;
    },

    renderInbox(el) {
        el.innerHTML = `
            ${UI.header('Chat Global')}
             <div style="height:50vh; overflow-y:auto; margin-bottom:10px; background:rgba(255,255,255,0.95); border-radius:12px; padding:15px; color:#333;">
                ${State.messages.map(m => `<div><b>${m.userName}:</b> ${m.text}</div>`).join('')}
            </div>
            <form style="display:flex; gap:10px;" onsubmit="event.preventDefault(); State.sendMessage(this.t.value); this.t.value='';">
                <input name="t" class="input" placeholder="Escribe...">
                <button class="btn btn-primary" style="width:auto;">Enviar</button>
            </form>
         `;
    }
};
