import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Función para exportar asistencias a PDF
export const exportAsistenciasToPDF = async (asistencias, searchTerm = '') => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Variables para el logo
  let logoY = 15;
  let logoHeight = 0;

  // Intentar cargar el logo
  try {
    const logoResponse = await fetch('/logo.png');
    if (logoResponse.ok) {
      const logoBlob = await logoResponse.blob();
      const logoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(logoBlob);
      });

      // Dimensiones del logo (manteniendo proporción aproximada)
      // Asumiendo que el logo es más ancho que alto (proporción típica de logos)
      const logoWidth = 30; // Ancho fijo pero más pequeño
      logoHeight = 40; // Alto proporcional para evitar estiramiento
      const logoX = (pageWidth - logoWidth) / 2;

      // Agregar el logo al PDF
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
    }
  } catch (error) {
    console.log('No se pudo cargar el logo, continuando sin logo:', error);
    logoHeight = 0;
  }

  // Título principal (ajustado según si hay logo o no)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Listado de Asistencias', pageWidth / 2, logoY + logoHeight + 15, { align: 'center' });

  // Subtítulo oficial
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Dirección de TICs - Subsecretaría de Innovación y Comunicación',
    pageWidth / 2,
    logoY + logoHeight + 25,
    { align: 'center' }
  );

  // Información del reporte
  doc.setFontSize(10);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, logoY + logoHeight + 40);
  doc.text(`Total de asistencias: ${asistencias.length}`, 20, logoY + logoHeight + 50);

  if (searchTerm) {
    doc.text(`Filtro aplicado: "${searchTerm}"`, 20, logoY + logoHeight + 60);
  }

  // Preparar datos para la tabla
  const tableData = asistencias.map((asistencia, index) => [
    index + 1,
    `${asistencia.nombre || ''} ${asistencia.apellido || ''}`.trim() || 'N/A',
    asistencia.dni || 'N/A',
    formatDateForPDF(asistencia.timestamp),
    asistencia.estado || 'Presente'
  ]);

  // Ajustar la posición de la tabla según si hay logo o no
  const tableStartY = logoY + logoHeight + 70;

  const tableConfig = {
    head: [['#', 'Nombre Completo', 'DNI', 'Fecha de Asistencia', 'Estado']],
    body: tableData,
    startY: tableStartY,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: 0,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
      4: { cellWidth: 25 },
    },
    theme: 'grid',
  };

  // Generar la tabla con la nueva sintaxis
  autoTable(doc, tableConfig);

  // Pie de página
  const finalY = doc.lastAutoTable?.finalY || tableStartY;
  doc.setFontSize(8);
  doc.text(
    'Dirección de TICs - Subsecretaría de Innovación y Comunicación',
    pageWidth / 2,
    finalY + 20,
    { align: 'center' }
  );
  doc.text(
    'Sistema oficial del gobierno para la gestión de lotes',
    pageWidth / 2,
    finalY + 25,
    { align: 'center' }
  );

  // Nombre del archivo
  const fileName = `asistencias_${new Date().toISOString().split('T')[0]}.pdf`;

  // Guardar el PDF
  doc.save(fileName);

  return fileName;
};

// Función para formatear fecha
const formatDateForPDF = (date) => {
  if (!date) return 'N/A';
  try {
    const fecha =
      typeof date.toDate === 'function'
        ? date.toDate()
        : new Date(date);

    if (isNaN(fecha.getTime())) return 'N/A';

    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'N/A';
  }
};

// Función para generar mensaje de WhatsApp
export const generateWhatsAppMessage = (asistencias, searchTerm = '') => {
  const totalAsistencias = asistencias.length;
  const participantesUnicos = new Set(asistencias.map(a => a.dni)).size;
  const fechaActual = new Date().toLocaleDateString('es-ES');

  let message = `REPORTE DE ASISTENCIAS - SISTEMA DE LOTES\n\n`;
  message += `Gobierno\n`;
  message += `Fecha: ${fechaActual}\n`;
  message += `Total Asistencias: ${totalAsistencias}\n`;
  message += `Participantes Únicos: ${participantesUnicos}\n\n`;

  if (searchTerm) {
    message += `Filtro aplicado: "${searchTerm}"\n\n`;
  }

  message += `LISTA DE ASISTENCIAS:\n\n`;

  const asistenciasToShow = asistencias.slice(0, 10);

  asistenciasToShow.forEach((asistencia, index) => {
    const nombre = `${asistencia.nombre || ''} ${asistencia.apellido || ''}`.trim() || 'N/A';
    const dni = asistencia.dni || 'N/A';
    const fecha = formatDateForPDF(asistencia.timestamp);

    message += `${index + 1}. ${nombre}\n`;
    message += `   DNI: ${dni}\n`;
    message += `   Fecha: ${fecha}\n\n`;
  });

  if (asistencias.length > 10) {
    message += `... y ${asistencias.length - 10} asistencias más\n\n`;
  }

  message += `ESTADÍSTICAS:\n`;
  message += `• Total de asistencias: ${totalAsistencias}\n`;
  message += `• Participantes únicos: ${participantesUnicos}\n`;
  message += `• Última asistencia: ${asistencias.length > 0 ? formatDateForPDF(asistencias[0].timestamp) : 'N/A'}\n\n`;

  message += `Dirección de TICs\n`;
  message += `Subsecretaría de Innovación y Comunicación\n`;
  message += `Sistema oficial del gobierno`;

  return message;
};

// Función para enviar por WhatsApp
export const sendToWhatsApp = (message) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = '5492645485330';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

// Función para generar y enviar reporte completo
export const generateAndSendReport = async (asistencias, searchTerm = '') => {
  const fileName = await exportAsistenciasToPDF(asistencias, searchTerm);
  const message = generateWhatsAppMessage(asistencias, searchTerm);

  const confirmMessage = `Reporte generado exitosamente!\n\nPDF: ${fileName}\n¿Deseas enviar el resumen por WhatsApp?`;

  if (confirm(confirmMessage)) {
    sendToWhatsApp(message);
  }

  return { fileName, message };
};

// Función para exportar posicionados por manzana y lote a PDF
export const exportPosicionadosToPDF = async (ganadoresAgrupados, searchTerm = '') => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Variables para el logo
  let logoY = 15;
  let logoHeight = 0;

  // Intentar cargar el logo
  try {
    const logoResponse = await fetch('/logo.png');
    if (logoResponse.ok) {
      const logoBlob = await logoResponse.blob();
      const logoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(logoBlob);
      });

      // Dimensiones del logo
      const logoWidth = 30;
      logoHeight = 40;
      const logoX = (pageWidth - logoWidth) / 2;

      // Agregar el logo al PDF
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
    }
  } catch (error) {
    console.log('No se pudo cargar el logo, continuando sin logo:', error);
    logoHeight = 0;
  }

  // Título principal
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Listado de Posicionados por Manzana y Lote', pageWidth / 2, logoY + logoHeight + 15, { align: 'center' });

  // Subtítulo oficial
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Dirección de TICs - Subsecretaría de Innovación y Comunicación',
    pageWidth / 2,
    logoY + logoHeight + 25,
    { align: 'center' }
  );

  // Información del reporte
  doc.setFontSize(10);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, logoY + logoHeight + 40);
  
  const totalPosicionados = Object.values(ganadoresAgrupados).flat().length;
  const totalManzanas = Object.keys(ganadoresAgrupados).length;
  
  doc.text(`Total de posicionados: ${totalPosicionados}`, 20, logoY + logoHeight + 50);
  doc.text(`Total de manzanas ocupadas: ${totalManzanas}`, 20, logoY + logoHeight + 60);

  if (searchTerm) {
    doc.text(`Filtro aplicado: "${searchTerm}"`, 20, logoY + logoHeight + 70);
  }

  // Preparar datos para la tabla
  const tableData = [];
  let contador = 1;

  // Ordenar manzanas numéricamente
  const manzanasOrdenadas = Object.keys(ganadoresAgrupados).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  manzanasOrdenadas.forEach(manzanaNombre => {
    const ganadores = ganadoresAgrupados[manzanaNombre];
    
    // Ordenar ganadores por fecha (más reciente primero)
    const ganadoresOrdenados = [...ganadores].sort((a, b) => {
      const fechaA = a.fechaSorteo?.toDate ? a.fechaSorteo.toDate() : new Date(a.fechaSorteo);
      const fechaB = b.fechaSorteo?.toDate ? b.fechaSorteo.toDate() : new Date(b.fechaSorteo);
      return fechaB - fechaA;
    });

    ganadoresOrdenados.forEach(ganador => {
      tableData.push([
        contador++,
        manzanaNombre,
        ganador.loteNombre || 'Sin lote',
        ganador.nombreCompleto || 'Sin nombre',
        ganador.dni_ganador || 'N/A',
        formatDateForPDF(ganador.fechaSorteo)
      ]);
    });
  });

  // Ajustar la posición de la tabla según si hay logo o no
  const tableStartY = logoY + logoHeight + (searchTerm ? 80 : 70);

  const tableConfig = {
    head: [['#', 'Manzana', 'Lote', 'Nombre Completo', 'DNI', 'Fecha de Sorteo']],
    body: tableData,
    startY: tableStartY,
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: 0,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 50 },
      4: { cellWidth: 30 },
      5: { cellWidth: 35 },
    },
    theme: 'grid',
  };

  // Generar la tabla
  autoTable(doc, tableConfig);

  // Pie de página
  const finalY = doc.lastAutoTable?.finalY || tableStartY;
  doc.setFontSize(8);
  doc.text(
    'Dirección de TICs - Subsecretaría de Innovación y Comunicación',
    pageWidth / 2,
    finalY + 20,
    { align: 'center' }
  );
  doc.text(
    'Sistema oficial del gobierno para la gestión de lotes',
    pageWidth / 2,
    finalY + 25,
    { align: 'center' }
  );

  // Nombre del archivo
  const fileName = `posicionados_por_manzana_${new Date().toISOString().split('T')[0]}.pdf`;

  // Guardar el PDF
  doc.save(fileName);

  return fileName;
};

// Función para generar mensaje de WhatsApp para posicionados
export const generatePosicionadosWhatsAppMessage = (ganadoresAgrupados, searchTerm = '') => {
  const totalPosicionados = Object.values(ganadoresAgrupados).flat().length;
  const totalManzanas = Object.keys(ganadoresAgrupados).length;
  const fechaActual = new Date().toLocaleDateString('es-ES');

  let message = `REPORTE DE POSICIONADOS POR MANZANA Y LOTE - SISTEMA DE LOTES\n\n`;
  message += `Gobierno\n`;
  message += `Fecha: ${fechaActual}\n`;
  message += `Total Posicionados: ${totalPosicionados}\n`;
  message += `Manzanas Ocupadas: ${totalManzanas}\n\n`;

  if (searchTerm) {
    message += `Filtro aplicado: "${searchTerm}"\n\n`;
  }

  message += `LISTA DE POSICIONADOS:\n\n`;

  // Ordenar manzanas numéricamente
  const manzanasOrdenadas = Object.keys(ganadoresAgrupados).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  let contador = 1;
  const posicionadosToShow = [];

  manzanasOrdenadas.forEach(manzanaNombre => {
    const ganadores = ganadoresAgrupados[manzanaNombre];
    
    // Ordenar ganadores por fecha (más reciente primero)
    const ganadoresOrdenados = [...ganadores].sort((a, b) => {
      const fechaA = a.fechaSorteo?.toDate ? a.fechaSorteo.toDate() : new Date(a.fechaSorteo);
      const fechaB = b.fechaSorteo?.toDate ? b.fechaSorteo.toDate() : new Date(b.fechaSorteo);
      return fechaB - fechaA;
    });

    ganadoresOrdenados.forEach(ganador => {
      posicionadosToShow.push({
        contador: contador++,
        manzana: manzanaNombre,
        lote: ganador.loteNombre || 'Sin lote',
        nombre: ganador.nombreCompleto || 'Sin nombre',
        dni: ganador.dni_ganador || 'N/A',
        fecha: formatDateForPDF(ganador.fechaSorteo)
      });
    });
  });

  // Mostrar solo los primeros 15 posicionados
  const posicionadosLimitados = posicionadosToShow.slice(0, 15);

  posicionadosLimitados.forEach((posicionado) => {
    message += `${posicionado.contador}. MANZANA ${posicionado.manzana} - LOTE ${posicionado.lote}\n`;
    message += `   ${posicionado.nombre}\n`;
    message += `   DNI: ${posicionado.dni}\n`;
    message += `   Fecha: ${posicionado.fecha}\n\n`;
  });

  if (posicionadosToShow.length > 15) {
    message += `... y ${posicionadosToShow.length - 15} posicionados más\n\n`;
  }

  message += `ESTADÍSTICAS:\n`;
  message += `• Total de posicionados: ${totalPosicionados}\n`;
  message += `• Manzanas ocupadas: ${totalManzanas}\n`;
  message += `• Manzanas vacías: ${Math.max(0, 20 - totalManzanas)}\n\n`;

  message += `Dirección de TICs\n`;
  message += `Subsecretaría de Innovación y Comunicación\n`;
  message += `Sistema oficial del gobierno`;

  return message;
};

// Función para generar y enviar reporte de posicionados
export const generateAndSendPosicionadosReport = async (ganadoresAgrupados, searchTerm = '') => {
  const fileName = await exportPosicionadosToPDF(ganadoresAgrupados, searchTerm);
  const message = generatePosicionadosWhatsAppMessage(ganadoresAgrupados, searchTerm);

  const confirmMessage = `Reporte de posicionados generado exitosamente!\n\nPDF: ${fileName}\n¿Deseas enviar el resumen por WhatsApp?`;

  if (confirm(confirmMessage)) {
    sendToWhatsApp(message);
  }

  return { fileName, message };
};
