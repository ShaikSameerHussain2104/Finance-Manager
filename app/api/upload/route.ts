import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.error("Error creating uploads directory:", error)
    }

    // Generate unique filename
    const uniqueId = uuidv4()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uniqueId}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Convert file to buffer and save it
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the file path relative to public directory
    return NextResponse.json({
      success: true,
      filePath: `/uploads/${fileName}`,
      fileName: fileName,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

