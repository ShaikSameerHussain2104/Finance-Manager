"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getFirebaseDatabase } from "@/lib/firebase"
import { ref as dbRef, push, set, onValue, off } from "firebase/database"
import { Image, Upload, Loader2, Filter, X, Calendar, Tag, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

// Media item type
type MediaItem = {
  id: string
  url: string
  caption: string
  category: string
  createdAt: string
  createdBy: string
  creatorName: string
}

// Categories for media
const CATEGORIES = ["Construction", "Maintenance", "Events", "Charity", "Education", "Other"]

export default function ShowcasePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [category, setCategory] = useState("Other")
  const [isUploading, setIsUploading] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  // Fetch media items
  useEffect(() => {
    const database = getFirebaseDatabase()
    const mediaRef = dbRef(database, "media")

    const handleData = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const items: MediaItem[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        }))

        // Sort by date (newest first)
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        setMediaItems(items)
        setFilteredItems(items)
      } else {
        setMediaItems([])
        setFilteredItems([])
      }
    }

    onValue(mediaRef, handleData)

    return () => {
      off(mediaRef, "value", handleData)
    }
  }, [])

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Handle upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !user) return

    setIsUploading(true)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append("file", file)

      // Upload file to local server
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Failed to upload file")
      }

      // Save metadata to database
      const database = getFirebaseDatabase()
      const mediaRef = dbRef(database, "media")
      const newMediaRef = push(mediaRef)

      await set(newMediaRef, {
        url: uploadResult.filePath, // Use local path instead of Firebase Storage URL
        caption,
        category,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
        creatorName: user.name,
      })

      // Reset form
      setFile(null)
      setCaption("")
      setCategory("Other")
      setUploadSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  // Filter media items
  const filterItems = (category: string | null) => {
    setActiveFilter(category)

    if (!category) {
      setFilteredItems(mediaItems)
    } else {
      setFilteredItems(mediaItems.filter((item) => item.category === category))
    }
  }

  // If loading or not authenticated
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">Masjid Work Showcase</h1>
        <p className="text-gray-600 mb-8 text-center">See how your donations are being utilized</p>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="gallery" className="text-base">
              <Image className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-base">
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="flex items-center mr-2">
                <Filter className="h-4 w-4 mr-1 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>

              <Badge
                variant={!activeFilter ? "default" : "outline"}
                className={`cursor-pointer ${!activeFilter ? "bg-green-600" : "hover:bg-green-100"}`}
                onClick={() => filterItems(null)}
              >
                All
              </Badge>

              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant={activeFilter === cat ? "default" : "outline"}
                  className={`cursor-pointer ${activeFilter === cat ? "bg-green-600" : "hover:bg-green-100"}`}
                  onClick={() => filterItems(cat)}
                >
                  {cat}
                </Badge>
              ))}

              {activeFilter && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-500" onClick={() => filterItems(null)}>
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Gallery */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <Image className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No media found</h3>
                <p className="text-gray-500">
                  {activeFilter ? `No media items in the "${activeFilter}" category` : "No media has been uploaded yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video relative bg-gray-100">
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-green-600">{item.category}</Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(item.createdAt), "dd MMM yyyy")}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{item.caption}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Tag className="h-3 w-3 mr-1" />
                        <span>Posted by {item.creatorName}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <Card className="border border-green-100 shadow-md">
              <CardContent className="p-6">
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="media">Upload Image</Label>
                    <Input
                      id="media"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    {file && <p className="text-sm text-green-600">Selected file: {file.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-green-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caption" className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Caption
                    </Label>
                    <Textarea
                      id="caption"
                      placeholder="Describe this image..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      required
                      className="min-h-[100px] border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isUploading || !file}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Media
                      </>
                    )}
                  </Button>

                  {uploadSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-center">
                      Media uploaded successfully!
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

