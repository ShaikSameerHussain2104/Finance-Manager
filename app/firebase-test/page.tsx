"use client"

import { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, signInAnonymously } from "firebase/auth"

export default function FirebaseTestPage() {
  const [status, setStatus] = useState("Testing Firebase connection...")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testFirebase() {
      try {
        // Firebase configuration
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

        setStatus("Initializing Firebase...")
        const app = initializeApp(firebaseConfig)

        setStatus("Getting Auth service...")
        const auth = getAuth(app)

        setStatus("Testing anonymous sign-in...")
        await signInAnonymously(auth)

        setStatus("Firebase connection successful! ✅")
      } catch (err: any) {
        console.error("Firebase test error:", err)
        setError(err.message || "Unknown error")
        setStatus("Firebase connection failed! ❌")
      }
    }

    testFirebase()
  }, [])

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-xl font-bold mb-4">Firebase Connection Test</h1>
      <div className="mb-4">
        <p className="font-semibold">Status:</p>
        <p
          className={
            status.includes("successful")
              ? "text-green-600"
              : status.includes("failed")
                ? "text-red-600"
                : "text-blue-600"
          }
        >
          {status}
        </p>
      </div>
      {error && (
        <div className="mb-4">
          <p className="font-semibold text-red-600">Error:</p>
          <p className="text-red-600 text-sm break-all">{error}</p>
        </div>
      )}
      <div className="bg-gray-100 p-3 rounded text-sm">
        <p className="font-semibold">Troubleshooting Steps:</p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Verify Authentication is enabled in Firebase console</li>
          <li>Check if Email/Password sign-in method is enabled</li>
          <li>Verify your API key is not restricted</li>
          <li>Check if your Firebase project is active</li>
          <li>Make sure Anonymous auth is enabled for this test</li>
        </ol>
      </div>
    </div>
  )
}

