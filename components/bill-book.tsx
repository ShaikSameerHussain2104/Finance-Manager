"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { BillBookData } from "./finance-manager"
import { Save, BookOpen } from "lucide-react"

interface BillBookProps {
  data: BillBookData
  onSave: (data: BillBookData) => void
  isMobile: boolean
}

export default function BillBook({ data, onSave, isMobile }: BillBookProps) {
  const [billBookData, setBillBookData] = useState<BillBookData>(data)
  const [isSaved, setIsSaved] = useState(false)

  // Update local state when props change
  useEffect(() => {
    setBillBookData(data)
  }, [data])

  const handleChange = (field: keyof BillBookData, value: string) => {
    setBillBookData({
      ...billBookData,
      [field]: field === "total_chanda" ? Number.parseFloat(value) || 0 : Number.parseInt(value) || 0,
    })
    setIsSaved(false)
  }

  const handleSave = () => {
    onSave(billBookData)
    setIsSaved(true)

    // Reset the saved state after showing success animation
    setTimeout(() => {
      setIsSaved(false)
    }, 2000)
  }

  return (
    <Card className="border border-amber-100 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg border-b border-amber-100">
        <CardTitle className="flex items-center text-amber-800">
          <BookOpen className="h-5 w-5 mr-2 text-amber-600" />
          Bill Book Number & Total Chanda Received
        </CardTitle>
        <CardDescription>Record bill book numbers and total donations received</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className={`${isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-3 gap-4"}`}>
          <div className="space-y-2">
            <Label htmlFor="bill-from" className="text-gray-700">
              Bill Book From
            </Label>
            <Input
              id="bill-from"
              type="number"
              placeholder="Starting number"
              value={billBookData.from || ""}
              onChange={(e) => handleChange("from", e.target.value)}
              className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bill-to" className="text-gray-700">
              Bill Book To
            </Label>
            <Input
              id="bill-to"
              type="number"
              placeholder="Ending number"
              value={billBookData.to || ""}
              onChange={(e) => handleChange("to", e.target.value)}
              className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bill-total" className="text-gray-700">
              Total Chanda Received (Rs.)
            </Label>
            <Input
              id="bill-total"
              type="number"
              placeholder="Total amount"
              value={billBookData.total_chanda || ""}
              onChange={(e) => handleChange("total_chanda", e.target.value)}
              className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pb-4 bg-amber-50 border-t border-amber-100">
        <Button
          onClick={handleSave}
          className={`bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white shadow-md transition-all ${isSaved ? "success-pulse" : ""}`}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaved ? "Saved Successfully" : "Save Bill Book Data"}
        </Button>
      </CardFooter>
    </Card>
  )
}

