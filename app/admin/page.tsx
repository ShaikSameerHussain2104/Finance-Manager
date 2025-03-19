"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getFirebaseDatabase } from "@/lib/firebase"
import { ref, get, update } from "firebase/database"
import { Loader2, CheckCircle, XCircle, User, Phone, Mail, Calendar } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Admin user ID - replace with your admin user ID
const ADMIN_USER_ID = "admin-user-id"

type UserData = {
  uid: string
  name: string
  email: string
  phoneNumber: string
  approved: boolean
  createdAt: string
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingUser, setProcessingUser] = useState<string | null>(null)

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!user || user.uid !== ADMIN_USER_ID)) {
      router.push("/")
      toast.error("You do not have permission to access this page")
    }
  }, [user, loading, router])

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const database = getFirebaseDatabase()
        const usersRef = ref(database, "users")
        const snapshot = await get(usersRef)

        if (snapshot.exists()) {
          const userData: UserData[] = []

          snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val()
            userData.push({
              uid: user.uid,
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber,
              approved: user.approved,
              createdAt: user.createdAt,
            })
          })

          // Sort by creation date (newest first)
          userData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

          setUsers(userData)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user && user.uid === ADMIN_USER_ID) {
      fetchUsers()
    }
  }, [user])

  // Approve or reject user
  const updateUserStatus = async (uid: string, approved: boolean) => {
    try {
      setProcessingUser(uid)

      const database = getFirebaseDatabase()
      const userRef = ref(database, `users/${uid}`)

      await update(userRef, {
        approved,
        updatedAt: new Date().toISOString(),
      })

      // Update local state
      setUsers(users.map((user) => (user.uid === uid ? { ...user, approved } : user)))

      toast.success(`User ${approved ? "approved" : "rejected"} successfully`)
    } catch (error) {
      console.error("Error updating user status:", error)
      toast.error("Failed to update user status")
    } finally {
      setProcessingUser(null)
    }
  }

  // If loading or not admin
  if (loading || !user || user.uid !== ADMIN_USER_ID) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8 text-center">Manage user approvals and system settings</p>

        <Card className="border border-green-100 shadow-md mb-8">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b border-green-100">
            <CardTitle className="text-xl text-green-800">User Management</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No users found</div>
            ) : (
              <div className="space-y-4">
                {users.map((userData) => (
                  <Card key={userData.uid} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-gray-500" />
                            <span className="font-medium">{userData.name}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {userData.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {userData.phoneNumber}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            Registered on {format(new Date(userData.createdAt), "dd MMM yyyy")}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {userData.approved ? (
                            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approved
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateUserStatus(userData.uid, true)}
                                disabled={processingUser === userData.uid}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {processingUser === userData.uid ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Approve
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateUserStatus(userData.uid, false)}
                                disabled={processingUser === userData.uid}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

