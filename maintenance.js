const fs = require('fs');
const path = require('path');

// Configuración
const config = {
    fontAwesomeUrl: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap',
    cssFiles: ['styles.css', 'base.css', 'header.css', 'components.css', 'theme.css'],
    jsFiles: ['main.js', 'contador-tiempo.js']
};

// Lista de páginas HTML
const htmlPages = [
    { path: 'index.html', basePath: './' },
    { path: 'pages/deportes.html', basePath: '../' },
    { path: 'pages/la-columna-del-peluche.html', basePath: '../' }
];

// Función para verificar si un archivo tiene Font Awesome
function hasFontAwesome(content) {
    return content.includes('font-awesome') || content.includes('fontawesome') || 
           content.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome');
}

// Función para agregar Font Awesome a un archivo HTML
function addFontAwesome(filePath, basePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (hasFontAwesome(content)) {
            console.log(`✓ ${filePath} ya tiene Font Awesome`);
            return true;
        }
        
        // Insertar Font Awesome después de Google Fonts
        const googleFontsRegex = /<link[^>]*fonts\.googleapis\.com[^>]*>/i;
        const match = content.match(googleFontsRegex);
        
        if (match) {
            const fontAwesomeLink = `\n    <!-- Font Awesome para iconos -->\n    <link rel="stylesheet" href="${config.fontAwesomeUrl}">`;
            content = content.replace(match[0], match[0] + fontAwesomeLink);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ ${filePath} actualizado con Font Awesome`);
            return true;
        } else {
            console.log(`⚠ ${filePath} no tiene Google Fonts, revisar manualmente`);
            return false;
        }
    } catch (error) {
        console.error(`✗ Error procesando ${filePath}:`, error.message);
        return false;
    }
}

// Función principal de mantenimiento
function runMaintenance() {
    console.log('🚀 Iniciando mantenimiento del sitio...\n');
    
    let fontAwesomeCount = 0;
    
    // Procesar cada página HTML
    htmlPages.forEach(page => {
        const fullPath = path.join(page.basePath, page.path);
        
        if (fs.existsSync(fullPath)) {
            console.log(`📄 Procesando: ${fullPath}`);
            
            if (addFontAwesome(fullPath, page.basePath)) fontAwesomeCount++;
            
            console.log(''); // Línea en blanco para separar
        } else {
            console.log(`✗ ${fullPath} no existe\n`);
        }
    });
    
    // Resumen
    console.log('📊 Resumen del mantenimiento:');
    console.log(`✅ Font Awesome agregado a ${fontAwesomeCount} de ${htmlPages.length} páginas`);
    console.log('\n🎯 Próximos pasos:');
    console.log('1. Verificar que todas las páginas carguen correctamente');
    console.log('2. Probar el botón de cambio de tema en cada página');
    console.log('3. Ajustar colores del modo oscuro según sea necesario');
}

// Ejecutar mantenimiento
runMaintenance();
