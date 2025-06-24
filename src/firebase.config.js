// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDB6sU7tNYQAgPYK91LFeV3cjlpjdtsGhg",
  authDomain: "notincredibox.firebaseapp.com",
  databaseURL: "https://notincredibox-default-rtdb.firebaseio.com",
  projectId: "notincredibox",
  storageBucket: "notincredibox.firebasestorage.app",
  messagingSenderId: "529579243024",
  appId: "1:529579243024:web:94e600af76863d1c3cbc95",
  measurementId: "G-6DQDRT281G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Solo inicializa analytics si está en el navegador
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export const database = getDatabase(app);
// Exporta la configuración para que otros archivos la usen
export { firebaseConfig };