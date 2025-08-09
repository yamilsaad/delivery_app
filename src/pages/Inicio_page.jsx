
import React, { useState } from "react";

// Importación de imágenes desde src/assets/images
import logo from "../assets/images/logo_solo_trans.png";
import altairLogo from "../assets/images/altair-logo.svg";

const businesses = [
  {
    id: 1,
    name: "Falafel Express",
    image: altairLogo,
    description: "Deliciosos falafel recién hechos y wraps rápidos.",
    category: "Árabe",
    rating: 4.8,
    reviewsCount: 156,
    deliveryTime: "25-35 min",
    openTime: "11:00",
    closeTime: "23:00",
    isOpen: true,
    featured: true,
    deliveryFee: 3000
  },
  {
    id: 2,
    name: "Kebab King",
    image: altairLogo,
    description: "Los mejores kebabs de cordero en la ciudad.",
    category: "Árabe",
    rating: 4.6,
    reviewsCount: 89,
    deliveryTime: "30-40 min",
    openTime: "12:00",
    closeTime: "22:30",
    isOpen: true,
    featured: false,
    deliveryFee: 2500
  },
  {
    id: 3,
    name: "Shawarma House",
    image: altairLogo,
    description: "Shawarma auténtico con pan pita casero.",
    category: "Árabe",
    rating: 4.9,
    reviewsCount: 203,
    deliveryTime: "20-30 min",
    openTime: "10:30",
    closeTime: "23:30",
    isOpen: false,
    featured: true,
    deliveryFee: 3500
  },
  {
    id: 4,
    name: "Hummus Bar",
    image: altairLogo,
    description: "Una variedad de hummus con ingredientes frescos.",
    category: "Vegetariano",
    rating: 4.7,
    reviewsCount: 124,
    deliveryTime: "15-25 min",
    openTime: "09:00",
    closeTime: "21:00",
    isOpen: true,
    featured: false,
    deliveryFee: 2000
  }
];

const categories = ["Todos", "Árabe", "Vegetariano", "Pizza", "Sushi", "Burger"];

const InicioPage = ({ onNavigateToMenu, onNavigateToGanadores }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("featured");

  // Filtrar y ordenar negocios
  const filteredBusinesses = businesses
    .filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           business.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || business.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "deliveryTime":
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case "featured":
          return b.featured - a.featured;
        default:
          return 0;
      }
    });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price)
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }

    return stars;
  };

  const handleBusinessClick = (business) => {
    // Aquí podrías pasar el business específico al menú
    if (onNavigateToMenu) {
      onNavigateToMenu(business);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Delivery Express Logo" className="h-16 w-16" />
              <div>
                <h1 className="text-3xl font-bold text-[#F97316] font-sans">Delivery Express</h1>
                <p className="text-sm text-[#1E40AF]">Tu plataforma de delivery favorita</p>
              </div>
            </div>
            <nav className="space-x-6 hidden md:flex">
              <a href="#negocios" className="text-[#1E40AF] hover:text-[#F97316] transition font-medium">Negocios</a>
              <a href="#como-funciona" className="text-[#1E40AF] hover:text-[#F97316] transition font-medium">Cómo funciona</a>
              <a href="#contacto" className="text-[#1E40AF] hover:text-[#F97316] transition font-medium">Contacto</a>
              <button className="bg-[#F97316] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] transition font-medium">
                Registrar negocio
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] py-16 px-4 md:px-8">
        <div className="w-full text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white font-sans">
            La comida que amás, 
            <span className="text-[#F97316]"> en minutos</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Descubre los mejores restaurantes de tu ciudad. Pedí fácil, rápido y directo desde cada negocio.
          </p>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center space-x-2 text-blue-100">
              <span className="text-[#F97316] text-xl">✓</span>
              <span>Sin comisiones extras</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <span className="text-[#F97316] text-xl">✓</span>
              <span>Pedidos directos al restaurante</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <span className="text-[#F97316] text-xl">✓</span>
              <span>Delivery rápido</span>
            </div>
          </div>

          {/* Botón para ganadores */}
          {onNavigateToGanadores && (
            <div className="mt-8">
              <button
                onClick={onNavigateToGanadores}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 px-8 rounded-full hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                🏆 Ver Ganadores del Sorteo
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filtros y búsqueda */}
      <section className="py-8 px-4 md:px-8 bg-white border-b w-full">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar restaurantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
              />
              <span className="absolute left-3 top-3 text-gray-400 text-xl">🔍</span>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Categorías */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] text-[#1E40AF]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Ordenar */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] text-[#1E40AF]"
              >
                <option value="featured">Destacados</option>
                <option value="rating">Mejor calificados</option>
                <option value="deliveryTime">Más rápidos</option>
              </select>
            </div>
          </div>

          {/* Resultados */}
          <div className="mt-4 text-gray-600">
            {filteredBusinesses.length} restaurantes encontrados
          </div>
        </div>
      </section>

      {/* Lista de negocios */}
      <section id="negocios" className="py-12 px-4 md:px-8 w-full">
        <div className="max-w-6xl mx-auto">
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No encontramos restaurantes</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  onClick={() => handleBusinessClick(business)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                >
                  {/* Imagen y badges */}
                  <div className="relative">
                    <img src={business.image} alt={business.name} className="h-48 w-full object-cover" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {business.featured && (
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          ⭐ Destacado
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        business.isOpen 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {business.isOpen ? '🟢 Abierto' : '🔴 Cerrado'}
                      </span>
                    </div>

                    {/* Tiempo de delivery */}
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                      🕐 {business.deliveryTime}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4">
                    {/* Título y categoría */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{business.name}</h3>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {business.category}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {renderStars(business.rating)}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{business.rating}</span>
                      <span className="text-sm text-gray-500">({business.reviewsCount} reseñas)</span>
                    </div>

                    {/* Descripción */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>

                    {/* Información adicional */}
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <span>🕐</span>
                        <span>{business.openTime} - {business.closeTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🚚</span>
                        <span>{formatPrice(business.deliveryFee)}</span>
                      </div>
                    </div>

                    {/* Botón */}
                    <button 
                      className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${
                        business.isOpen
                          ? 'bg-gradient-to-r from-[#F97316] to-[#1E40AF] text-white hover:from-[#1E40AF] hover:to-[#F97316]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!business.isOpen}
                    >
                      {business.isOpen ? '📱 Ver Menú' : 'Cerrado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E40AF] text-white py-12 px-4 md:px-8 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src={logo} alt="Delivery Express Logo" className="h-12 w-12" />
                <h3 className="text-xl font-bold font-sans text-[#F97316]">Delivery Express</h3>
              </div>
              <p className="text-blue-100 mb-4">
                La plataforma que conecta tu negocio directamente con tus clientes, sin comisiones extras.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-100 hover:text-[#F97316] transition">📧 Contacto</a>
                <a href="#" className="text-blue-100 hover:text-[#F97316] transition">📱 WhatsApp</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#F97316]">Para Restaurantes</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-[#F97316] transition">Registrar negocio</a></li>
                <li><a href="#" className="hover:text-[#F97316] transition">Precios</a></li>
                <li><a href="#" className="hover:text-[#F97316] transition">Soporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#F97316]">Para Clientes</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-[#F97316] transition">Cómo funciona</a></li>
                <li><a href="#" className="hover:text-[#F97316] transition">Ayuda</a></li>
                <li><a href="#" className="hover:text-[#F97316] transition">Términos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-700 mt-8 pt-8 text-center text-blue-200">
            © {new Date().getFullYear()} Delivery Express. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InicioPage;
