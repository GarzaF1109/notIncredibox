// Configuración de autenticación con Firebase (Google Sign-In)
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./firebase.config";

// Inicializa la app de Firebase (solo una vez)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // El usuario está autenticado
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
};

// Función para cerrar sesión
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

// Escuchar cambios de autenticación
/**
 * Listener para cambios de autenticación de usuario en Firebase Auth
 * @param {function} callback - Recibe el usuario autenticado o null
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
