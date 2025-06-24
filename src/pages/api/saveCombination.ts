import { getDatabase, ref, push } from "firebase/database";
import "../../firebase.config";

// Ahora recibe el uid del usuario
export function saveCombinationToFirebase(uid: string, combination: { name: string; sounds: string[] }) {
  const db = getDatabase();
  const combinationsRef = ref(db, `combinations/${uid}`);
  return push(combinationsRef, combination);
}
