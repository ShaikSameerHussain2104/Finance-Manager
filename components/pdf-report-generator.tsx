"use client"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Download, Loader2, FileCheck } from "lucide-react"
import { useState, useRef } from "react"
import type { JumaChanda, Expense, BillBookData, SalaryData } from "./finance-manager"

interface PDFReportGeneratorProps {
  month: string
  jumaonKaChanda: JumaChanda[]
  kharcha: Expense[]
  billBook: BillBookData
  oldBalance: number
  imamSalary: SalaryData
  mouzanSalary: SalaryData
  totalJumaChanda: number
  totalKharcha: number
  totalBeforeExpenses: number
  finalBalance: number
  showDownloadButton: boolean
}

export default function PDFReportGenerator({
  month,
  jumaonKaChanda,
  kharcha,
  billBook,
  oldBalance,
  imamSalary,
  mouzanSalary,
  totalJumaChanda,
  totalKharcha,
  totalBeforeExpenses,
  finalBalance,
  showDownloadButton,
}: PDFReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  if (!showDownloadButton) {
    return null
  }

  const formattedMonth = format(new Date(`${month}-01`), "MMMM_yyyy")
  const fileName = `Masjid_Financial_Report_${formattedMonth}.pdf`

  // Generate PDF using jsPDF and html2canvas
  const generatePDF = async () => {
    if (!reportRef.current) return

    setIsGenerating(true)

    try {
      // Dynamically import the libraries to avoid SSR issues
      const jsPDF = (await import("jspdf")).default
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")

      // A4 size: 210 x 297 mm
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10 // Top margin

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      // Add signature section at the bottom
      const signatureY = pdfHeight - 40 // 40mm from bottom
      pdf.setDrawColor(0, 0, 0)
      pdf.setLineWidth(0.5)

      // Left signature
      pdf.line(20, signatureY, 80, signatureY)
      pdf.setFontSize(10)
      pdf.text("Prepared By", 35, signatureY + 5)

      // Right signature
      pdf.line(pdfWidth - 80, signatureY, pdfWidth - 20, signatureY)
      pdf.setFontSize(10)
      pdf.text("Sadar Sahab (Mohammed Azhar)", pdfWidth - 75, signatureY + 5)

      // Footer
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Generated on ${format(new Date(), "dd MMM yyyy")}`, pdfWidth / 2, pdfHeight - 10, { align: "center" })

      pdf.save(fileName)
      setIsGenerated(true)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="mt-6 bg-green-50 border-green-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 space-y-2">
            <h3 className="text-xl font-bold text-green-800">Financial Report Ready</h3>
            <p className="text-green-700">
              You can now download the financial report for {format(new Date(`${month}-01`), "MMMM yyyy")}
            </p>
          </div>

          <Button
            size="lg"
            onClick={generatePDF}
            disabled={isGenerating}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transition-all hover:shadow-xl"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : isGenerated ? (
              <>
                <FileCheck className="h-5 w-5 mr-2" />
                Download Again
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Download Financial Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

