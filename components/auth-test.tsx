"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { initializeApp } from "firebase/app"
import { Button } from "@/components/ui/button"

export default function AuthTest() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testAuth = async () => {
    setLoading(true)
    try {
      // Initialize Firebase directly in this component
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

      const app = initializeApp(firebaseConfig, "testApp")
      const auth = getAuth(app)

      // Generate a random test email
      const testEmail = `test${Math.floor(Math.random() * 1000000)}@test.com`
      const testPassword = "Test123456"

      // Try to create a user
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword)
      setResult(`Success! Created user with UID: ${userCredential.user.uid}`)
    } catch (error: any) {
      console.error("Auth test error:", error)
      setResult(`Error: ${error.code} - ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-xl font-bold mb-4">Direct Firebase Auth Test</h1>
      <Button onClick={testAuth} disabled={loading} className="w-full mb-4">
        {loading ? "Testing..." : "Test Authentication"}
      </Button>
      {result && (
        <div className="p-3 bg-gray-100 rounded">
          <p className={result.includes("Success") ? "text-green-600" : "text-red-600"}>{result}</p>
        </div>
      )}
    </div>
  )
}

