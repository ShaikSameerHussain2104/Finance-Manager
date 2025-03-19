"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Save, DollarSign } from "lucide-react"
import { format } from "date-fns"
import type { SalaryData } from "./finance-manager"
import { Label } from "@/components/ui/label"

interface SalarySectionProps {
  imamSalary: SalaryData
  mouzanSalary: SalaryData
  onSaveImamSalary: (data: SalaryData) => void
  onSaveMouzanSalary: (data: SalaryData) => void
  isMobile: boolean
}

export default function SalarySection({
  imamSalary,
  mouzanSalary,
  onSaveImamSalary,
  onSaveMouzanSalary,
  isMobile,
}: SalarySectionProps) {
  const [imam, setImam] = useState<SalaryData>({
    ...imamSalary,
    date: imamSalary.date || format(new Date(), "yyyy-MM-dd"),
    description: imamSalary.description || "Imam Salary",
    amount: imamSalary.amount || 0,
  })
  const [mouzan, setMouzan] = useState<SalaryData>({
    ...mouzanSalary,
    date: mouzanSalary.date || format(new Date(), "yyyy-MM-dd"),
    description: mouzanSalary.description || "Mouzan Salary",
    amount: mouzanSalary.amount || 0,
  })

  // Update local state when props change
  useEffect(() => {
    setImam({
      ...imamSalary,
      date: imamSalary.date || format(new Date(), "yyyy-MM-dd"),
      description: imamSalary.description || "Imam Salary",
      amount: imamSalary.amount || 0,
    })
    setMouzan({
      ...mouzanSalary,
      date: mouzanSalary.date || format(new Date(), "yyyy-MM-dd"),
      description: mouzanSalary.description || "Mouzan Salary",
      amount: mouzanSalary.amount || 0,
    })
  }, [imamSalary, mouzanSalary])

  const handleImamDateChange = (date: Date | undefined) => {
    if (!date) return
    setImam({ ...imam, date: format(date, "yyyy-MM-dd") })
  }

  const handleMouzanDateChange = (date: Date | undefined) => {
    if (!date) return
    setMouzan({ ...mouzan, date: format(date, "yyyy-MM-dd") })
  }

  const handleImamDescriptionChange = (description: string) => {
    setImam({ ...imam, description })
  }

  const handleMouzanDescriptionChange = (description: string) => {
    setMouzan({ ...mouzan, description })
  }

  const handleImamAmountChange = (amount: string) => {
    setImam({ ...imam, amount: Number.parseFloat(amount) || 0 })
  }

  const handleMouzanAmountChange = (amount: string) => {
    setMouzan({ ...mouzan, amount: Number.parseFloat(amount) || 0 })
  }

  return (
    <Card className="shadow-md border border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
          Imam & Mouzan Salary
        </CardTitle>
        <CardDescription>Record salary payments for Imam and Mouzan</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isMobile ? (
          // Mobile view - improved layout with each field in a single row
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Imam Salary</h3>
              <div className="space-y-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                <div className="space-y-2">
                  <Label htmlFor="imam-date">Payment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="imam-date" variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {imam.date ? format(new Date(imam.date), "dd MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={imam.date ? new Date(imam.date) : undefined}
                        onSelect={handleImamDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imam-description">Description (Optional)</Label>
                  <Input
                    id="imam-description"
                    placeholder="Description"
                    value={imam.description}
                    onChange={(e) => handleImamDescriptionChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imam-amount">Amount (Rs.)</Label>
                  <Input
                    id="imam-amount"
                    type="number"
                    placeholder="Amount"
                    value={imam.amount || ""}
                    onChange={(e) => handleImamAmountChange(e.target.value)}
                  />
                </div>

                <Button className="w-full" variant="default" onClick={() => onSaveImamSalary(imam)}>
                  <Save className="h-4 w-4 mr-1" /> Save Imam Salary
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Mouzan Salary</h3>
              <div className="space-y-3 p-3 bg-purple-50 rounded-md border border-purple-100">
                <div className="space-y-2">
                  <Label htmlFor="mouzan-date">Payment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="mouzan-date" variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {mouzan.date ? format(new Date(mouzan.date), "dd MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={mouzan.date ? new Date(mouzan.date) : undefined}
                        onSelect={handleMouzanDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mouzan-description">Description (Optional)</Label>
                  <Input
                    id="mouzan-description"
                    placeholder="Description"
                    value={mouzan.description}
                    onChange={(e) => handleMouzanDescriptionChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mouzan-amount">Amount (Rs.)</Label>
                  <Input
                    id="mouzan-amount"
                    type="number"
                    placeholder="Amount"
                    value={mouzan.amount || ""}
                    onChange={(e) => handleMouzanAmountChange(e.target.value)}
                  />
                </div>

                <Button className="w-full" variant="default" onClick={() => onSaveMouzanSalary(mouzan)}>
                  <Save className="h-4 w-4 mr-1" /> Save Mouzan Salary
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Desktop view
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount (Rs.)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Imam</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {imam.date ? format(new Date(imam.date), "dd MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={imam.date ? new Date(imam.date) : undefined}
                        onSelect={handleImamDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Description"
                    value={imam.description}
                    onChange={(e) => handleImamDescriptionChange(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={imam.amount || ""}
                    onChange={(e) => handleImamAmountChange(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => onSaveImamSalary(imam)}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mouzan</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {mouzan.date ? format(new Date(mouzan.date), "dd MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={mouzan.date ? new Date(mouzan.date) : undefined}
                        onSelect={handleMouzanDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Description"
                    value={mouzan.description}
                    onChange={(e) => handleMouzanDescriptionChange(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={mouzan.amount || ""}
                    onChange={(e) => handleMouzanAmountChange(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => onSaveMouzanSalary(mouzan)}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-between bg-blue-50 border-t border-blue-100">
        <div className="text-lg font-semibold">Total Salaries:</div>
        <div className="text-lg font-semibold">Rs. {(imam.amount + mouzan.amount).toLocaleString()}</div>
      </CardFooter>
    </Card>
  )
}

