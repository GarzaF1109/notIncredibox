import { getDatabase, ref, remove } from "firebase/database";
import "../../firebase.config";

/**
 * Elimina una combinación del nodo 'combinations' en Firebase usando su ID y UID.
 * @param uid - UID del usuario.
 * @param id - ID de la combinación a eliminar.
 */
export const deleteCombinationFromFirebase = async (uid: string, id: string): Promise<void> => {
  try {
    const db = getDatabase();
    const combinationRef = ref(db, `combinations/${uid}/${id}`);
    await remove(combinationRef);
    console.log(`Combinación con ID ${id} eliminada correctamente.`);
  } catch (error) {
    console.error("Error al eliminar la combinación:", error);
    throw new Error("No se pudo eliminar la combinación.");
  }
};
