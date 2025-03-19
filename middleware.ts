import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { mkdir } from "fs/promises"
import { join } from "path"

export async function middleware(request: NextRequest) {
  // Ensure uploads directory exists
  if (request.nextUrl.pathname.startsWith("/api/upload")) {
    try {
      const uploadsDir = join(process.cwd(), "public", "uploads")
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.error("Error creating uploads directory:", error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/upload"],
}

