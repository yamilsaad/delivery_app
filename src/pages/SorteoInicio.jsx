import React from 'react';
import logo from '../assets/images/logo.png';

const SorteoInicio = ({ onNavigateToGanadores, onNavigateToPosiciones, onNavigateToAdmin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="text-center">
            {/* Logo oficial */}
            <div className="mb-2 sm:mb-4 flex justify-center">
              <img 
                src={logo} 
                alt="Logo Oficial" 
                className="h-12 w-auto sm:h-20 object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
              🏆 Sistema de Lotes
            </h1>
            <p className="text-white/90 text-sm sm:text-base">
              <span className="font-bold">Dirección de TICs</span> - Subsecretaría de Innovación y Comunicación
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              🎯 Sorteo Oficial del Gobierno
            </h2>
            <p className="text-white/90 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed">
              Sistema oficial para la consulta de posicionados del sorteo de lotes. 
              Información verificada y actualizada de los participantes del sorteo.
            </p>
            
            {/* Características principales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="bg-white/20 rounded-xl p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-2">📊</div>
                <h3 className="font-bold text-white text-sm sm:text-base mb-2">Consulta en Tiempo Real</h3>
                <p className="text-white/80 text-xs sm:text-sm">Datos actualizados instantáneamente</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-2">🔍</div>
                <h3 className="font-bold text-white text-sm sm:text-base mb-2">Búsqueda Avanzada</h3>
                <p className="text-white/80 text-xs sm:text-sm">Busca por DNI, nombre o ubicación</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-2">📱</div>
                <h3 className="font-bold text-white text-sm sm:text-base mb-2">Acceso Móvil</h3>
                <p className="text-white/80 text-xs sm:text-sm">Optimizado para smartphones</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <button
                onClick={onNavigateToGanadores}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🏆 Ver Posicionados del Sorteo
              </button>
              
              <button
                onClick={onNavigateToPosiciones}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🏠 Ver Posiciones por Manzana
              </button>
              
              <button
                onClick={onNavigateToAdmin}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                📊 Ver Asistencia
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md mt-auto">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="text-center text-white/80">
            <p className="text-sm sm:text-base">
              <span className="font-bold">Dirección de TICs</span> - Subsecretaría de Innovación y Comunicación
            </p>
            <p className="text-xs sm:text-sm mt-2 opacity-75">
              Sistema oficial del gobierno para la gestión de lotes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SorteoInicio;
