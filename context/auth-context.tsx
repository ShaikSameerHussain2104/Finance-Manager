"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { ref, get, set, update, query, orderByChild, equalTo } from "firebase/database"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  browserLocalPersistence,
  setPersistence,
  getAuth,
} from "firebase/auth"
import { initializeApp } from "firebase/app" // Fixed import
import { getDatabase } from "firebase/database"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// User type definition
export type User = {
  uid: string
  phoneNumber: string
  name: string
  approved: boolean
}

// Auth context type
type AuthContextType = {
  user: User | null
  loading: boolean
  register: (phoneNumber: string, password: string, name: string) => Promise<void>
  login: (phoneNumber: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  checkApprovalStatus: (uid: string) => Promise<boolean>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Firebase config
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

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState<any>(null)
  const [database, setDatabase] = useState<any>(null)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  // Initialize Firebase
  useEffect(() => {
    try {
      console.log("Initializing Firebase...")
      const app = initializeApp(firebaseConfig)
      const authInstance = getAuth(app)
      const databaseInstance = getDatabase(app)

      setAuth(authInstance)
      setDatabase(databaseInstance)
      setInitialized(true)
      console.log("Firebase initialized successfully")
    } catch (error) {
      console.error("Error initializing Firebase:", error)
    }
  }, [])

  // Set persistence on mount
  useEffect(() => {
    if (!auth) return

    const setupPersistence = async () => {
      try {
        // Only set persistence in browser environment
        if (typeof window !== "undefined") {
          await setPersistence(auth, browserLocalPersistence)
          console.log("Firebase persistence set successfully")
        }
      } catch (error) {
        console.error("Error setting persistence:", error)
      }
    }

    setupPersistence()
  }, [auth])

  // Check if a user is approved
  const checkApprovalStatus = async (uid: string): Promise<boolean> => {
    if (!database) return false

    try {
      const userRef = ref(database, `users/${uid}`)
      const snapshot = await get(userRef)

      if (snapshot.exists()) {
        const userData = snapshot.val()
        return userData.approved === true
      }

      return false
    } catch (error) {
      console.error("Error checking approval status:", error)
      return false
    }
  }

  // Register a new user
  const register = async (phoneNumber: string, password: string, name: string) => {
    if (!auth || !database) {
      console.error("Firebase not initialized")
      toast.error("Firebase not initialized. Please try again later.")
      return
    }

    try {
      setLoading(true)
      console.log("Starting registration process...")

      // Format phone number for authentication (add +91 or appropriate country code)
      const formattedPhoneNumber = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`
      console.log("Formatted phone number:", formattedPhoneNumber)

      // Check if phone number already exists
      const usersRef = ref(database, "users")
      const phoneQuery = query(usersRef, orderByChild("phoneNumber"), equalTo(formattedPhoneNumber))
      const phoneSnapshot = await get(phoneQuery)

      if (phoneSnapshot.exists()) {
        throw new Error("Phone number already in use")
      }

      // Create email from phone number for Firebase Auth (since we're using email/password behind the scenes)
      const email = `${phoneNumber.replace(/[^0-9]/g, "")}@mosque.finance`
      console.log("Using email for auth:", email)

      // Create user with email and password
      console.log("Creating user with email and password...")
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log("User created successfully:", userCredential.user.uid)

      const uid = userCredential.user.uid

      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name,
      })
      console.log("User profile updated with name:", name)

      // Store user data in the database
      const userRef = ref(database, `users/${uid}`)
      await set(userRef, {
        uid,
        name,
        phoneNumber: formattedPhoneNumber,
        approved: false, // Set to false initially as requested
        createdAt: new Date().toISOString(),
      })
      console.log("User data stored in database with approved=false")

      toast.success("Registration successful! Waiting for admin approval.")
      router.push("/auth/pending-approval")
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error(error.message || "Failed to register")
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (phoneNumber: string, password: string) => {
    if (!auth || !database) {
      console.error("Firebase not initialized")
      toast.error("Firebase not initialized. Please try again later.")
      return
    }

    try {
      setLoading(true)
      console.log("Starting login process...")

      // Format phone number for authentication
      const formattedPhoneNumber = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`
      console.log("Formatted phone number:", formattedPhoneNumber)

      // Create email from phone number
      const email = `${phoneNumber.replace(/[^0-9]/g, "")}@mosque.finance`
      console.log("Using email for auth:", email)

      // Sign in with email and password
      console.log("Signing in with email and password...")
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("User signed in successfully:", userCredential.user.uid)

      const uid = userCredential.user.uid

      // Get user data from database
      const userRef = ref(database, `users/${uid}`)
      const snapshot = await get(userRef)

      if (!snapshot.exists()) {
        throw new Error("User data not found")
      }

      const userData = snapshot.val()
      console.log("User data retrieved from database:", userData)

      // Check if user is approved
      if (!userData.approved) {
        toast.error("Your account is pending approval")
        router.push("/auth/pending-approval")
        return
      }

      // Update last login
      await update(ref(database, `users/${uid}`), {
        lastLogin: new Date().toISOString(),
      })
      console.log("Last login timestamp updated")

      // Set user in state
      const userObj: User = {
        uid,
        phoneNumber: userData.phoneNumber,
        name: userData.name,
        approved: userData.approved,
      }

      setUser(userObj)
      console.log("User set in state:", userObj)

      // Store user in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userObj))
      console.log("User stored in localStorage")

      toast.success("Login successful!")
      router.push("/")
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Failed to login")
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    if (!auth) {
      console.error("Firebase not initialized")
      return
    }

    try {
      await firebaseSignOut(auth)
      setUser(null)
      localStorage.removeItem("user")
      toast.success("Logged out successfully")
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Sign out error:", error)
      toast.error(error.message || "Failed to sign out")
    }
  }

  // Check for stored user on mount
  useEffect(() => {
    if (!database || !initialized) return

    const checkStoredUser = async () => {
      try {
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User

          // Verify user still exists and is approved
          const userRef = ref(database, `users/${parsedUser.uid}`)
          const snapshot = await get(userRef)

          if (snapshot.exists()) {
            const userData = snapshot.val()

            if (userData.approved) {
              setUser(parsedUser)
            } else {
              localStorage.removeItem("user")
              router.push("/auth/pending-approval")
            }
          } else {
            localStorage.removeItem("user")
          }
        }
      } catch (error) {
        console.error("Error checking stored user:", error)
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    checkStoredUser()
  }, [database, initialized, router])

  const value = {
    user,
    loading,
    register,
    login,
    signOut,
    checkApprovalStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

