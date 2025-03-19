"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Download, FileCheck } from "lucide-react"
import { format } from "date-fns"
import type { JumaChanda, Expense, BillBookData, SalaryData } from "./finance-manager"

interface PDFGeneratorProps {
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
  isMobile: boolean
}

export default function PDFGenerator({
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
  isMobile,
}: PDFGeneratorProps) {
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
    <>
      <Card className="mt-6 bg-green-50 border-green-200 shadow-md">
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

      {/* Hidden PDF template that will be captured by html2canvas */}
      <div className="hidden">
        <div ref={reportRef} className="pdf-container">
          <div className="pdf-header">
            <h1 className="pdf-title">Masjid Finance Report</h1>
            <p className="pdf-subtitle">For the Month of {format(new Date(`${month}-01`), "MMMM yyyy")}</p>
          </div>

          {/* Jumaon Ka Chanda Section */}
          <div className="pdf-section">
            <h2 className="pdf-section-title">Jumaon Ka Chanda (Friday & Special Donations)</h2>
            <table className="pdf-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {jumaonKaChanda.map((item, index) => (
                  <tr key={`chanda-${index}`}>
                    <td>{format(new Date(item.date), "dd MMM yyyy")}</td>
                    <td>{item.description}</td>
                    <td>{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pdf-summary-row">
              <span className="pdf-summary-label">Total Jumaon Ka Chanda:</span>
              <span className="pdf-summary-value">Rs. {totalJumaChanda.toLocaleString()}</span>
            </div>
          </div>

          {/* Kharcha Section */}
          <div className="pdf-section">
            <h2 className="pdf-section-title">Kharcha (Expenses)</h2>
            <table className="pdf-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Expense Name</th>
                  <th>Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {kharcha.map((item, index) => (
                  <tr key={`expense-${index}`}>
                    <td>{format(new Date(item.date), "dd MMM yyyy")}</td>
                    <td>{item.name}</td>
                    <td>{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pdf-summary-row">
              <span className="pdf-summary-label">Total Kharcha:</span>
              <span className="pdf-summary-value">Rs. {totalKharcha.toLocaleString()}</span>
            </div>
          </div>

          {/* Bill Book Section */}
          <div className="pdf-section">
            <h2 className="pdf-section-title">Bill Book</h2>
            <div className="pdf-summary-row">
              <span className="pdf-summary-label">Bill Book Numbers:</span>
              <span className="pdf-summary-value">
                {billBook.from} to {billBook.to}
              </span>
            </div>
            <div className="pdf-summary-row">
              <span className="pdf-summary-label">Total Chanda from Bill Book:</span>
              <span className="pdf-summary-value">Rs. {billBook.total_chanda.toLocaleString()}</span>
            </div>
          </div>

          {/* Balance Calculation */}
          <div className="pdf-section">
            <h2 className="pdf-section-title">Balance Calculation</h2>
            <div className="pdf-summary-row">
              <span className="pdf-summary-label">Old Balance:</span>
              <span className="pdf-summary-value">Rs. {oldBalance.toLocaleString()}</span>
            </div>
            <div className="pdf-summary-row">
              <span className="pdf-summary-label">Total Jumaon Ka Chanda:</span>
              <span className="pdf-summary-value">Rs. {totalJumaChanda.toLocaleString()}</span>
            </div>
            <div className="pdf-summary-row">
              <span className="pdf-summary-label">Total Chanda from Bill Book:</span>
              <span className="pdf-summary-value">Rs. {billBook.total_chanda.toLocaleString()}</span>
            </div>
            <div className="pdf-summary-row">
              <span className="pdf-summary-label">Total Balance Before Expenses & Salary:</span>
              <span className="pdf-summary-value">Rs. {totalBeforeExpenses.toLocaleString()}</span>
            </div>
          </div>

          {/* Salary Section */}
          <div className="pdf-section">
            <h2 className="pdf-section-title">Salaries</h2>
            <table className="pdf-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Imam</td>
                  <td>{imamSalary.date ? format(new Date(imamSalary.date), "dd MMM yyyy") : "N/A"}</td>
                  <td>{imamSalary.amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Mouzan</td>
                  <td>{mouzanSalary.date ? format(new Date(mouzanSalary.date), "dd MMM yyyy") : "N/A"}</td>
                  <td>{mouzanSalary.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div className="pdf-summary-row">
              <span className="pdf-summary-label">Total Salaries:</span>
              <span className="pdf-summary-value">
                Rs. {(imamSalary.amount + mouzanSalary.amount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Final Balance */}
          <div className="pdf-section">
            <h2 className="pdf-section-title">Final Balance</h2>
            <div className="pdf-final-balance">
              <div className="pdf-summary-row">
                <span className="pdf-summary-label">Total Balance Before Expenses & Salary:</span>
                <span className="pdf-summary-value">Rs. {totalBeforeExpenses.toLocaleString()}</span>
              </div>
              <div className="pdf-summary-row">
                <span className="pdf-summary-label">Total Expenses:</span>
                <span className="pdf-summary-value">- Rs. {totalKharcha.toLocaleString()}</span>
              </div>
              <div className="pdf-summary-row">
                <span className="pdf-summary-label">Total Salaries:</span>
                <span className="pdf-summary-value">
                  - Rs. {(imamSalary.amount + mouzanSalary.amount).toLocaleString()}
                </span>
              </div>
              <div className="pdf-summary-row">
                <span className="pdf-summary-label font-bold text-green-800">Final Balance:</span>
                <span className="pdf-summary-value text-green-800 text-lg">Rs. {finalBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Signature section will be added by jsPDF */}
          <div className="pdf-signature-section">
            <div className="pdf-signature-box">
              <p>Prepared By</p>
            </div>
            <div className="pdf-signature-box">
              <p>Sadar Sahab (Mohammed Azhar)</p>
            </div>
          </div>

          <div className="pdf-footer">
            This is an official financial report of the Masjid for the month of{" "}
            {format(new Date(`${month}-01`), "MMMM yyyy")}.
          </div>
        </div>
      </div>
    </>
  )
}

