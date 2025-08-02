import React from "react";

// Importación de imágenes desde src/assets/images
import logo from "../assets/images/delivery_express_logo.png";
import falafelImg from "../assets/images/burger.png";
import kebabImg from "../assets/images/cafe.png";
import shawarmaImg from "../assets/images/napoli.png";
import hummusImg from "../assets/images/sushi.png";


const businesses = [
  {
    name: "Falafel Express",
    image: falafelImg,
    description: "Deliciosos falafel recién hechos y wraps rápidos."
  },
  {
    name: "Kebab King",
    image: kebabImg,
    description: "Los mejores kebabs de cordero en la ciudad."
  },
  {
    name: "Shawarma House",
    image: shawarmaImg,
    description: "Shawarma auténtico con pan pita casero."
  },
  {
    name: "Hummus Bar",
    image: hummusImg,
    description: "Una variedad de hummus con ingredientes frescos."
  }
  
];

const InicioPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shadow-md">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Delivery Express Logo" className="h-12 w-12" />
          <h1 className="text-2xl font-bold text-red-600">Delivery Express</h1>
        </div>
        <nav className="space-x-6 hidden md:flex">
          <a href="#" className="hover:text-red-600">Inicio</a>
          <a href="#" className="hover:text-red-600">Negocios</a>
          <a href="#" className="hover:text-red-600">Contacto</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-red-50 py-16 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 text-red-700">La comida que amás, en minutos</h2>
        <p className="text-lg mb-6">Explorá tu menú árabe favorito y pedí directo desde tu negocio más cercano</p>
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition">
          Empezar Pedido
        </button>
      </section>

      {/* Businesses */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">Negocios Disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((biz, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={biz.image} alt={biz.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h4 className="text-xl font-semibold text-red-700">{biz.name}</h4>
                <p className="text-gray-600 text-sm mt-2">{biz.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} Delivery Express. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default InicioPage;
