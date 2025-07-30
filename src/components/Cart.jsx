import React, { useState } from 'react'

const SHIPPING_COST = 2000
const WHATSAPP_NUMBER = '5492645485330'

const Cart = ({ cart, onClose, onUpdateQuantity, onRemoveItem, onSendWhatsApp }) => {
  const [showForm, setShowForm] = useState(false)
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    department: '',
    address: '',
    references: ''
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price)
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = subtotal + SHIPPING_COST

  const handleInputChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    return customerData.name.trim() &&
      customerData.phone.trim() &&
      customerData.department.trim() &&
      customerData.address.trim()
  }

  const generateWhatsAppMessage = () => {
    const message = `🍽️ *PEDIDO ALTAIR EXPRESS* 🍽️\n\n📋 *Resumen del pedido:*\n${cart.map(item => `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`).join('\n')}\n\n🛵 *Envío:* ${formatPrice(SHIPPING_COST)}\n💰 *Total: ${formatPrice(total)}*\n\n⏰ *HORARIOS IMPORTANTES:*\n• Pedidos se toman a partir de las 19:00 hs\n• Entregas comienzan a partir de las 20:30 hs\n\n👤 *DATOS DEL CLIENTE:*\n• Nombre: ${customerData.name}\n• Teléfono: ${customerData.phone}\n• Departamento: ${customerData.department}\n• Dirección: ${customerData.address}${customerData.references ? `\n• Referencias: ${customerData.references}` : ''}\n\n¡Gracias por elegir Altair Express! 🌟`
    return encodeURIComponent(message)
  }

  const handleSendWhatsApp = () => {
    if (!validateForm()) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    const message = generateWhatsAppMessage()
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
    onSendWhatsApp()
    setShowForm(false)
    setCustomerData({ name: '', phone: '', department: '', address: '', references: '' })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header del carrito */}
        <div className="bg-gradient-to-r from-[#8B2D27] to-[#C89B3C] text-[#F4ECD8] p-4 sm:p-6 flex-shrink-0 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">🛒 Carrito</h2>
            <button
              onClick={onClose}
              className="text-[#F4ECD8] hover:text-[#F4F0E5] text-xl sm:text-2xl min-h-[44px] min-w-[44px] touch-manipulation"
            >
              ✕
            </button>
          </div>
          <p className="text-[#F4F0E5] mt-1 text-sm sm:text-base">{totalItems} productos</p>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl sm:text-6xl mb-4 block">🛒</span>
              <p className="text-gray-500 text-sm sm:text-base">Tu carrito está vacío</p>
            </div>
          ) : !showForm ? (
            <div className="space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl shadow-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg sm:text-2xl">{item.image}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 touch-manipulation"
                    >
                      -
                    </button>
                    <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 touch-manipulation"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 touch-manipulation ml-1 sm:ml-2"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">📋 Datos del Cliente</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input
                  type="text"
                  id="name"
                  value={customerData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input
                  type="tel"
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Tu número de teléfono"
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                <select
                  id="department"
                  value={customerData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Selecciona tu departamento</option>
                  <option value="Rivadavia">Rivadavia</option>
                  <option value="San Juan Capital">San Juan Capital</option>
                </select>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                <input
                  type="text"
                  id="address"
                  value={customerData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Tu dirección completa"
                />
              </div>
              <div>
                <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-1">Referencias (opcional)</label>
                <input
                  type="text"
                  id="references"
                  value={customerData.references}
                  onChange={(e) => handleInputChange('references', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Puntos de referencia, detalles adicionales"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer con total o botones */}
        {!showForm && cart.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0 bg-white rounded-b-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base sm:text-lg font-semibold">Subtotal:</span>
              <span className="text-base sm:text-lg">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base sm:text-lg font-semibold">Envío:</span>
              <span className="text-base sm:text-lg">{formatPrice(SHIPPING_COST)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg sm:text-xl font-bold">Total:</span>
              <span className="text-xl sm:text-2xl font-bold text-orange-600">{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 min-h-[56px] touch-manipulation text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">📱</span>
              <span>Enviar por WhatsApp</span>
            </button>
          </div>
        )}

        {/* Footer con botones del formulario */}
        {showForm && (
          <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span className="text-lg">📱</span>
                <span>Enviar Pedido</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
