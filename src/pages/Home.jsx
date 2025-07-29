import React from 'react'
import altairLogo from '../assets/images/altair-logo-transparente.png'

const Home = ({ onShowMenu }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B2D27] via-[#C89B3C] to-[#F8F2E7] flex items-center justify-center p-4">
      <div className="bg-[#F8F2E7] rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center transform hover:scale-105 transition-transform duration-300">
        {/* Logo de Altair Express grande */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <img 
            src={altairLogo} 
            alt="Altair Express Logo" 
            className="w-56 h-auto sm:w-64 object-contain drop-shadow-lg"
          />
        </div>
        <p className="text-lg sm:text-xl text-[#8B2D27] mb-6 sm:mb-8 font-bold">Comida Árabe</p>
        {/* Descripción */}
        <div className="mb-6 sm:mb-8">
          <p className="text-base sm:text-lg text-[#8B2D27] mb-4">
            Descubre los sabores auténticos de la cocina árabe
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-[#C89B3C]">
            <span>🍖 KUPI al Horno</span>
            <span>🥟 Sfihas</span>
            <span>🥬 Falafel</span>
          </div>
        </div>
        {/* Botón principal */}
        <button
          onClick={onShowMenu}
          className="w-full bg-gradient-to-r from-[#8B2D27] to-[#C89B3C] text-[#F4ECD8] font-semibold py-4 px-6 sm:px-8 rounded-lg hover:from-[#C89B3C] hover:to-[#8B2D27] transition-all duration-300 transform hover:scale-105 shadow-lg text-lg sm:text-xl min-h-[56px] touch-manipulation"
        >
          🍽️ Ver Menú
        </button>
        {/* Información adicional */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#C89B3C]/30">
          <div className="grid grid-cols-2 gap-4 text-sm text-[#8B2D27]">
            <div className="flex items-center justify-center space-x-2">
              <span>🚚</span>
              <span>Delivery</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>⏰</span>
              <span>Rápido</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 