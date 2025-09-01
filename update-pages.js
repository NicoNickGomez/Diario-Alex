const fs = require('fs');
const path = require('path');

// Configuración de rutas base
const basePath = './';

// Archivos HTML a procesar (completados con todas las páginas existentes)
const htmlFiles = [
    'index.html',
    'pages/deportes.html',
    'pages/la-columna-del-peluche.html',
    'pages/cultura.html',
    'pages/politica.html',
    'pages/tecnologia.html',
    'pages/nosotros.html'
];

// Función para calcular rutas dinámicamente (más eficiente que hardcoding)
function getPathConfig(file) {
    const isInPages = file.startsWith('pages/');
    const prefix = isInPages ? '../' : './';
    return {
        css: `${prefix}css/styles.css`,
        jsMain: `${prefix}js/main.js`,
        jsContador: `${prefix}js/contador-tiempo.js`
    };
}

// Función para verificar si un archivo tiene Font Awesome
function hasFontAwesome(content) {
    return content.includes('font-awesome') || content.includes('fontawesome') ||
           content.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome');
}

// Función para actualizar rutas y agregar Font Awesome (completada y eficiente)
function updateFile(filePath, config) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // Actualizar ruta del CSS si es necesario
        const cssRegex = /<link[^>]*rel="stylesheet"[^>]*href="[^"]*css\/styles\.css"[^>]*>/gi;
        const newCssLink = `<link rel="stylesheet" href="${config.css}">`;
        if (cssRegex.test(content)) {
            content = content.replace(cssRegex, newCssLink);
            updated = true;
        }

        // Actualizar ruta del JS main si es necesario
        const jsMainRegex = /<script[^>]*src="[^"]*js\/main\.js"[^>]*><\/script>/gi;
        const newJsMain = `<script src="${config.jsMain}"></script>`;
        if (jsMainRegex.test(content)) {
            content = content.replace(jsMainRegex, newJsMain);
            updated = true;
        }

        // Actualizar ruta del JS contador si es necesario
        const jsContadorRegex = /<script[^>]*src="[^"]*js\/contador-tiempo\.js"[^>]*><\/script>/gi;
        const newJsContador = `<script src="${config.jsContador}"></script>`;
        if (jsContadorRegex.test(content)) {
            content = content.replace(jsContadorRegex, newJsContador);
            updated = true;
        }

        // Agregar Font Awesome si no está presente
        if (!hasFontAwesome(content)) {
            const googleFontsRegex = /<link[^>]*fonts\.googleapis\.com[^>]*>/i;
            const match = content.match(googleFontsRegex);
            if (match) {
                const fontAwesomeLink = '\n    <!-- Font Awesome para iconos -->\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';
                content = content.replace(match[0], match[0] + fontAwesomeLink);
                updated = true;
                console.log(`✓ ${filePath} agregado Font Awesome`);
            } else {
                console.log(`⚠ ${filePath} no tiene Google Fonts, Font Awesome no agregado`);
            }
        } else {
            console.log(`✓ ${filePath} ya tiene Font Awesome`);
        }

        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ ${filePath} actualizado`);
        } else {
            console.log(`✓ ${filePath} ya está actualizado`);
        }
    } catch (error) {
        console.error(`✗ Error procesando ${filePath}:`, error.message);
    }
}

// Procesar todos los archivos
console.log('Iniciando actualización de páginas...\n');

htmlFiles.forEach(file => {
    const filePath = path.join(basePath, file);
    if (fs.existsSync(filePath)) {
        const config = getPathConfig(file);
        updateFile(filePath, config);
    } else {
        console.log(`✗ ${filePath} no existe`);
    }
});

console.log('\nProceso completado. Verifica que todas las páginas estén actualizadas.');
