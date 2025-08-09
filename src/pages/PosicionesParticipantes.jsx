import React, { useState, useEffect } from 'react';
import { listenToGanadoresRealtime } from '../services/firestoreService';
import { 
  exportPosicionadosToPDF, 
  generatePosicionadosWhatsAppMessage, 
  generateAndSendPosicionadosReport 
} from '../services/exportService';
import logo from '../assets/images/logo.png';

const PosicionesParticipantes = ({ onBackToHome }) => {
  const [ganadoresAgrupados, setGanadoresAgrupados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let unsubscribe;

    const setupRealtimeListener = () => {
      try {
        unsubscribe = listenToGanadoresRealtime((ganadoresAgrupados) => {
          setGanadoresAgrupados(ganadoresAgrupados);
          setLoading(false);
        });
      } catch (err) {
        setError('Error al conectar con la base de datos');
        setLoading(false);
        console.error(err);
      }
    };

    setupRealtimeListener();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const fecha = date.toDate ? date.toDate() : new Date(date);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generar las manzanas dinámicamente desde los datos
  const generarManzanas = () => {
    const manzanasOrdenadas = Object.keys(ganadoresAgrupados).sort((a, b) => {
      // Extraer solo los dígitos de la cadena de la manzana para ordenar numéricamente
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });

    return manzanasOrdenadas.map(nombreManzana => ({
      nombre: nombreManzana,
      ganadores: ganadoresAgrupados[nombreManzana] || []
    }));
  };

  // Encontrar el último ganador global
  const encontrarUltimoGanador = () => {
    let ultimoGanador = null;
    let ultimaFechaSorteo = null;

    Object.values(ganadoresAgrupados).forEach(ganadores => {
      ganadores.forEach(ganador => {
        const fechaSorteo = ganador.fechaSorteo?.toDate ? ganador.fechaSorteo.toDate() : new Date(ganador.fechaSorteo);
        if (!ultimoGanador || fechaSorteo > ultimaFechaSorteo) {
          ultimoGanador = ganador;
          ultimaFechaSorteo = fechaSorteo;
        }
      });
    });

    return ultimoGanador;
  };

  // Funciones de exportación
  const handleExportPDF = async () => {
    try {
      setExporting(true);
      await exportPosicionadosToPDF(ganadoresAgrupados);
      setExporting(false);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      setExporting(false);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      setExporting(true);
      const message = generatePosicionadosWhatsAppMessage(ganadoresAgrupados);
      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = '5492645485330';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      setExporting(false);
    } catch (error) {
      console.error('Error al enviar por WhatsApp:', error);
      setExporting(false);
      alert('Error al enviar por WhatsApp. Por favor, intenta nuevamente.');
    }
  };

  const handleExportAndSend = async () => {
    try {
      setExporting(true);
      await generateAndSendPosicionadosReport(ganadoresAgrupados);
      setExporting(false);
    } catch (error) {
      console.error('Error al exportar y enviar:', error);
      setExporting(false);
      alert('Error al generar y enviar el reporte. Por favor, intenta nuevamente.');
    }
  };

  const manzanas = generarManzanas();
  const ultimoGanador = encontrarUltimoGanador();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center mx-4">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-base sm:text-lg font-semibold text-gray-700">Cargando posiciones...</p>
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

  if (manzanas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center mx-4">
          <div className="text-4xl sm:text-6xl mb-4">🏠</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Sin Posiciones</h2>
          <p className="text-gray-700 mb-6">
            Aún no hay participantes posicionados para mostrar.
          </p>
          <button
            onClick={onBackToHome}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Posiciones de Participantes
                </h1>
                <p className="text-white/80 text-sm">
                  Vista en tiempo real de las manzanas con participantes
                </p>
              </div>
            </div>
            <button
              onClick={onBackToHome}
              className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm font-semibold"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* Estadísticas */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold text-white mb-3 text-center">📊 Estadísticas Generales</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">
                {Object.values(ganadoresAgrupados).flat().length}
              </div>
              <div className="text-white/80 text-sm">Total Posicionados</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">
                {manzanas.length}
              </div>
              <div className="text-white/80 text-sm">Manzanas Ocupadas</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">
                {Math.max(0, 20 - manzanas.length)}
              </div>
              <div className="text-white/80 text-sm">Manzanas Vacías</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">20</div>
              <div className="text-white/80 text-sm">Total Manzanas</div>
            </div>
          </div>
        </div>

        {/* Botones de Exportación */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6">
          <h3 className="text-lg font-bold text-white mb-3 text-center">📄 Exportar Reporte</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                exporting
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
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

            <button
              onClick={handleSendWhatsApp}
              disabled={exporting}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                exporting
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <span>📱</span>
                  <span>Enviar por WhatsApp</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportAndSend}
              disabled={exporting}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                exporting
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>📊</span>
                  <span>PDF + WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grid de Manzanas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {manzanas.map((manzana, index) => (
            <div
              key={manzana.nombre}
              className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ring-2 ring-green-400"
            >
              {/* Header de la manzana */}
              <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  MANZANA: {manzana.nombre}
                </h3>
                <div className="flex justify-center items-center space-x-2 mt-1">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {manzana.ganadores.length} {manzana.ganadores.length === 1 ? 'participante' : 'participantes'}
                  </span>
                </div>
              </div>

              {/* Lista de participantes */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {manzana.ganadores.length > 0 ? (
                  // Ordenar ganadores por fecha (más reciente primero)
                  [...manzana.ganadores]
                    .sort((a, b) => {
                      const fechaA = a.fechaSorteo?.toDate ? a.fechaSorteo.toDate() : new Date(a.fechaSorteo);
                      const fechaB = b.fechaSorteo?.toDate ? b.fechaSorteo.toDate() : new Date(b.fechaSorteo);
                      return fechaB - fechaA;
                    })
                    .map((ganador, ganadorIndex) => {
                      const isLastWinner = ganadorIndex === 0;
                      return (
                        <div
                          key={ganador.id}
                          className={`rounded-lg p-2 border ${
                            isLastWinner 
                              ? 'bg-green-200 border-green-300' 
                              : 'bg-gradient-to-r from-blue-50 to-orange-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-semibold ${
                              isLastWinner ? 'text-green-800' : 'text-blue-800'
                            }`}>
                              LOTE {ganador.loteNombre || 'Sin lote'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(ganador.fechaSorteo)}
                            </span>
                          </div>
                          <div className={`font-medium truncate ${
                            isLastWinner ? 'text-green-900 font-bold' : 'text-gray-800'
                          }`}>
                            {ganador.nombreCompleto || 'Sin nombre'}
                          </div>
                          <div className={`text-xs ${
                            isLastWinner ? 'text-green-700 font-bold' : 'text-gray-600'
                          }`}>
                            DNI: {ganador.dni_ganador || 'N/A'}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-4">
                    <div className="text-2xl mb-2">🏠</div>
                    <p className="text-gray-500 text-sm">Sin participantes asignados</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
          <p className="text-white/80 text-sm">
            💡 Esta vista se actualiza automáticamente en tiempo real cuando se sortean nuevos participantes
          </p>
        </div>
      </div>

      {/* Footer con último ganador */}
      {ultimoGanador && (
        <div className="fixed bottom-0 left-0 right-0 bg-green-500 text-white p-4 shadow-lg">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
            <span className="font-bold text-sm sm:text-base">
              ¡ÚLTIMO POSICIONADO!
            </span>
            <span className="text-sm sm:text-base">
              MANZANA {ultimoGanador.manzanaNombre}, LOTE {ultimoGanador.loteNombre}
            </span>
            <span className="font-bold text-sm sm:text-base">
              {ultimoGanador.nombreCompleto}
            </span>
            <span className="font-bold text-sm sm:text-base">
              DNI: {ultimoGanador.dni_ganador}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosicionesParticipantes;
