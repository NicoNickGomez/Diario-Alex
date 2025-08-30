const fs = require('fs');
const path = require('path');

// Configuración de rutas base
const basePath = './';
const pagesPath = './pages/';

// Archivos HTML a procesar
const htmlFiles = [
    'index.html',
    'pages/deportes.html',
    'pages/la-columna-del-peluche.html',
    // Agregar más páginas aquí según sea necesario
];

// Configuración de rutas para cada archivo
const pathConfig = {
    'index.html': {
        css: './css/styles.css',
        jsMain: './js/main.js',
        jsContador: './js/contador-tiempo.js',
        jsTheme: './js/theme.js'
    },
    'pages/deportes.html': {
        css: '../css/styles.css',
        jsMain: '../js/main.js',
        jsContador: '../js/contador-tiempo.js',
        jsTheme: '../js/theme.js'
    },
    'pages/la-columna-del-peluche.html': {
        css: '../css/styles.css',
        jsMain: '../js/main.js',
        jsContador: '../js/contador-tiempo.js',
        jsTheme: '../js/theme.js'
    }
};

// Función para agregar Font Awesome a un archivo HTML
function addFontAwesomeToFile(filePath, config) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si ya tiene Font Awesome
        if (content.includes('font-awesome') || content.includes('fontawesome')) {
            console.log(`✓ ${filePath} ya tiene Font Awesome`);
            return;
        }
        
        // Buscar la línea de Google Fonts para insertar después
        const googleFontsRegex = /<link[^>]*fonts\.googleapis\.com[^>]*>/i;
        const match = content.match(googleFontsRegex);
        
        if (match) {
            const fontAwesomeLink = '\n    <!-- Font Awesome para iconos -->\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';
            content = content.replace(match[0], match[0] + fontAwesomeLink);
            
            // Asegurar que theme.js esté incluido
            if (!content.includes('theme.js')) {
                const scriptsRegex = /(<script[^>]*><\/script>\s*)+<\/body>/i;
                const themeScript = `\n    <script src="${config.jsTheme}"></script>\n</body>`;
                content = content.replace(/<\/body>/i, themeScript);
            }
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ ${filePath} actualizado con Font Awesome`);
        } else {
            console.log(`⚠ ${filePath} no tiene Google Fonts, revisar manualmente`);
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
        addFontAwesomeToFile(filePath, pathConfig[file]);
    } else {
        console.log(`✗ ${filePath} no existe`);
    }
});

console.log('\nProceso completado. Verifica que todas las páginas tengan Font Awesome y theme.js incluidos.');
