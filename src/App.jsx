import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import Menu from './pages/Menu'
import InicioPage from './pages/Inicio_page'
import SorteoInicio from './pages/SorteoInicio'
import Ganadores from './pages/Ganadores'
import PosicionesParticipantes from './pages/PosicionesParticipantes'
import AdminLogin from './components/AdminLogin'
import AdminAsistencias from './pages/AdminAsistencias'
import Cart from './components/Cart'
import Toast from './components/Toast'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('sorteo-inicio')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '' })
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [adminLoginDestination, setAdminLoginDestination] = useState('admin-asistencias')

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })

    // Mostrar toast de confirmación
    setToast({
      isVisible: true,
      message: `¡${item.name} agregado al carrito!`
    })
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const sendWhatsApp = () => {
    setShowCart(false)
    setCart([])

    // Mostrar toast de confirmación
    setToast({
      isVisible: true,
      message: '¡Pedido enviado por WhatsApp!'
    })
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const closeToast = () => {
    setToast({ isVisible: false, message: '' })
  }

  const handleNavigateToAdmin = () => {
    if (isAdminLoggedIn) {
      setCurrentPage('admin-asistencias')
    } else {
      setAdminLoginDestination('admin-asistencias')
      setShowAdminLogin(true)
    }
  }

  const handleNavigateToPosiciones = () => {
    if (isAdminLoggedIn) {
      setCurrentPage('posiciones')
    } else {
      setAdminLoginDestination('posiciones')
      setShowAdminLogin(true)
    }
  }

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true)
    setShowAdminLogin(false)
    // Redirigir a la página que el usuario quería acceder
    setCurrentPage(adminLoginDestination)
    setToast({
      isVisible: true,
      message: '¡Acceso administrativo exitoso!'
    })
  }

  const handleAdminLoginClose = () => {
    setShowAdminLogin(false)
  }

  const handleBackToHome = () => {
    setCurrentPage('sorteo-inicio')
    setIsAdminLoggedIn(false) // Cerrar sesión al volver
  }

  return (
    <div className="App">
      {/* Header solo visible en páginas de negocio específico */}
      {(currentPage === 'home' || currentPage === 'menu') && (
        <Header 
          onShowCart={() => setShowCart(true)}
          cartItemCount={getCartItemCount()}
          onBackToHome={() => setCurrentPage('inicio')}
        />
      )}

      {/* Contenido principal */}
      <main>
        {currentPage === 'inicio' && (
          <InicioPage 
            onNavigateToMenu={(business) => setCurrentPage('home')}
            onNavigateToGanadores={() => setCurrentPage('ganadores')}
          />
        )}

        {currentPage === 'sorteo-inicio' && (
          <SorteoInicio 
            onNavigateToGanadores={() => setCurrentPage('ganadores')}
            onNavigateToPosiciones={handleNavigateToPosiciones}
            onNavigateToAdmin={handleNavigateToAdmin}
          />
        )}

        {currentPage === 'home' && (
          <Home onShowMenu={() => setCurrentPage('menu')} />
        )}

        {currentPage === 'menu' && (
          <Menu 
            onAddToCart={addToCart}
            onBackToHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'ganadores' && (
          <Ganadores onBackToHome={() => setCurrentPage('sorteo-inicio')} />
        )}

        {currentPage === 'posiciones' && (
          <PosicionesParticipantes onBackToHome={() => setCurrentPage('sorteo-inicio')} />
        )}

        {currentPage === 'admin-asistencias' && (
          <AdminAsistencias onBackToHome={handleBackToHome} />
        )}
      </main>

      {/* Modal de Login Administrativo */}
      {showAdminLogin && (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onClose={handleAdminLoginClose}
        />
      )}

      {/* Carrito modal */}
      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onSendWhatsApp={sendWhatsApp}
        />
      )}

      {/* Toast notification */}
      <Toast 
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  )
}

export default App