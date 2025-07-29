import React, { useState, useEffect } from 'react'
import altairLogo from '../assets/images/altair-logo-transparente.png'

const Header = ({ onShowCart, cartItemCount }) => {
  const [isBouncing, setIsBouncing] = useState(false)

  useEffect(() => {
    if (cartItemCount > 0) {
      setIsBouncing(true)
      const timer = setTimeout(() => setIsBouncing(false), 300)
      return () => clearTimeout(timer)
    }
  }, [cartItemCount])

  return (
    <header className="bg-gradient-to-r from-[#8B2D27] to-[#C89B3C] shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo de Altair */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F8F2E7] rounded-full flex items-center justify-center shadow-md overflow-hidden">
              <img 
                src={altairLogo} 
                alt="Altair Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-[#F4ECD8]">Altair Express</h1>
              <p className="text-[#F4F0E5] text-xs sm:text-sm">Comida Árabe</p>
            </div>
          </div>

          {/* Carrito */}
          <button 
            onClick={onShowCart}
            className="relative bg-[#F4ECD8] hover:bg-[#F4F0E5] text-[#8B2D27] px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base shadow-md hover:shadow-lg"
          >
            <span className="text-lg sm:text-xl">🛒</span>
            <span className="font-semibold hidden sm:inline">Carrito</span>
            {cartItemCount > 0 && (
              <span className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-[#8B2D27] text-[#F4ECD8] text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold transition-transform duration-300 ${isBouncing ? 'scale-125' : 'scale-100'}`}>
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header 