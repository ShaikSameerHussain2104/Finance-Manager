"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PendingApprovalPage() {
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
          <CardTitle className="text-2xl text-center text-green-800">Account Pending Approval</CardTitle>
          <CardDescription className="text-center">Your account is waiting for admin approval</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-amber-500" />
          </div>
          <p className="text-gray-600 mb-4">
            Thank you for registering with Masjid Finance Manager. Your account is currently pending approval from an
            administrator.
          </p>
          <p className="text-gray-600 mb-4">
            Please check back later or contact the masjid administrator for assistance.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-green-100 p-4">
          <Link href="/auth/login">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

