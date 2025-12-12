// js/ui.js

export const UI = {
    // Encabezado estándar con título y subtítulo opcional
    header(title, subtitle) {
        return `
            <div style="margin-bottom:1.5rem;">
                <h1 style="font-size:1.8rem; color:#fff; text-shadow:0 0 15px rgba(0, 243, 255, 0.25);">${title}</h1>
                ${subtitle ? `<p style="color:var(--text-secondary);">${subtitle}</p>` : ''}
            </div>
        `;
    },

    // Input con etiqueta
    input(name, placeholder, type = 'text') {
        return `
            <div class="input-group">
                <label class="input-label">${placeholder}</label>
                <input name="${name}" class="input" type="${type}" required placeholder="${placeholder}">
            </div>
        `;
    },

    // Botón de Volver
    btnBack() {
        return `<button onclick="history.back()" class="btn btn-secondary">Volver</button>`;
    },

    // Spinner de carga
    spinner(text = 'Cargando...') {
        return `<p style="text-align:center; padding:20px;"><i data-lucide="loader-2" class="spin"></i> ${text}</p>`;
    },

    // Alerta / Banner simple
    alert(type, msg) {
        // type: 'danger', 'warning', 'info'
        let color = '#fff';
        if (type === 'danger') color = 'var(--color-error)';
        if (type === 'warning') color = 'var(--color-warning)';

        return `<div class="card" style="border:1px solid ${color}; color:${color}; padding:10px;">${msg}</div>`;
    }
};
