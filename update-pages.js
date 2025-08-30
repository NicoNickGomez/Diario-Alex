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
        jsContador: './js/contador-tiempo.js'
    },
    'pages/deportes.html': {
        css: '../css/styles.css',
        jsMain: '../js/main.js',
        jsContador: '../js/contador-tiempo.js'
    },
    'pages/la-columna-del-peluche.html': {
        css: '../css/styles.css',
        jsMain: '../js/main.js',
        jsContador: '../js/contador-tiempo.js'
    }
};

// Función para verificar si un archivo tiene Font Awesome
function hasFontAwesome(content) {
    return content.includes('font-awesome') || content.includes('fontawesome') || 
           content.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome');
}

// Función para agregar Font Awesome a un archivo HTML
function addFontAwesomeToFile(filePath, config) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si ya tiene Font Awesome
        if (hasFontAwesome(content)) {
            console.log(`✓ ${filePath} ya tiene Font Awesome`);
            return;
        }
        
        // Buscar la línea de Google Fonts para insertar después
        const googleFontsRegex = /<link[^>]*fonts\.googleapis\.com[^>]*>/i;
        const match = content.match(googleFontsRegex);
        
        if (match) {
            const fontAwesomeLink = '\n    <!-- Font Awesome para iconos -->\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';
            content = content.replace(match[0], match[0] + fontAwesomeLink);
            
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

console.log('\nProceso completado. Verifica que todas las páginas tengan Font Awesome incluido.');
