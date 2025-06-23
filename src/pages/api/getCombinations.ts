// En tu componente o archivo donde necesites las combinaciones
// src/firebase-utils.js
import { getDatabase, ref, get } from "firebase/database";
import "@/firebase.config";// Importa tu configuración de Firebase para inicializarla

export async function getCombinationsFromFirebase() {
  const db = getDatabase();
  const combinationsRef = ref(db, "combinations");

  try {
    const snapshot = await get(combinationsRef);
    if (snapshot.exists()) {
      const combinations = [];
      snapshot.forEach((childSnapshot) => {
        combinations.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      return combinations;
    } else {
      console.log("No se encontraron combinaciones.");
      return [];
    }
  } catch (error) {
    console.error("Error al obtener las combinaciones:", error);
    throw error;
  }
}