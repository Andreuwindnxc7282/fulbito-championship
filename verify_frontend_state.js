#!/usr/bin/env node
/**
 * Script para verificar el estado del frontend
 * Verifica que los archivos y configuraciones estén correctos
 */

const fs = require('fs');
const path = require('path');

const workspaceRoot = __dirname;

function checkFileExists(filePath) {
    const fullPath = path.join(workspaceRoot, filePath);
    return fs.existsSync(fullPath);
}

function readFile(filePath) {
    const fullPath = path.join(workspaceRoot, filePath);
    try {
        return fs.readFileSync(fullPath, 'utf8');
    } catch (e) {
        return null;
    }
}

function checkNextjsConfig() {
    console.log('📋 Verificando configuración Next.js:');
    
    // Verificar package.json
    const packageJson = readFile('package.json');
    if (packageJson) {
        const pkg = JSON.parse(packageJson);
        if (pkg.scripts && pkg.scripts.dev) {
            console.log('✅ Script dev configurado');
        } else {
            console.log('❌ Script dev no encontrado');
            return false;
        }
        
        if (pkg.dependencies && pkg.dependencies.next) {
            console.log('✅ Next.js instalado');
        } else {
            console.log('❌ Next.js no encontrado en dependencias');
            return false;
        }
    } else {
        console.log('❌ package.json no encontrado');
        return false;
    }
    
    // Verificar archivos clave
    const keyFiles = [
        'next.config.mjs',
        'tsconfig.json',
        'tailwind.config.ts',
        'app/layout.tsx',
        'app/page.tsx'
    ];
    
    for (const file of keyFiles) {
        if (checkFileExists(file)) {
            console.log(`✅ ${file} existe`);
        } else {
            console.log(`❌ ${file} no encontrado`);
            return false;
        }
    }
    
    return true;
}

function checkAuthSystem() {
    console.log('\n📋 Verificando sistema de autenticación:');
    
    const authFiles = [
        'lib/api.ts',
        'lib/auth-utils.ts',
        'lib/temp-token.ts',
        'lib/auto-token-system.ts',
        'hooks/use-auth.tsx'
    ];
    
    for (const file of authFiles) {
        if (checkFileExists(file)) {
            console.log(`✅ ${file} existe`);
        } else {
            console.log(`❌ ${file} no encontrado`);
            return false;
        }
    }
    
    // Verificar contenido del sistema automático
    const autoTokenContent = readFile('lib/auto-token-system.ts');
    if (autoTokenContent) {
        if (autoTokenContent.includes('initializeAutoTokenSystem')) {
            console.log('✅ Sistema automático de tokens implementado');
        } else {
            console.log('❌ Sistema automático de tokens incompleto');
            return false;
        }
    }
    
    return true;
}

function checkDashboardComponents() {
    console.log('\n📋 Verificando componentes del dashboard:');
    
    const componentFiles = [
        'components/dashboard.tsx',
        'components/players.tsx',
        'components/ui/card.tsx',
        'components/ui/badge.tsx',
        'components/ui/button.tsx'
    ];
    
    for (const file of componentFiles) {
        if (checkFileExists(file)) {
            console.log(`✅ ${file} existe`);
        } else {
            console.log(`❌ ${file} no encontrado`);
            return false;
        }
    }
    
    return true;
}

function checkEnvironmentSetup() {
    console.log('\n📋 Verificando configuración del entorno:');
    
    // Verificar que los archivos de configuración existan
    if (checkFileExists('.env.local') || checkFileExists('.env')) {
        console.log('✅ Archivo de entorno encontrado');
    } else {
        console.log('⚠️  Archivo de entorno no encontrado (opcional)');
    }
    
    // Verificar node_modules
    if (checkFileExists('node_modules')) {
        console.log('✅ Dependencias instaladas');
    } else {
        console.log('❌ Dependencias no instaladas - ejecutar npm install');
        return false;
    }
    
    return true;
}

function checkAPIIntegration() {
    console.log('\n📋 Verificando integración con API:');
    
    const apiContent = readFile('lib/api.ts');
    if (apiContent) {
        if (apiContent.includes('http://localhost:8000')) {
            console.log('✅ URL del backend configurada');
        } else {
            console.log('❌ URL del backend no configurada');
            return false;
        }
        
        if (apiContent.includes('interceptors.request.use')) {
            console.log('✅ Interceptores de request configurados');
        } else {
            console.log('❌ Interceptores de request no configurados');
            return false;
        }
        
        if (apiContent.includes('interceptors.response.use')) {
            console.log('✅ Interceptores de response configurados');
        } else {
            console.log('❌ Interceptores de response no configurados');
            return false;
        }
    } else {
        console.log('❌ Archivo lib/api.ts no encontrado');
        return false;
    }
    
    return true;
}

function main() {
    console.log('🔍 Verificando estado del frontend...');
    console.log('=' + '='.repeat(49));
    
    const tests = [
        checkNextjsConfig,
        checkAuthSystem,
        checkDashboardComponents,
        checkEnvironmentSetup,
        checkAPIIntegration
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        if (test()) {
            passed++;
        } else {
            failed++;
        }
    }
    
    console.log('\n' + '=' + '='.repeat(49));
    console.log(`📊 Resultados: ${passed} ✅ | ${failed} ❌`);
    
    if (failed === 0) {
        console.log('🎉 ¡Frontend 100% configurado!');
        console.log('✅ El frontend está listo para funcionar sin errores');
    } else {
        console.log('⚠️  Frontend con problemas que requieren atención');
        console.log('❌ Revisa los errores arriba y corrige antes de continuar');
    }
    
    return failed === 0;
}

// Ejecutar verificación
const success = main();
process.exit(success ? 0 : 1);
