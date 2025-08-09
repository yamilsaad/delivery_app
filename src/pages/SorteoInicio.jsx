import React from 'react';
import logo from '../assets/images/logo.png';

const SorteoInicio = ({ onNavigateToGanadores }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              {/* Logo oficial */}
              <div className="mb-3 sm:mb-4 flex justify-center">
                <img 
                  src={logo} 
                  alt="Logo Oficial" 
                  className="h-12 w-auto sm:h-16 object-contain"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                🏆 Sorteo del Gobierno
              </h1>
              <p className="text-white/90 text-base sm:text-lg">
                Sistema de Lotes - Posicionados
              </p>
              {/* Leyenda oficial */}
              <p className="text-white/80 text-xs sm:text-sm mt-1 sm:mt-2">
                <span className="font-bold">Dirección de TICs</span> - Subsecretaría de Innovación y Comunicación
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-[60vh] sm:min-h-[70vh] px-4 py-6 sm:py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-sm sm:max-w-2xl w-full text-center border border-white/20">
          {/* Logo o ícono */}
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-2xl sm:text-4xl">🏠</span>
            </div>
          </div>

          {/* Título principal */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Sistema de Lotes
          </h2>
          
          {/* Descripción */}
          <div className="mb-6 sm:mb-8">
            <p className="text-lg sm:text-xl text-white/90 mb-4">
              Consulta los posicionados del sorteo de lotes
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-white/80 text-sm sm:text-base">
              <div className="flex items-center space-x-2">
                <span className="text-orange-400 text-lg sm:text-xl">✓</span>
                <span>Resultados oficiales</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-400 text-lg sm:text-xl">✓</span>
                <span>Información actualizada</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-400 text-lg sm:text-xl">✓</span>
                <span>Datos verificados</span>
              </div>
            </div>
          </div>

          {/* Botón principal */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={onNavigateToGanadores}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg sm:text-xl min-h-[50px] sm:min-h-[60px] w-full sm:w-auto"
            >
              🏆 Ver Posicionados del Sorteo
            </button>
          </div>

          {/* Información adicional */}
          <div className="bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              📋 Información del Sorteo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-white/90 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-orange-400">🏠</span>
                <span>Lotes disponibles</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-400">👥</span>
                <span>Participantes registrados</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-400">📅</span>
                <span>Sorteo realizado</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-orange-400">✅</span>
                <span>Resultados oficiales</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md mt-auto">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="text-center text-white/80">
            <p className="text-xs sm:text-sm">
              © {new Date().getFullYear()} Sistema de Lotes - Gobierno. Todos los derechos reservados.
            </p>
            <p className="text-xs mt-1 sm:mt-2">
              Información oficial y verificada
            </p>
            <p className="text-xs mt-1 sm:mt-2">
              <span className="font-bold">Dirección de TICs</span> - Subsecretaría de Innovación y Comunicación
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SorteoInicio;
