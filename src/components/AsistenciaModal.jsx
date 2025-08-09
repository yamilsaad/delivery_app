import React, { useState, useEffect } from 'react';
import { buscarParticipantePorDNI, verificarAsistenciaExistente, registrarAsistencia } from '../services/firestoreService';

const AsistenciaModal = ({ isOpen, onClose, onAsistenciaRegistrada }) => {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [participante, setParticipante] = useState(null);
  const [yaRegistrado, setYaRegistrado] = useState(false);

  // Limpiar estados cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setDni('');
      setError('');
      setSuccess('');
      setParticipante(null);
      setYaRegistrado(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!dni.trim()) {
      setError('Por favor, ingresa tu DNI');
      return;
    }

    if (dni.length < 7 || dni.length > 8) {
      setError('El DNI debe tener entre 7 y 8 dígitos');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Buscar participante por DNI
      const participanteEncontrado = await buscarParticipantePorDNI(dni);
      
      if (!participanteEncontrado) {
        setError('❌ No se encontró ningún participante con ese DNI en el padrón');
        setLoading(false);
        return;
      }

      // Verificar si ya registró asistencia
      const asistenciaExistente = await verificarAsistenciaExistente(dni);
      
      if (asistenciaExistente) {
        setYaRegistrado(true);
        setParticipante(participanteEncontrado);
        setError('⚠️ Ya has registrado tu asistencia anteriormente');
        setLoading(false);
        return;
      }

      // Registrar asistencia
      await registrarAsistencia(participanteEncontrado);
      
      setParticipante(participanteEncontrado);
      setSuccess('✅ ¡Asistencia registrada exitosamente!');
      
      // Notificar al componente padre
      if (onAsistenciaRegistrada) {
        onAsistenciaRegistrada(participanteEncontrado);
      }

    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      setError('❌ Error al procesar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">📋 Registro de Asistencia</h2>
              <p className="text-white/90 text-sm mt-1">
                Sistema de Lotes - Gobierno
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-white/80 hover:text-white text-2xl font-bold transition-colors disabled:opacity-50"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!participante && !yaRegistrado && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="dni" className="block text-sm font-semibold text-gray-700 mb-2">
                  🆔 Ingresa tu DNI
                </label>
                <input
                  type="text"
                  id="dni"
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ej: 12345678"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-center text-lg font-semibold"
                  maxLength={8}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Solo números, sin puntos ni espacios
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !dni.trim()}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                  loading || !dni.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verificando...</span>
                  </div>
                ) : (
                  '🔍 Verificar y Registrar Asistencia'
                )}
              </button>
            </form>
          )}

          {/* Resultado exitoso */}
          {success && participante && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-green-800 font-bold text-lg mb-2">
                  ¡Asistencia Registrada!
                </h3>
                <p className="text-green-700 text-sm">{success}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Datos del Participante</h4>
                <div className="text-left space-y-1 text-sm">
                  <p><span className="font-medium">Nombre:</span> {participante.nombreCompleto}</p>
                  <p><span className="font-medium">DNI:</span> {participante.dni_ganador}</p>
                  {participante.manzanaNombre && (
                    <p><span className="font-medium">Manzana:</span> {participante.manzanaNombre}</p>
                  )}
                  {participante.loteNombre && (
                    <p><span className="font-medium">Lote:</span> {participante.loteNombre}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Ya registrado */}
          {yaRegistrado && participante && (
            <div className="text-center space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="text-yellow-800 font-bold text-lg mb-2">
                  Asistencia Ya Registrada
                </h3>
                <p className="text-yellow-700 text-sm">
                  Ya has registrado tu asistencia anteriormente.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Tus Datos</h4>
                <div className="text-left space-y-1 text-sm">
                  <p><span className="font-medium">Nombre:</span> {participante.nombreCompleto}</p>
                  <p><span className="font-medium">DNI:</span> {participante.dni_ganador}</p>
                  {participante.manzanaNombre && (
                    <p><span className="font-medium">Manzana:</span> {participante.manzanaNombre}</p>
                  )}
                  {participante.loteNombre && (
                    <p><span className="font-medium">Lote:</span> {participante.loteNombre}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                Entendido
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 rounded-b-2xl border-t">
          <p className="text-center text-xs text-gray-500">
            <span className="font-bold">Dirección de TICs</span> - Subsecretaría de Innovación y Comunicación
          </p>
        </div>
      </div>
    </div>
  );
};

export default AsistenciaModal;
