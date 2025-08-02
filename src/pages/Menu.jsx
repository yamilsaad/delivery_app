import React from 'react'
import MenuCard from '../components/MenuCard'
import { menuItems } from '../data/menu'

const Menu = ({ onAddToCart, onBackToHome }) => {
  return (
    <div className="min-h-screen bg-[#F8F2E7]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B2D27] to-[#C89B3C] shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="text-[#F4ECD8] hover:text-[#F4F0E5] text-lg sm:text-xl font-semibold flex items-center space-x-2 min-h-[44px] touch-manipulation"
            >
              <span>←</span>
              <span className="hidden sm:inline">Volver</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F4ECD8]">🍽️ Menú Altair Express</h1>
            <div className="w-16 sm:w-20"></div> {/* Espaciador */}
          </div>
        </div>
      </div>

      {/* Contenido del menú */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Introducción */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#8B2D27] mb-3 sm:mb-4">
            Nuestros Combos Especiales
          </h2>
          <p className="text-sm sm:text-base text-[#8B2D27] max-w-2xl mx-auto px-2">
            Descubre los sabores auténticos de la cocina árabe con nuestros combos 
            cuidadosamente preparados. Cada plato está hecho con ingredientes frescos 
            y especias tradicionales.
          </p>
        </div>

        {/* Grid de productos - 1 columna en móvil, 2 en desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {menuItems.map((item) => (
            <MenuCard 
              key={item.id} 
              item={item} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-[#F8F2E7] rounded-xl shadow-lg p-4 sm:p-6 max-w-2xl mx-auto border border-[#C89B3C]/20">
            <h3 className="text-lg sm:text-xl font-semibold text-[#8B2D27] mb-3 sm:mb-4">
              🌟 ¿Por qué elegir Altair Express?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-[#C89B3C]">
              <div className="flex items-center justify-center space-x-2">
                <span>👨‍🍳</span>
                <span>Chef experto</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🥬</span>
                <span>Ingredientes frescos</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🚚</span>
                <span>Delivery rápido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu