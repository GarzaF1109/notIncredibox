import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firebaseConfig } from "./firebase.config";

// Inicializa Firebase solo si no está inicializado
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveCombinationToFirebase(uid: string, combination: { name: string, sounds: string[] }) {
  const ref = collection(db, "users", uid, "combinations");
  await addDoc(ref, combination);
}

export async function getCombinationsFromFirebase(uid: string) {
  const ref = collection(db, "users", uid, "combinations");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteCombinationFromFirebase(uid: string, combinationId: string) {
  const ref = doc(db, "users", uid, "combinations", combinationId);
  await deleteDoc(ref);
}
