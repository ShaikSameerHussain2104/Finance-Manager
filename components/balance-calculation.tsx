"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Calculator } from "lucide-react"
import { database } from "@/lib/firebase"
import { ref, get } from "firebase/database"

interface BalanceCalculationProps {
  selectedMonth: string
  oldBalance: number
  totalJumaChanda: number
  billBookTotal: number
  totalBeforeExpenses: number
  onSaveOldBalance: (amount: number) => void
  isMobile: boolean
}

export default function BalanceCalculation({
  selectedMonth,
  oldBalance,
  totalJumaChanda,
  billBookTotal,
  totalBeforeExpenses,
  onSaveOldBalance,
  isMobile,
}: BalanceCalculationProps) {
  const [balance, setBalance] = useState<number>(oldBalance)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch previous month's balance automatically
  useEffect(() => {
    const fetchPreviousMonthBalance = async () => {
      if (!selectedMonth) return

      try {
        setIsLoading(true)

        // Calculate previous month
        const currentDate = new Date(`${selectedMonth}-01`)
        currentDate.setMonth(currentDate.getMonth() - 1)
        const prevYear = currentDate.getFullYear()
        const prevMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0")
        const prevMonthKey = `${prevYear}-${prevMonth}`

        // Fetch previous month's final balance from Firebase
        const finalBalanceRef = ref(database, `masjid_finance/${prevMonthKey}/final_balance`)
        const snapshot = await get(finalBalanceRef)

        if (snapshot.exists()) {
          const prevBalance = snapshot.val()
          setBalance(prevBalance)
          // Also update in parent component
          onSaveOldBalance(prevBalance)
        }
      } catch (error) {
        console.error("Error fetching previous month balance:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPreviousMonthBalance()
  }, [selectedMonth, onSaveOldBalance])

  const handleSave = () => {
    onSaveOldBalance(balance)
    setIsSaved(true)

    // Reset the saved state after showing success animation
    setTimeout(() => {
      setIsSaved(false)
    }, 2000)
  }

  return (
    <Card className="border border-green-100 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b border-green-100">
        <CardTitle className="flex items-center text-green-800">
          <Calculator className="h-5 w-5 mr-2 text-green-600" />
          Balance Calculation
        </CardTitle>
        <CardDescription>Old balance and total balance before expenses & salary</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className={`${isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}`}>
            <div className="space-y-2">
              <Label htmlFor="old-balance" className="text-gray-700">
                Old Balance (Previous Month's Balance)
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="old-balance"
                  type="number"
                  placeholder="Enter old balance"
                  value={balance || ""}
                  onChange={(e) => setBalance(Number.parseFloat(e.target.value) || 0)}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <Button
                  onClick={handleSave}
                  className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md transition-all ${isSaved ? "success-pulse" : ""}`}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaved ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-5 rounded-md border border-green-100 shadow-inner">
            <h3 className="text-lg font-semibold mb-4 text-green-800">Total Balance Before Expenses & Salary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1 border-b border-dashed border-green-200">
                <span className="text-gray-700">Old Balance:</span>
                <span className="font-medium">Rs. {oldBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-dashed border-green-200">
                <span className="text-gray-700">Total Jumaon Ka Chanda:</span>
                <span className="font-medium">Rs. {totalJumaChanda.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-dashed border-green-200">
                <span className="text-gray-700">Total Chanda from Bill Book:</span>
                <span className="font-medium">Rs. {billBookTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-1">
                <span className="font-bold text-green-800">Total Balance Before Expenses & Salary:</span>
                <span className="font-bold text-lg text-green-700">Rs. {totalBeforeExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

