import React, { useState, useEffect } from 'react';
import { listenToGanadoresListaRealtime } from '../services/firestoreService';
import AsistenciaModal from '../components/AsistenciaModal';
import logo from '../assets/images/logo.png';

const Ganadores = ({ onBackToHome }) => {
  const [ganadores, setGanadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGanadores, setFilteredGanadores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [participantsPerPage] = useState(25);
  const [showAsistenciaModal, setShowAsistenciaModal] = useState(false);
  const [asistenciaRegistrada, setAsistenciaRegistrada] = useState(false);

  useEffect(() => {
    // Configurar listener en tiempo real
    const unsubscribe = listenToGanadoresListaRealtime((data) => {
      setGanadores(data);
      setFilteredGanadores(data);
      setCurrentPage(1); // Reset a la primera página al actualizar
      setLoading(false);
      setError(null);
    });

    // Mostrar modal de asistencia al cargar la página
    setShowAsistenciaModal(true);

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const filtered = ganadores.filter(ganador => 
      ganador.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ganador.dni_ganador?.includes(searchTerm) ||
      ganador.manzanaNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ganador.loteNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ganador.manzanaId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGanadores(filtered);
    setCurrentPage(1); // Reset a la primera página cuando se busca
  }, [searchTerm, ganadores]);

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
  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
  const currentParticipants = filteredGanadores.slice(indexOfFirstParticipant, indexOfLastParticipant);
  const totalPages = Math.ceil(filteredGanadores.length / participantsPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top cuando cambias de página
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
      // Mostrar todas las páginas si hay 5 o menos
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Mostrar páginas alrededor de la página actual
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

  const handleAsistenciaRegistrada = (participante) => {
    setAsistenciaRegistrada(true);
    // Opcional: mostrar un toast o notificación
    console.log('Asistencia registrada para:', participante.nombreCompleto);
  };

  const handleCloseAsistenciaModal = () => {
    setShowAsistenciaModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center mx-4">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-base sm:text-lg font-semibold text-gray-700">Cargando posicionados...</p>
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
      {/* Modal de Asistencia */}
      <AsistenciaModal
        isOpen={showAsistenciaModal}
        onClose={handleCloseAsistenciaModal}
        onAsistenciaRegistrada={handleAsistenciaRegistrada}
      />

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
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white flex items-center justify-center space-x-2">
                <span>🏆 Posicionados del Sorteo</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-xs font-normal">EN VIVO</span>
                </div>
              </h1>
              {/* Leyenda oficial */}
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
        {/* Información de actualización en tiempo real */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-2">
              ✅ Actualización en Tiempo Real
            </h3>
            <p className="text-white/80 text-xs sm:text-sm">
              Los datos se actualizan automáticamente cuando se agregan nuevos posicionados
            </p>
            <div className="mt-3 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs">Conectado en vivo</span>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">📊 Estadísticas</h2>
          <p className="text-white/70 text-xs mb-3">Actualizadas automáticamente en tiempo real</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-white">{ganadores.length}</div>
              <div className="text-white/80 text-xs sm:text-sm">Total Posicionados</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-white">
                {ganadores.filter(g => g.manzanaNombre).length}
              </div>
              <div className="text-white/80 text-xs sm:text-sm">Con Manzana</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-white">
                {ganadores.filter(g => g.loteNombre).length}
              </div>
              <div className="text-white/80 text-xs sm:text-sm">Con Lote</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-white">
                {new Set(ganadores.map(g => g.manzanaNombre).filter(Boolean)).size}
              </div>
              <div className="text-white/80 text-xs sm:text-sm">Manzanas</div>
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
                placeholder="Buscar por nombre, DNI, manzana o lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/95 text-gray-800 px-4 py-3 sm:py-4 rounded-lg pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:ring-offset-2 focus:ring-offset-blue-900/50 text-sm sm:text-base font-medium shadow-lg border-2 border-transparent transition-all duration-300 hover:bg-white/100 placeholder:text-gray-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500 text-lg">🔍</span>
                  {searchTerm && (
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      DNI
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Texto de ayuda */}
          <div className="mt-3 text-center">
            <p className="text-white/80 text-xs sm:text-sm">
              💡 <span className="font-semibold">Consejo:</span> Puedes buscar por tu <span className="font-bold text-orange-300">DNI</span>, nombre completo, manzana o lote
            </p>
          </div>
        </div>

        {/* Información de paginación */}
        {filteredGanadores.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center text-white/90 text-sm">
              <div className="mb-2 sm:mb-0">
                Mostrando {indexOfFirstParticipant + 1} - {Math.min(indexOfLastParticipant, filteredGanadores.length)} de {filteredGanadores.length} posicionados
              </div>
              <div className="text-center">
                Página {currentPage} de {totalPages}
              </div>
            </div>
          </div>
        )}

        {/* Lista de posicionados */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">
            🎯 Lista de Posicionados
          </h2>
          <div className="text-center mb-4">
            <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Conectado en tiempo real</span>
            </div>
          </div>
          
          {filteredGanadores.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-4xl sm:text-6xl mb-4">🔍</div>
              <p className="text-white text-base sm:text-lg">
                {searchTerm ? 'No se encontraron posicionados con esos criterios' : 'No hay posicionados registrados'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:gap-4">
                {currentParticipants.map((ganador, index) => (
                  <div
                    key={ganador.id}
                    className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      {/* Información principal */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                          <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                            #{indexOfFirstParticipant + index + 1}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-800">
                            {ganador.nombreCompleto || 'Sin nombre'}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">DNI:</span>
                            <span>{ganador.dni_ganador || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">Fecha:</span>
                            <span>{formatDate(ganador.fechaSorteo)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ubicación */}
                      <div className="mt-3 sm:mt-0 sm:ml-4 md:ml-6">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-2 sm:p-3 text-center">
                          <div className="text-xs sm:text-sm font-semibold">Ubicación</div>
                          <div className="text-sm sm:text-lg font-bold">
                            {ganador.manzanaNombre ? `Mz. ${ganador.manzanaNombre}` : 'N/A'}
                          </div>
                          <div className="text-sm sm:text-lg font-bold">
                            {ganador.loteNombre ? `Lote ${ganador.loteNombre}` : 'N/A'}
                          </div>
                          {ganador.manzanaId && (
                            <div className="text-xs opacity-80">
                              ID: {ganador.manzanaId}
                            </div>
                          )}
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
            <div className="mt-2 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-300">Página conectada en tiempo real</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Ganadores;
