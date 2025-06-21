import { getDatabase, ref, push } from "firebase/database";
import "../../firebase.config";

export function saveCombinationToFirebase(combination: { name: string; sounds: string[] }) {
  const db = getDatabase();
  const combinationsRef = ref(db, "combinations");
  return push(combinationsRef, combination);
}
