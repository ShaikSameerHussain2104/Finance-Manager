"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, UserPlus, Phone, User, Lock } from "lucide-react"
import Link from "next/link"
import { PhoneInput } from "@/components/ui/phone-input"
import Image from "next/image"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("Submitting registration form with:", { name, phoneNumber })
      await register(phoneNumber, password, name)
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white p-4 relative"
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/PJsB3pKf/Leonardo-Kino-XL-Create-a-highquality-favicon-for-the-mosque-f-2-removebg-preview.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "soft-light",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/90 to-white/90 z-0"></div>

      <Card className="w-full max-w-md border border-green-100 shadow-lg z-10 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image
            src="https://i.postimg.cc/PJsB3pKf/Leonardo-Kino-XL-Create-a-highquality-favicon-for-the-mosque-f-2-removebg-preview.png"
            alt="Masjid Logo"
            width={80}
            height={80}
            className="rounded-full bg-white p-2 shadow-md"
          />
        </div>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b border-green-100 pt-10">
          <CardTitle className="text-2xl text-center text-green-800">Register</CardTitle>
          <CardDescription className="text-center">Create an account to access Masjid Finance Manager</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <User className="h-4 w-4 mr-2 text-green-600" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-green-600" />
                Phone Number
              </Label>
              <PhoneInput
                id="phone"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={setPhoneNumber}
                required
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-green-600" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-green-100 p-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

