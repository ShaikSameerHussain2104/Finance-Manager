"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Plus, Save, Receipt } from "lucide-react"
import { format } from "date-fns"
import type { Expense } from "./finance-manager"
import { Label } from "@/components/ui/label"

interface KharchaProps {
  data: Expense[]
  onSave: (item: Expense) => void
  total: number
  isMobile: boolean
}

export default function Kharcha({ data = [], onSave, total = 0, isMobile }: KharchaProps) {
  const [newEntries, setNewEntries] = useState<Expense[]>([
    { date: format(new Date(), "yyyy-MM-dd"), name: "", amount: 0 },
  ])

  const hasData = Array.isArray(data) && data.length > 0

  const handleDateChange = (index: number, date: Date | undefined) => {
    if (!date) return

    const updatedEntries = [...newEntries]
    updatedEntries[index].date = format(date, "yyyy-MM-dd")
    setNewEntries(updatedEntries)
  }

  const handleNameChange = (index: number, name: string) => {
    const updatedEntries = [...newEntries]
    updatedEntries[index].name = name
    setNewEntries(updatedEntries)
  }

  const handleAmountChange = (index: number, amount: string) => {
    const updatedEntries = [...newEntries]
    updatedEntries[index].amount = Number.parseFloat(amount) || 0
    setNewEntries(updatedEntries)
  }

  const handleAddRow = () => {
    setNewEntries([...newEntries, { date: format(new Date(), "yyyy-MM-dd"), name: "", amount: 0 }])
  }

  const handleSave = (index: number) => {
    const entry = newEntries[index]
    onSave(entry)

    // Reset the form after saving
    const updatedEntries = [...newEntries]
    updatedEntries[index] = { date: format(new Date(), "yyyy-MM-dd"), name: "", amount: 0 }
    setNewEntries(updatedEntries)
  }

  return (
    <Card className="shadow-md border border-red-100">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
        <CardTitle className="flex items-center">
          <Receipt className="h-5 w-5 mr-2 text-red-600" />
          Kharcha (Expenses)
        </CardTitle>
        <CardDescription>Record all expenses for the month</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {isMobile ? (
            // Mobile view - improved layout with each field in a single row
            <div className="space-y-6">
              {hasData && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Saved Expenses</h3>
                  {data.map((item, index) => (
                    <div key={item.id || `saved-${index}`} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <Label className="text-xs text-gray-500">Date</Label>
                          <p className="font-medium">{format(new Date(item.date), "dd MMM yyyy")}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Expense Name</Label>
                          <p>{item.name}</p>
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
                  No expenses recorded for this month. Add a new entry below.
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Add New Expense</h3>
                {newEntries.map((entry, index) => (
                  <div key={`new-${index}`} className="space-y-3 p-3 bg-red-50 rounded-md border border-red-100">
                    <div className="space-y-2">
                      <Label htmlFor={`expense-date-${index}`}>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id={`expense-date-${index}`}
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
                      <Label htmlFor={`expense-name-${index}`}>Expense Name/Category</Label>
                      <Input
                        id={`expense-name-${index}`}
                        placeholder="Expense Name (e.g., Electricity Bill)"
                        value={entry.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`expense-amount-${index}`}>Amount (Rs.)</Label>
                      <Input
                        id={`expense-amount-${index}`}
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
                      disabled={!entry.date || !entry.name || entry.amount <= 0}
                    >
                      <Save className="h-4 w-4 mr-1" /> Save Expense
                    </Button>
                  </div>
                ))}

                <Button variant="outline" onClick={handleAddRow} className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Another Expense
                </Button>
              </div>
            </div>
          ) : (
            // Desktop view
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Expense Name</TableHead>
                  <TableHead>Amount (Rs.)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!hasData && newEntries.length === 1 && newEntries[0].amount === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No expenses recorded for this month. Add a new entry below.
                    </TableCell>
                  </TableRow>
                )}

                {hasData &&
                  data.map((item, index) => (
                    <TableRow key={item.id || `saved-${index}`}>
                      <TableCell>{format(new Date(item.date), "dd MMM yyyy")}</TableCell>
                      <TableCell>{item.name}</TableCell>
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
                        placeholder="Expense Name (e.g., Electricity Bill)"
                        value={entry.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
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
                        disabled={!entry.date || !entry.name || entry.amount <= 0}
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
      <CardFooter className="flex justify-between bg-red-50 border-t border-red-100">
        <div className="text-lg font-semibold">Total Expenses:</div>
        <div className="text-lg font-semibold">Rs. {(total || 0).toLocaleString()}</div>
      </CardFooter>
    </Card>
  )
}

