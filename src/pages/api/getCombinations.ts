// src/pages/api/getCombinations.ts
import { database } from '../../firebase.config'; // <-- Dos niveles arriba

import { ref, get, DataSnapshot } from 'firebase/database';

// ¡ESTO ES CLAVE! La palabra 'export' es lo que permite que otros archivos la importen.
export interface Combination { // <--- ¡Asegúrate de que 'export' esté aquí!
  id: string;
  name: string;
  sounds: string[];
}

// Ahora recibe el uid del usuario
export const getCombinationsFromFirebase = async (uid: string): Promise<Combination[]> => {
  try {
    const combinationsRef = ref(database, `combinations/${uid}`);
    const snapshot: DataSnapshot = await get(combinationsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const combinationsArray: Combination[] = Object.keys(data).map(key => ({
        id: key,
        name: data[key].name || 'Combinación sin nombre',
        sounds: data[key].sounds || [],
      }));
      return combinationsArray;
    } else {
      console.log("No hay combinaciones disponibles en Firebase.");
      return [];
    }
  } catch (error) {
    console.error("Error al obtener las combinaciones de Firebase:", error);
    throw new Error("No se pudieron cargar las combinaciones.");
  }
};