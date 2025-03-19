import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvnpgF0PM7oL4POz6X3BITKspr1-Vz_Lw",
  authDomain: "masjid-finance-manager.firebaseapp.com",
  databaseURL: "https://masjid-finance-manager-default-rtdb.firebaseio.com",
  projectId: "masjid-finance-manager",
  storageBucket: "masjid-finance-manager.appspot.com",
  messagingSenderId: "1096343760455",
  appId: "1:1096343760455:web:f72c2b9f9d838974368b62",
  measurementId: "G-VBJT2Q4N7V",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
const auth = getAuth(app)
const database = getDatabase(app)
const storage = getStorage(app)

// Export the database getter function
function getFirebaseDatabase() {
  return database
}

// Export all services
export { auth, database, storage, getFirebaseDatabase }

