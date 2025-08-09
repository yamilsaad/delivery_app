import { collection, getDocs, query, orderBy, limit, where, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

// Función para obtener todos los posicionados ordenados por fecha
export const getGanadores = async () => {
  try {
    const ganadoresRef = collection(db, "ganadores");
    const q = query(ganadoresRef, orderBy("fechaSorteo", "desc"));
    const querySnapshot = await getDocs(q);
    
    const ganadores = [];
    querySnapshot.forEach((doc) => {
      ganadores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return ganadores;
  } catch (error) {
    console.error("Error al obtener posicionados:", error);
    throw error;
  }
};

// Función para obtener los últimos N posicionados
export const getUltimosGanadores = async (limite = 50) => {
  try {
    const ganadoresRef = collection(db, "ganadores");
    const q = query(ganadoresRef, orderBy("fechaSorteo", "desc"), limit(limite));
    const querySnapshot = await getDocs(q);
    
    const ganadores = [];
    querySnapshot.forEach((doc) => {
      ganadores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return ganadores;
  } catch (error) {
    console.error("Error al obtener últimos posicionados:", error);
    throw error;
  }
};

// Función para buscar participante por DNI
export const buscarParticipantePorDNI = async (dni) => {
  try {
    const ganadoresRef = collection(db, "ganadores");
    
    // Intentar buscar por diferentes posibles nombres de campo
    let q = query(ganadoresRef, where("dni_ganador", "==", dni));
    let querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Intentar con otro nombre de campo
      q = query(ganadoresRef, where("dni", "==", dni));
      querySnapshot = await getDocs(q);
    }
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error("Error al buscar participante por DNI:", error);
    throw error;
  }
};

// Función para verificar si ya existe asistencia registrada
export const verificarAsistenciaExistente = async (dni) => {
  try {
    const asistenciasRef = collection(db, "asistencias");
    const q = query(asistenciasRef, where("dni", "==", dni));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error al verificar asistencia existente:", error);
    throw error;
  }
};

// Función para registrar asistencia
export const registrarAsistencia = async (participante) => {
  try {
    const asistenciasRef = collection(db, "asistencias");
    
    // Obtener el DNI del participante (puede estar en diferentes campos)
    const dni = participante.dni_ganador || participante.dni || '';
    
    // Obtener nombre y apellido
    let nombre = '';
    let apellido = '';
    
    if (participante.nombreCompleto) {
      const nombres = participante.nombreCompleto.split(' ');
      apellido = nombres[0] || '';
      nombre = nombres.slice(1).join(' ') || '';
    } else {
      nombre = participante.nombre || '';
      apellido = participante.apellido || '';
    }
    
    const asistenciaData = {
      dni: dni,
      nombre: nombre,
      apellido: apellido,
      fechaAsistencia: serverTimestamp(),
      timestamp: serverTimestamp(),
      estado: "presente",
      participanteId: participante.id
    };
    
    const docRef = await addDoc(asistenciasRef, asistenciaData);
    return {
      id: docRef.id,
      ...asistenciaData
    };
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    throw error;
  }
};

// Función para obtener todas las asistencias registradas
export const getAsistencias = async () => {
  try {
    const asistenciasRef = collection(db, "asistencias");
    const q = query(asistenciasRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    
    const asistencias = [];
    querySnapshot.forEach((doc) => {
      asistencias.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return asistencias;
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    throw error;
  }
};

// Función para obtener ganadores agrupados por manzana (para la vista de posiciones)
export const getGanadoresAgrupadosPorManzana = async () => {
  try {
    const ganadoresRef = collection(db, "ganadores");
    const q = query(ganadoresRef, orderBy("manzanaNombre"), orderBy("loteNombre"));
    const querySnapshot = await getDocs(q);
    
    const ganadoresAgrupados = {};
    
    querySnapshot.forEach((doc) => {
      const ganador = {
        id: doc.id,
        ...doc.data()
      };
      
      const manzanaNombre = ganador.manzanaNombre || 'Sin Manzana';
      
      if (!ganadoresAgrupados[manzanaNombre]) {
        ganadoresAgrupados[manzanaNombre] = [];
      }
      
      ganadoresAgrupados[manzanaNombre].push(ganador);
    });
    
    return ganadoresAgrupados;
  } catch (error) {
    console.error("Error al obtener ganadores agrupados por manzana:", error);
    throw error;
  }
};

// Función para escuchar ganadores en tiempo real (para la vista de posiciones)
export const listenToGanadoresRealtime = (callback) => {
  try {
    const ganadoresRef = collection(db, "ganadores");
    const q = query(ganadoresRef, orderBy("manzanaNombre"), orderBy("loteNombre"));
    
    // Retornar la función de unsubscribe para que se pueda limpiar
    return onSnapshot(q, (snapshot) => {
      const ganadoresAgrupados = {};
      
      snapshot.forEach((doc) => {
        const ganador = {
          id: doc.id,
          ...doc.data()
        };
        
        const manzanaNombre = ganador.manzanaNombre || 'Sin Manzana';
        
        if (!ganadoresAgrupados[manzanaNombre]) {
          ganadoresAgrupados[manzanaNombre] = [];
        }
        
        ganadoresAgrupados[manzanaNombre].push(ganador);
      });
      
      callback(ganadoresAgrupados);
    }, (error) => {
      console.error("Error al escuchar ganadores en tiempo real:", error);
      callback({});
    });
  } catch (error) {
    console.error("Error al configurar listener de ganadores:", error);
    throw error;
  }
};
