"use client"

import { useState } from "react"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Download, FileCheck } from "lucide-react"
import type { JumaChanda, Expense, BillBookData, SalaryData } from "./finance-manager"

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#166534", // primary color
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: "#4b5563",
    textAlign: "center",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#f3f4f6",
    padding: 5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableColHeader: {
    backgroundColor: "#f9fafb",
    fontWeight: "bold",
    padding: 5,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
    width: "33.33%",
  },
  tableCol: {
    padding: 5,
    borderStyle: "solid",
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
    width: "33.33%",
    fontSize: 10,
  },
  summaryRow: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
  },
  summaryLabel: {
    width: "70%",
    fontSize: 12,
  },
  summaryValue: {
    width: "30%",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
  },
  signatureSection: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    width: 150,
    textAlign: "center",
    paddingTop: 5,
  },
  signatureLabel: {
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: "#6b7280",
  },
  stamp: {
    position: "absolute",
    bottom: 100,
    right: 50,
    width: 100,
    height: 100,
    opacity: 0.2,
  },
  highlight: {
    backgroundColor: "#f0fdf4",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  finalBalance: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#166534",
  },
})

// PDF Document Component
interface FinancialReportProps {
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
}

const FinancialReport = ({
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
}: FinancialReportProps) => {
  // Format date for display
  const formattedMonth = format(new Date(`${month}-01`), "MMMM yyyy")

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Masjid Finance Report</Text>
          <Text style={styles.subtitle}>For the Month of {formattedMonth}</Text>
        </View>

        {/* Jumaon Ka Chanda Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jumaon Ka Chanda (Friday & Special Donations)</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Date</Text>
              <Text style={styles.tableColHeader}>Description</Text>
              <Text style={styles.tableColHeader}>Amount (Rs.)</Text>
            </View>
            {jumaonKaChanda.map((item, index) => (
              <View style={styles.tableRow} key={`chanda-${index}`}>
                <Text style={styles.tableCol}>{format(new Date(item.date), "dd MMM yyyy")}</Text>
                <Text style={styles.tableCol}>{item.description}</Text>
                <Text style={styles.tableCol}>{item.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Jumaon Ka Chanda:</Text>
            <Text style={styles.summaryValue}>Rs. {totalJumaChanda.toLocaleString()}</Text>
          </View>
        </View>

        {/* Kharcha Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kharcha (Expenses)</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Date</Text>
              <Text style={styles.tableColHeader}>Expense Name</Text>
              <Text style={styles.tableColHeader}>Amount (Rs.)</Text>
            </View>
            {kharcha.map((item, index) => (
              <View style={styles.tableRow} key={`expense-${index}`}>
                <Text style={styles.tableCol}>{format(new Date(item.date), "dd MMM yyyy")}</Text>
                <Text style={styles.tableCol}>{item.name}</Text>
                <Text style={styles.tableCol}>{item.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Kharcha:</Text>
            <Text style={styles.summaryValue}>Rs. {totalKharcha.toLocaleString()}</Text>
          </View>
        </View>

        {/* Bill Book Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Book</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Bill Book Numbers:</Text>
            <Text style={styles.summaryValue}>
              {billBook.from} to {billBook.to}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Chanda from Bill Book:</Text>
            <Text style={styles.summaryValue}>Rs. {billBook.total_chanda.toLocaleString()}</Text>
          </View>
        </View>

        {/* Balance Calculation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balance Calculation</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Old Balance:</Text>
            <Text style={styles.summaryValue}>Rs. {oldBalance.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Jumaon Ka Chanda:</Text>
            <Text style={styles.summaryValue}>Rs. {totalJumaChanda.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Chanda from Bill Book:</Text>
            <Text style={styles.summaryValue}>Rs. {billBook.total_chanda.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Balance Before Expenses & Salary:</Text>
            <Text style={styles.summaryValue}>Rs. {totalBeforeExpenses.toLocaleString()}</Text>
          </View>
        </View>

        {/* Salary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salaries</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Role</Text>
              <Text style={styles.tableColHeader}>Date</Text>
              <Text style={styles.tableColHeader}>Amount (Rs.)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Imam</Text>
              <Text style={styles.tableCol}>
                {imamSalary.date ? format(new Date(imamSalary.date), "dd MMM yyyy") : "N/A"}
              </Text>
              <Text style={styles.tableCol}>{imamSalary.amount.toLocaleString()}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Mouzan</Text>
              <Text style={styles.tableCol}>
                {mouzanSalary.date ? format(new Date(mouzanSalary.date), "dd MMM yyyy") : "N/A"}
              </Text>
              <Text style={styles.tableCol}>{mouzanSalary.amount.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Salaries:</Text>
            <Text style={styles.summaryValue}>Rs. {(imamSalary.amount + mouzanSalary.amount).toLocaleString()}</Text>
          </View>
        </View>

        {/* Final Balance */}
        <View style={[styles.section, styles.highlight]}>
          <Text style={styles.sectionTitle}>Final Balance</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Balance Before Expenses & Salary:</Text>
            <Text style={styles.summaryValue}>Rs. {totalBeforeExpenses.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Expenses:</Text>
            <Text style={styles.summaryValue}>- Rs. {totalKharcha.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Salaries:</Text>
            <Text style={styles.summaryValue}>- Rs. {(imamSalary.amount + mouzanSalary.amount).toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.finalBalance]}>Final Balance:</Text>
            <Text style={[styles.summaryValue, styles.finalBalance]}>Rs. {finalBalance.toLocaleString()}</Text>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Prepared By</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Sadar Sahab (Mohammed Azhar)</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          This is an official financial report of the Masjid for the month of {formattedMonth}. Generated on{" "}
          {format(new Date(), "dd MMM yyyy")}
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}

// Component for PDF download button and preview
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

  if (!showDownloadButton) {
    return null
  }

  const formattedMonth = format(new Date(`${month}-01`), "MMMM_yyyy")
  const fileName = `Masjid_Financial_Report_${formattedMonth}.pdf`

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

          <PDFDownloadLink
            document={
              <FinancialReport
                month={month}
                jumaonKaChanda={jumaonKaChanda}
                kharcha={kharcha}
                billBook={billBook}
                oldBalance={oldBalance}
                imamSalary={imamSalary}
                mouzanSalary={mouzanSalary}
                totalJumaChanda={totalJumaChanda}
                totalKharcha={totalKharcha}
                totalBeforeExpenses={totalBeforeExpenses}
                finalBalance={finalBalance}
              />
            }
            fileName={fileName}
            className="block"
          >
            {({ loading, error }) => {
              if (loading) {
                return (
                  <Button size="lg" disabled className="bg-green-600 hover:bg-green-700 text-white">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Preparing PDF...
                  </Button>
                )
              }

              if (error) {
                return (
                  <Button size="lg" variant="destructive">
                    Error generating PDF
                  </Button>
                )
              }

              return (
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  {isGenerated ? (
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
              )
            }}
          </PDFDownloadLink>
        </div>
      </CardContent>
    </Card>
  )
}

