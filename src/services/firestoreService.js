import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
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
