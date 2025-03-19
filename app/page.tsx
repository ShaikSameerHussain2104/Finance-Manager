"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import FinanceManager from "@/components/finance-manager"
import ErrorBoundary from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { Loader2, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { user, loading } = useAuth()
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading state
  if (loading || !isClient) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </main>
    )
  }

  // Show login/register buttons if not authenticated
  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-green-800 mb-4">Masjid Finance Manager</h1>
            <p className="text-xl text-gray-600 mb-8">
              A comprehensive system to manage and track donations, expenses, and financial records for your masjid
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 w-full sm:w-auto"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Login
                </Button>
              </Link>

              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-50 w-full sm:w-auto"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Show finance manager if authenticated
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Masjid Finance Manager</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A comprehensive system to manage and track donations, expenses, and financial records for your masjid
          </p>
        </header>

        <ErrorBoundary>
          <FinanceManager />
        </ErrorBoundary>

        <footer className="mt-16 pt-8 border-t border-green-100 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Masjid Finance Manager. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}

