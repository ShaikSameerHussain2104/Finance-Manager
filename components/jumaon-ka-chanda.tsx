"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Plus, Save, CalendarIcon as CalendarFull } from "lucide-react"
import { format } from "date-fns"
import type { JumaChanda } from "./finance-manager"
import { Label } from "@/components/ui/label"

interface JumaonKaChandaProps {
  data: JumaChanda[]
  onSave: (item: JumaChanda) => void
  total: number
  isMobile: boolean
}

export default function JumaonKaChanda({ data = [], onSave, total = 0, isMobile }: JumaonKaChandaProps) {
  const [newEntries, setNewEntries] = useState<JumaChanda[]>([
    { date: format(new Date(), "yyyy-MM-dd"), description: "", amount: 0 },
  ])

  const hasData = Array.isArray(data) && data.length > 0

  const handleDateChange = (index: number, date: Date | undefined) => {
    if (!date) return

    const updatedEntries = [...newEntries]
    updatedEntries[index].date = format(date, "yyyy-MM-dd")
    setNewEntries(updatedEntries)
  }

  const handleDescriptionChange = (index: number, description: string) => {
    const updatedEntries = [...newEntries]
    updatedEntries[index].description = description
    setNewEntries(updatedEntries)
  }

  const handleAmountChange = (index: number, amount: string) => {
    const updatedEntries = [...newEntries]
    updatedEntries[index].amount = Number.parseFloat(amount) || 0
    setNewEntries(updatedEntries)
  }

  const handleAddRow = () => {
    setNewEntries([...newEntries, { date: format(new Date(), "yyyy-MM-dd"), description: "", amount: 0 }])
  }

  const handleSave = (index: number) => {
    const entry = newEntries[index]
    onSave(entry)

    // Reset the form after saving
    const updatedEntries = [...newEntries]
    updatedEntries[index] = { date: format(new Date(), "yyyy-MM-dd"), description: "", amount: 0 }
    setNewEntries(updatedEntries)
  }

  return (
    <Card className="shadow-md border border-green-100">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <CardTitle className="flex items-center">
          <CalendarFull className="h-5 w-5 mr-2 text-green-600" />
          Jumaon Ka Chanda (Friday & Special Donations)
        </CardTitle>
        <CardDescription>
          Record donations collected on Fridays and special occasions like Shabe-Barat, Shabe-Mehraj, etc.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {isMobile ? (
            // Mobile view - improved layout with each field in a single row
            <div className="space-y-6">
              {hasData && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Saved Entries</h3>
                  {data.map((item, index) => (
                    <div key={item.id || `saved-${index}`} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <Label className="text-xs text-gray-500">Date</Label>
                          <p className="font-medium">{format(new Date(item.date), "dd MMM yyyy")}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Description</Label>
                          <p>{item.description}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Amount</Label>
                          <p className="font-medium">Rs. {item.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!hasData && (
                <div className="text-center py-4 text-muted-foreground bg-gray-50 rounded-md">
                  No donations recorded for this month. Add a new entry below.
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Add New Entry</h3>
                {newEntries.map((entry, index) => (
                  <div key={`new-${index}`} className="space-y-3 p-3 bg-green-50 rounded-md border border-green-100">
                    <div className="space-y-2">
                      <Label htmlFor={`date-${index}`}>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id={`date-${index}`}
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {entry.date ? format(new Date(entry.date), "dd MMM yyyy") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={entry.date ? new Date(entry.date) : undefined}
                            onSelect={(date) => handleDateChange(index, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Input
                        id={`description-${index}`}
                        placeholder="Description (e.g., Friday Chanda, Shabe-Barat)"
                        value={entry.description}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`amount-${index}`}>Amount (Rs.)</Label>
                      <Input
                        id={`amount-${index}`}
                        type="number"
                        placeholder="Amount"
                        value={entry.amount || ""}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                      />
                    </div>

                    <Button
                      className="w-full"
                      variant="default"
                      size="sm"
                      onClick={() => handleSave(index)}
                      disabled={!entry.date || entry.amount <= 0}
                    >
                      <Save className="h-4 w-4 mr-1" /> Save Entry
                    </Button>
                  </div>
                ))}

                <Button variant="outline" onClick={handleAddRow} className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Another Entry
                </Button>
              </div>
            </div>
          ) : (
            // Desktop view
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount (Rs.)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!hasData && newEntries.length === 1 && newEntries[0].amount === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No donations recorded for this month. Add a new entry below.
                    </TableCell>
                  </TableRow>
                )}

                {hasData &&
                  data.map((item, index) => (
                    <TableRow key={item.id || `saved-${index}`}>
                      <TableCell>{format(new Date(item.date), "dd MMM yyyy")}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.amount.toLocaleString()}</TableCell>
                      <TableCell>Saved</TableCell>
                    </TableRow>
                  ))}

                {newEntries.map((entry, index) => (
                  <TableRow key={`new-${index}`}>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {entry.date ? format(new Date(entry.date), "dd MMM yyyy") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={entry.date ? new Date(entry.date) : undefined}
                            onSelect={(date) => handleDateChange(index, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Description (e.g., Friday Chanda, Shabe-Barat)"
                        value={entry.description}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={entry.amount || ""}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSave(index)}
                        disabled={!entry.date || entry.amount <= 0}
                      >
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isMobile && (
            <Button variant="outline" onClick={handleAddRow}>
              <Plus className="h-4 w-4 mr-1" /> Add Row
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-green-50 border-t border-green-100">
        <div className="text-lg font-semibold">Total Jumaon Ka Chanda:</div>
        <div className="text-lg font-semibold">Rs. {(total || 0).toLocaleString()}</div>
      </CardFooter>
    </Card>
  )
}

