import React, { useState, useEffect } from 'react';
import { getAsistencias } from '../services/firestoreService';
import { exportAsistenciasToPDF, generateWhatsAppMessage, sendToWhatsApp } from '../services/exportService';
import logo from '../assets/images/logo.png';

const AdminAsistencias = ({ onBackToHome }) => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAsistencias, setFilteredAsistencias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [asistenciasPerPage] = useState(25);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchAsistencias = async () => {
    try {
      setRefreshing(true);
      const data = await getAsistencias();
      setAsistencias(data);
      setFilteredAsistencias(data);
      setCurrentPage(1);
    } catch (err) {
      setError('Error al cargar las asistencias');
      console.error(err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsistencias();
  }, []);

  useEffect(() => {
    const filtered = asistencias.filter(asistencia => 
      asistencia.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asistencia.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asistencia.dni?.includes(searchTerm) ||
      `${asistencia.nombre} ${asistencia.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAsistencias(filtered);
    setCurrentPage(1);
  }, [searchTerm, asistencias]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const fecha = date.toDate ? date.toDate() : new Date(date);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular índices para la paginación
  const indexOfLastAsistencia = currentPage * asistenciasPerPage;
  const indexOfFirstAsistencia = indexOfLastAsistencia - asistenciasPerPage;
  const currentAsistencias = filteredAsistencias.slice(indexOfFirstAsistencia, indexOfLastAsistencia);
  const totalPages = Math.ceil(filteredAsistencias.length / asistenciasPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para ir a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  // Función para ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // Función para exportar a PDF
  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const fileName = await exportAsistenciasToPDF(filteredAsistencias, searchTerm);
      console.log(`PDF exportado: ${fileName}`);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    } finally {
      setExporting(false);
    }
  };

  // Función para enviar por WhatsApp
  const handleSendWhatsApp = () => {
    try {
      const message = generateWhatsAppMessage(filteredAsistencias, searchTerm);
      sendToWhatsApp(message);
    } catch (error) {
      console.error('Error al enviar por WhatsApp:', error);
      alert('Error al enviar por WhatsApp. Por favor, intenta nuevamente.');
    }
  };

  // Función para exportar y enviar
  const handleExportAndSend = async () => {
    try {
      setExporting(true);
      
      // Exportar PDF
      const fileName = await exportAsistenciasToPDF(filteredAsistencias, searchTerm);
      
      // Generar mensaje de WhatsApp
      const message = generateWhatsAppMessage(filteredAsistencias, searchTerm);
      
      // Mostrar confirmación
      const confirmMessage = `✅ Reporte generado exitosamente!\n\n📄 PDF: ${fileName}\n📱 ¿Deseas enviar el resumen por WhatsApp?`;
      
      if (confirm(confirmMessage)) {
        sendToWhatsApp(message);
      }
      
    } catch (error) {
      console.error('Error en exportación y envío:', error);
      alert('Error al procesar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center mx-4">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-base sm:text-lg font-semibold text-gray-700">Cargando asistencias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center max-w-md mx-4">
          <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="text-white hover:text-orange-300 text-lg sm:text-xl font-semibold flex items-center space-x-2 transition-colors min-h-[44px] touch-manipulation"
            >
              <span>←</span>
              <span className="hidden sm:inline">Volver</span>
            </button>
            <div className="text-center flex-1">
              {/* Logo oficial */}
              <div className="mb-1 sm:mb-2 flex justify-center">
                <img 
                  src={logo} 
                  alt="Logo Oficial" 
                  className="h-8 w-auto sm:h-12 object-contain"
                />
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                📊 Panel de Administración
              </h1>
              <p className="text-white/80 text-xs mt-1">
                <span className="font-bold">Dirección de TICs</span> - Subsecretaría de Innovación y Comunicación
              </p>
            </div>
            <div className="w-12 sm:w-20"></div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        {/* Botones de acción */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                🔄 Actualizar Datos
              </h3>
              <p className="text-white/80 text-xs sm:text-sm">
                Haz clic para ver las nuevas asistencias registradas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={fetchAsistencias}
                disabled={refreshing}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                  refreshing
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg'
                }`}
              >
                {refreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Actualizando...</span>
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    <span>Actualizar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Botones de exportación */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-white font-semibold text-sm sm:text-base mb-3 text-center">
            📊 Exportar Reporte
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleExportPDF}
              disabled={exporting || filteredAsistencias.length === 0}
              className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                exporting || filteredAsistencias.length === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg'
              }`}
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <span>📄</span>
                  <span>Exportar PDF</span>
                </>
              )}
            </button>

            {/* Botón comentado: Enviar por WhatsApp
            <button
              onClick={handleSendWhatsApp}
              disabled={filteredAsistencias.length === 0}
              className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                filteredAsistencias.length === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
              }`}
            >
              <span>📱</span>
              <span>Enviar por WhatsApp</span>
            </button>
            */}

            {/* Botón comentado: PDF + WhatsApp
            <button
              onClick={handleExportAndSend}
              disabled={exporting || filteredAsistencias.length === 0}
              className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                exporting || filteredAsistencias.length === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg'
              }`}
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>PDF + WhatsApp</span>
                </>
              )}
            </button>
            */}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">📊 Estadísticas de Asistencia</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-white">{asistencias.length}</div>
              <div className="text-white/80 text-xs sm:text-sm">Total Asistencias</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-white">
                {new Set(asistencias.map(a => a.dni)).size}
              </div>
              <div className="text-white/80 text-xs sm:text-sm">Participantes Únicos</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-white">
                {asistencias.length > 0 ? formatDate(asistencias[0].timestamp).split(' ')[0] : 'N/A'}
              </div>
              <div className="text-white/80 text-xs sm:text-sm">Última Asistencia</div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-300 via-red-400 to-pink-400 rounded-lg p-[2px] animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-300 via-red-400 to-pink-400 rounded-lg opacity-90 blur-sm"></div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/95 text-gray-800 px-4 py-3 sm:py-4 rounded-lg pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:ring-offset-2 focus:ring-offset-blue-900/50 text-sm sm:text-base font-medium shadow-lg border-2 border-transparent transition-all duration-300 hover:bg-white/100 placeholder:text-gray-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <span className="text-orange-500 text-lg">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información de paginación */}
        {filteredAsistencias.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center text-white/90 text-sm">
              <div className="mb-2 sm:mb-0">
                Mostrando {indexOfFirstAsistencia + 1} - {Math.min(indexOfLastAsistencia, filteredAsistencias.length)} de {filteredAsistencias.length} asistencias
              </div>
              <div className="text-center">
                Página {currentPage} de {totalPages}
              </div>
            </div>
          </div>
        )}

        {/* Lista de asistencias */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">
            📋 Lista de Asistencias Registradas
          </h2>
          
          {filteredAsistencias.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-4xl sm:text-6xl mb-4">🔍</div>
              <p className="text-white text-base sm:text-lg">
                {searchTerm ? 'No se encontraron asistencias con esos criterios' : 'No hay asistencias registradas'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:gap-4">
                {currentAsistencias.map((asistencia, index) => (
                  <div
                    key={asistencia.id}
                    className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      {/* Información principal */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                            #{indexOfFirstAsistencia + index + 1}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-800">
                            {asistencia.nombre} {asistencia.apellido}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">DNI:</span>
                            <span>{asistencia.dni || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">Fecha:</span>
                            <span>{formatDate(asistencia.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Estado */}
                      <div className="mt-3 sm:mt-0 sm:ml-4 md:ml-6">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-2 sm:p-3 text-center">
                          <div className="text-xs sm:text-sm font-semibold">Estado</div>
                          <div className="text-sm sm:text-lg font-bold">
                            {asistencia.estado || 'Presente'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-6 sm:mt-8">
                  <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    {/* Botón anterior */}
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                        currentPage === 1
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      ← Anterior
                    </button>

                    {/* Números de página */}
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                      {getPageNumbers().map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-3 py-2 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                            currentPage === number
                              ? 'bg-orange-500 text-white'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                    </div>

                    {/* Botón siguiente */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                        currentPage === totalPages
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md mt-6 sm:mt-8">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="text-center text-white/80">
            <p className="text-xs">
              <span className="font-bold">Dirección de TICs</span> - Subsecretaría de Innovación y Comunicación
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminAsistencias;
