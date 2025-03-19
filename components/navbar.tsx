"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Home, Image, LogOut, Menu, X, User, LogIn } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  // Skip rendering on auth pages
  if (pathname?.startsWith("/auth/")) {
    return null
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="bg-white shadow-md border-b border-green-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-green-800">Masjid Finance Manager</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Link>

            <Link
              href="/showcase"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/showcase")
                  ? "bg-green-100 text-green-800"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <Image className="h-4 w-4 mr-1" />
              Showcase
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 mr-1" />
                  {user.name}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="border-green-200 text-green-600 hover:bg-green-50">
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-700 hover:bg-green-50 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-green-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive("/") ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </Link>

            <Link
              href="/showcase"
              onClick={closeMenu}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive("/showcase")
                  ? "bg-green-100 text-green-800"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <Image className="h-5 w-5 mr-2" />
              Showcase
            </Link>

            {user ? (
              <>
                <div className="flex items-center px-3 py-2 text-base font-medium text-gray-700">
                  <User className="h-5 w-5 mr-2" />
                  {user.name}
                </div>

                <button
                  onClick={() => {
                    signOut()
                    closeMenu()
                  }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={closeMenu}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-green-600 hover:bg-green-50"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

