import React, { useEffect } from 'react'

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000) // Se oculta automáticamente después de 2 segundos

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 min-w-[200px] justify-center">
        <span className="text-xl">✅</span>
        <span className="font-semibold text-sm sm:text-base">{message}</span>
      </div>
    </div>
  )
}

export default Toast 