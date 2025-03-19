import { NextResponse } from "next/server"
import { readdir } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), "public", "uploads")

    try {
      const files = await readdir(uploadsDir)
      const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))

      const images = imageFiles.map((file) => ({
        name: file,
        url: `/uploads/${file}`,
      }))

      return NextResponse.json(images)
    } catch (error) {
      // Directory might not exist yet
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Error reading images directory:", error)
    return NextResponse.json({ error: "Failed to read images" }, { status: 500 })
  }
}

