"use client"

import { useEffect, useState } from "react"
import { ref, get, set, push, update } from "firebase/database"
import { Toaster, toast } from "sonner"
import MonthSelector from "./month-selector"
import { database } from "@/lib/firebase"
import JumaonKaChanda from "./jumaon-ka-chanda"
import Kharcha from "./kharcha"
import BillBook from "./bill-book"
import BalanceCalculation from "./balance-calculation"
import SalarySection from "./salary-section"
import FinalBalance from "./final-balance"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

// Data types
export type JumaChanda = {
  id?: string
  date: string
  description: string
  amount: number
}

export type Expense = {
  id?: string
  date: string
  name: string
  amount: number
}

export type BillBookData = {
  from: number
  to: number
  total_chanda: number
}

export type SalaryData = {
  date: string
  description: string
  amount: number
}

export type MonthData = {
  jumaon_ka_chanda: JumaChanda[]
  kharcha: Expense[]
  bill_book: BillBookData
  old_balance: number
  imam_salary: SalaryData
  mouzan_salary: SalaryData
  final_balance: number
}

export default function FinanceManager() {
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [monthData, setMonthData] = useState<MonthData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState<boolean>(true)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Set current month as default when component mounts
  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    setSelectedMonth(`${year}-${month}`)
  }, [])

  // Fetch data when month changes
  useEffect(() => {
    if (selectedMonth && initialized) {
      fetchMonthData(selectedMonth)
    }
  }, [selectedMonth, initialized])

  // Fetch data for selected month
  const fetchMonthData = async (month: string) => {
    setLoading(true)
    setError(null)
    try {
      const dbRef = ref(database, `masjid_finance/${month}`)
      const snapshot = await get(dbRef)

      if (snapshot.exists()) {
        const data = snapshot.val()

        // Convert object to array if needed
        const jumaon_ka_chanda = data.jumaon_ka_chanda
          ? Array.isArray(data.jumaon_ka_chanda)
            ? data.jumaon_ka_chanda
            : Object.entries(data.jumaon_ka_chanda).map(([id, value]) => ({
                id,
                ...(value as any),
              }))
          : []

        // Convert object to array if needed
        const kharcha = data.kharcha
          ? Array.isArray(data.kharcha)
            ? data.kharcha
            : Object.entries(data.kharcha).map(([id, value]) => ({
                id,
                ...(value as any),
              }))
          : []

        setMonthData({
          ...data,
          jumaon_ka_chanda,
          kharcha,
          bill_book: data.bill_book || { from: 0, to: 0, total_chanda: 0 },
          old_balance: data.old_balance || 0,
          imam_salary: data.imam_salary || { date: "", description: "Imam Salary", amount: 0 },
          mouzan_salary: data.mouzan_salary || { date: "", description: "Mouzan Salary", amount: 0 },
          final_balance: data.final_balance || 0,
        })
        toast.success("Data loaded successfully")
      } else {
        // Initialize with empty data if no data exists for the month
        setMonthData({
          jumaon_ka_chanda: [],
          kharcha: [],
          bill_book: { from: 0, to: 0, total_chanda: 0 },
          old_balance: 0,
          imam_salary: { date: "", description: "Imam Salary", amount: 0 },
          mouzan_salary: { date: "", description: "Mouzan Salary", amount: 0 },
          final_balance: 0,
        })
        toast.info("No data found for this month. Starting with fresh entries.")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to fetch data. Please check your connection and try again.")
      toast.error("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  // Save Jumaon Ka Chanda entry
  const saveJumaChanda = async (item: JumaChanda) => {
    if (!selectedMonth || !initialized) return

    try {
      if (item.id) {
        // Update existing entry
        const updates = {}
        updates[`masjid_finance/${selectedMonth}/jumaon_ka_chanda/${item.id}`] = {
          date: item.date,
          description: item.description,
          amount: item.amount,
        }
        await update(ref(database), updates)
        toast.success("Donation updated successfully")
      } else {
        // Add new entry
        const chandaRef = ref(database, `masjid_finance/${selectedMonth}/jumaon_ka_chanda`)
        await push(chandaRef, {
          date: item.date,
          description: item.description,
          amount: item.amount,
        })
        toast.success("Donation added successfully")
      }

      // Refresh data
      fetchMonthData(selectedMonth)
    } catch (error) {
      console.error("Error saving Jumaon Ka Chanda:", error)
      setError("Failed to save donation. Please try again.")
      toast.error("Failed to save donation")
    }
  }

  // Save Kharcha (Expense) entry
  const saveKharcha = async (item: Expense) => {
    if (!selectedMonth || !initialized) return

    try {
      if (item.id) {
        // Update existing entry
        const updates = {}
        updates[`masjid_finance/${selectedMonth}/kharcha/${item.id}`] = {
          date: item.date,
          name: item.name,
          amount: item.amount,
        }
        await update(ref(database), updates)
        toast.success("Expense updated successfully")
      } else {
        // Add new entry
        const kharchaRef = ref(database, `masjid_finance/${selectedMonth}/kharcha`)
        await push(kharchaRef, {
          date: item.date,
          name: item.name,
          amount: item.amount,
        })
        toast.success("Expense added successfully")
      }

      // Refresh data
      fetchMonthData(selectedMonth)
    } catch (error) {
      console.error("Error saving Kharcha:", error)
      setError("Failed to save expense. Please try again.")
      toast.error("Failed to save expense")
    }
  }

  // Save Bill Book data
  const saveBillBook = async (data: BillBookData) => {
    if (!selectedMonth || !initialized) return

    try {
      const billBookRef = ref(database, `masjid_finance/${selectedMonth}/bill_book`)
      await set(billBookRef, data)
      toast.success("Bill book data saved successfully")

      // Refresh data
      fetchMonthData(selectedMonth)
    } catch (error) {
      console.error("Error saving Bill Book:", error)
      setError("Failed to save bill book data. Please try again.")
      toast.error("Failed to save bill book data")
    }
  }

  // Save Old Balance
  const saveOldBalance = async (amount: number) => {
    if (!selectedMonth || !initialized) return

    try {
      const balanceRef = ref(database, `masjid_finance/${selectedMonth}/old_balance`)
      await set(balanceRef, amount)
      toast.success("Old balance saved successfully")

      // Refresh data
      fetchMonthData(selectedMonth)
    } catch (error) {
      console.error("Error saving Old Balance:", error)
      setError("Failed to save old balance. Please try again.")
      toast.error("Failed to save old balance")
    }
  }

  // Save Salary data
  const saveSalary = async (type: "imam" | "mouzan", data: SalaryData) => {
    if (!selectedMonth || !initialized) return

    try {
      const salaryRef = ref(database, `masjid_finance/${selectedMonth}/${type}_salary`)
      await set(salaryRef, data)
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} salary saved successfully`)

      // Refresh data
      fetchMonthData(selectedMonth)
    } catch (error) {
      console.error(`Error saving ${type} salary:`, error)
      setError(`Failed to save ${type} salary. Please try again.`)
      toast.error(`Failed to save ${type} salary`)
    }
  }

  // Calculate and save final balance
  const calculateAndSaveFinalBalance = async () => {
    if (!monthData || !selectedMonth || !initialized) return

    try {
      // Calculate total Jumaon Ka Chanda
      const totalJumaChanda = monthData.jumaon_ka_chanda
        ? monthData.jumaon_ka_chanda.reduce((sum, item) => sum + (item.amount || 0), 0)
        : 0

      // Calculate total Kharcha (Expenses)
      const totalKharcha = monthData.kharcha ? monthData.kharcha.reduce((sum, item) => sum + (item.amount || 0), 0) : 0

      // Get Bill Book total
      const billBookTotal = monthData.bill_book?.total_chanda || 0

      // Get Old Balance
      const oldBalance = monthData.old_balance || 0

      // Get Salaries
      const imamSalary = monthData.imam_salary?.amount || 0
      const mouzanSalary = monthData.mouzan_salary?.amount || 0

      // Calculate final balance
      const totalBeforeExpenses = oldBalance + totalJumaChanda + billBookTotal
      const finalBalance = totalBeforeExpenses - (totalKharcha + imamSalary + mouzanSalary)

      // Save to Firebase
      const finalBalanceRef = ref(database, `masjid_finance/${selectedMonth}/final_balance`)
      await set(finalBalanceRef, finalBalance)
      toast.success("Final balance calculated and saved successfully")

      // Refresh data
      fetchMonthData(selectedMonth)
    } catch (error) {
      console.error("Error calculating final balance:", error)
      setError("Failed to calculate and save final balance. Please try again.")
      toast.error("Failed to calculate final balance")
    }
  }

  // Calculate totals for display
  const calculateTotals = () => {
    if (!monthData) return { totalJumaChanda: 0, totalKharcha: 0, totalBeforeExpenses: 0, finalBalance: 0 }

    // Ensure jumaon_ka_chanda is an array before using reduce
    const totalJumaChanda = Array.isArray(monthData.jumaon_ka_chanda)
      ? monthData.jumaon_ka_chanda.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
      : 0

    // Ensure kharcha is an array before using reduce
    const totalKharcha = Array.isArray(monthData.kharcha)
      ? monthData.kharcha.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
      : 0

    const billBookTotal = monthData.bill_book?.total_chanda || 0
    const oldBalance = monthData.old_balance || 0
    const imamSalary = monthData.imam_salary?.amount || 0
    const mouzanSalary = monthData.mouzan_salary?.amount || 0

    const totalBeforeExpenses = oldBalance + totalJumaChanda + billBookTotal
    const finalBalance = totalBeforeExpenses - (totalKharcha + imamSalary + mouzanSalary)

    return { totalJumaChanda, totalKharcha, totalBeforeExpenses, finalBalance }
  }

  const totals = calculateTotals()

  if (!initialized && !error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 font-medium">Initializing Firebase...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />

      <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 font-medium">Loading data...</span>
        </div>
      ) : (
        <>
          <JumaonKaChanda
            data={monthData?.jumaon_ka_chanda || []}
            onSave={saveJumaChanda}
            total={totals.totalJumaChanda}
            isMobile={isMobile}
          />

          <Kharcha
            data={monthData?.kharcha || []}
            onSave={saveKharcha}
            total={totals.totalKharcha}
            isMobile={isMobile}
          />

          <BillBook
            data={monthData?.bill_book || { from: 0, to: 0, total_chanda: 0 }}
            onSave={saveBillBook}
            isMobile={isMobile}
          />

          <BalanceCalculation
            selectedMonth={selectedMonth}
            oldBalance={monthData?.old_balance || 0}
            totalJumaChanda={totals.totalJumaChanda}
            billBookTotal={monthData?.bill_book?.total_chanda || 0}
            totalBeforeExpenses={totals.totalBeforeExpenses}
            onSaveOldBalance={saveOldBalance}
            isMobile={isMobile}
          />

          <SalarySection
            imamSalary={monthData?.imam_salary || { date: "", description: "Imam Salary", amount: 0 }}
            mouzanSalary={monthData?.mouzan_salary || { date: "", description: "Mouzan Salary", amount: 0 }}
            onSaveImamSalary={(data) => saveSalary("imam", data)}
            onSaveMouzanSalary={(data) => saveSalary("mouzan", data)}
            isMobile={isMobile}
          />

          <FinalBalance
            month={selectedMonth}
            jumaonKaChanda={monthData?.jumaon_ka_chanda || []}
            kharcha={monthData?.kharcha || []}
            billBook={monthData?.bill_book || { from: 0, to: 0, total_chanda: 0 }}
            oldBalance={monthData?.old_balance || 0}
            imamSalary={monthData?.imam_salary || { date: "", description: "Imam Salary", amount: 0 }}
            mouzanSalary={monthData?.mouzan_salary || { date: "", description: "Mouzan Salary", amount: 0 }}
            totalBeforeExpenses={totals.totalBeforeExpenses}
            totalExpenses={totals.totalKharcha}
            imamSalaryAmount={monthData?.imam_salary?.amount || 0}
            mouzanSalaryAmount={monthData?.mouzan_salary?.amount || 0}
            finalBalance={totals.finalBalance}
            onCalculateAndSave={calculateAndSaveFinalBalance}
            isMobile={isMobile}
          />
        </>
      )}
    </div>
  )
}

