import React, { useState } from 'react'

const MenuCard = ({ item, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price)
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    onAddToCart(item)
    
    // Reset del estado después de la animación
    setTimeout(() => {
      setIsAdding(false)
    }, 300)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Imagen del plato */}
      <div className="relative">
        <div className="w-full h-32 sm:h-48 bg-gradient-to-br from-orange-100 to-red-100 rounded-t-xl flex items-center justify-center">
          <span className="text-4xl sm:text-6xl">{item.image}</span>
        </div>
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-orange-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
          {formatPrice(item.price)}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4">{item.description}</p>
        
        {/* Ingredientes */}
        <div className="mb-4">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Incluye:</h4>
          <div className="flex flex-wrap gap-1">
            {item.ingredients.slice(0, 2).map((ingredient, index) => (
              <span 
                key={index}
                className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full"
              >
                {ingredient}
              </span>
            ))}
            {item.ingredients.length > 2 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{item.ingredients.length - 2} más
              </span>
            )}
          </div>
        </div>

        {/* Botón agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base min-h-[44px] touch-manipulation ${
            isAdding ? 'animate-pulse scale-95' : ''
          }`}
        >
          {isAdding ? '🛒 Agregando...' : '🛒 Agregar al Carrito'}
        </button>
      </div>
    </div>
  )
}

export default MenuCard 