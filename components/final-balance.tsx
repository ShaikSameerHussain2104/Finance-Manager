"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalculatorIcon } from "lucide-react"
import dynamic from "next/dynamic"
import type { JumaChanda, Expense, BillBookData, SalaryData } from "./finance-manager"

// Dynamically import the PDF generator with SSR disabled
const PDFGenerator = dynamic(() => import("./pdf-generator"), { ssr: false })

interface FinalBalanceProps {
  month: string
  jumaonKaChanda: JumaChanda[]
  kharcha: Expense[]
  billBook: BillBookData
  oldBalance: number
  imamSalary: SalaryData
  mouzanSalary: SalaryData
  totalBeforeExpenses: number
  totalExpenses: number
  imamSalaryAmount: number
  mouzanSalaryAmount: number
  finalBalance: number
  onCalculateAndSave: () => void
  isMobile: boolean
}

export default function FinalBalance({
  month,
  jumaonKaChanda,
  kharcha,
  billBook,
  oldBalance,
  imamSalary,
  mouzanSalary,
  totalBeforeExpenses,
  totalExpenses,
  imamSalaryAmount,
  mouzanSalaryAmount,
  finalBalance,
  onCalculateAndSave,
  isMobile,
}: FinalBalanceProps) {
  const [hasCalculated, setHasCalculated] = useState(false)
  const totalSalaries = imamSalaryAmount + mouzanSalaryAmount
  const totalDeductions = totalExpenses + totalSalaries

  // Update the handleCalculateAndSave function to ensure the PDF button is visible
  const handleCalculateAndSave = () => {
    onCalculateAndSave()
    setHasCalculated(true)
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-white to-green-50 shadow-md border border-green-100">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <CalculatorIcon className="h-5 w-5 mr-2" />
            Final Balance Calculation
          </CardTitle>
          <CardDescription className="text-green-50">
            Final balance after deducting all expenses and salaries
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2">
                  <span className="font-medium text-gray-700">Total Balance Before Expenses & Salary:</span>
                  <span className="font-bold text-lg text-green-700">Rs. {totalBeforeExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700 border-t pt-2 border-dashed border-gray-200">
                  <span className="font-medium text-red-600">Total Expenses:</span>
                  <span className="font-bold text-red-600">- Rs. {totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium text-red-600">Imam Salary:</span>
                  <span className="font-bold text-red-600">- Rs. {imamSalaryAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium text-red-600">Mouzan Salary:</span>
                  <span className="font-bold text-red-600">- Rs. {mouzanSalaryAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-medium">Total Deductions:</span>
                  <span className="font-bold">Rs. {totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-100 p-6 rounded-xl shadow-inner border border-green-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-green-800">Final Balance:</h3>
                <span className="text-2xl font-bold text-green-700">Rs. {finalBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pb-6">
          <Button
            onClick={handleCalculateAndSave}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transition-all hover:shadow-xl"
          >
            <CalculatorIcon className="h-5 w-5 mr-2" />
            {hasCalculated ? "Recalculate & Save" : "Calculate & Save Final Balance"}
          </Button>
        </CardFooter>
      </Card>

      {/* Client-side only PDF generator */}
      {hasCalculated && (
        <PDFGenerator
          month={month}
          jumaonKaChanda={jumaonKaChanda}
          kharcha={kharcha}
          billBook={billBook}
          oldBalance={oldBalance}
          imamSalary={imamSalary}
          mouzanSalary={mouzanSalary}
          totalJumaChanda={jumaonKaChanda.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)}
          totalKharcha={totalExpenses}
          totalBeforeExpenses={totalBeforeExpenses}
          finalBalance={finalBalance}
          showDownloadButton={true}
          isMobile={isMobile}
        />
      )}
    </>
  )
}

