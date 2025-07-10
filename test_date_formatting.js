// Prueba de formateo de fechas para el frontend
function testDateFormatting() {
    console.log('🧪 Probando formateo de fechas...');
    
    // Simular input datetime-local
    const datetimeLocal = '2025-07-25T18:30';
    console.log('📅 Input datetime-local:', datetimeLocal);
    
    // Función de formateo (igual a la del componente)
    const formatDateForAPI = (datetimeLocal) => {
        if (!datetimeLocal) return '';
        const date = new Date(datetimeLocal);
        return date.toISOString();
    };
    
    // Función de formateo inverso
    const formatDateFromAPI = (isoDatetime) => {
        if (!isoDatetime) return '';
        const date = new Date(isoDatetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    // Probar conversión
    const isoFormatted = formatDateForAPI(datetimeLocal);
    console.log('🔄 Convertido a ISO:', isoFormatted);
    
    const backToLocal = formatDateFromAPI(isoFormatted);
    console.log('🔙 De vuelta a local:', backToLocal);
    
    // Verificar que la conversión es correcta
    const isCorrect = backToLocal === datetimeLocal;
    console.log('✅ Conversión correcta:', isCorrect);
    
    return {
        original: datetimeLocal,
        iso: isoFormatted,
        backToLocal: backToLocal,
        isCorrect: isCorrect
    };
}

// Ejecutar prueba
const result = testDateFormatting();
console.log('📋 Resultado final:', result);
