"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Download, FileCheck } from "lucide-react"
import dynamic from "next/dynamic"
import type { JumaChanda, Expense, BillBookData, SalaryData } from "./finance-manager"

// Dynamically import the PDF components with SSR disabled
const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), { ssr: false })

const Document = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.Document), { ssr: false })

const Page = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.Page), { ssr: false })

const Text = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.Text), { ssr: false })

const View = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.View), { ssr: false })

const StyleSheet = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.StyleSheet), { ssr: false })

// Props for the PDF report
interface PDFReportProps {
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

// Props for the download button component
interface PDFDownloadButtonProps extends PDFReportProps {
  fileName: string
}

export default function PDFDownloadButton(props: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  // Only render on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" disabled>
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        Preparing PDF...
      </Button>
    )
  }

  // This component will be dynamically rendered only on the client
  const FinancialReportPDF = () => {
    // Create styles for PDF
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
        color: "#166534",
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

    // Format date for display
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getDate().toString().padStart(2, "0")} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`
    }

    const formattedMonth = new Date(`${props.month}-01`).toLocaleString("default", { month: "long", year: "numeric" })
    const today = new Date().toLocaleString("default", { day: "2-digit", month: "long", year: "numeric" })

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
              {props.jumaonKaChanda.map((item, index) => (
                <View style={styles.tableRow} key={`chanda-${index}`}>
                  <Text style={styles.tableCol}>{formatDate(item.date)}</Text>
                  <Text style={styles.tableCol}>{item.description}</Text>
                  <Text style={styles.tableCol}>{item.amount.toLocaleString()}</Text>
                </View>
              ))}
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Jumaon Ka Chanda:</Text>
              <Text style={styles.summaryValue}>Rs. {props.totalJumaChanda.toLocaleString()}</Text>
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
              {props.kharcha.map((item, index) => (
                <View style={styles.tableRow} key={`expense-${index}`}>
                  <Text style={styles.tableCol}>{formatDate(item.date)}</Text>
                  <Text style={styles.tableCol}>{item.name}</Text>
                  <Text style={styles.tableCol}>{item.amount.toLocaleString()}</Text>
                </View>
              ))}
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Kharcha:</Text>
              <Text style={styles.summaryValue}>Rs. {props.totalKharcha.toLocaleString()}</Text>
            </View>
          </View>

          {/* Bill Book Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bill Book</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bill Book Numbers:</Text>
              <Text style={styles.summaryValue}>
                {props.billBook.from} to {props.billBook.to}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Chanda from Bill Book:</Text>
              <Text style={styles.summaryValue}>Rs. {props.billBook.total_chanda.toLocaleString()}</Text>
            </View>
          </View>

          {/* Balance Calculation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Balance Calculation</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Old Balance:</Text>
              <Text style={styles.summaryValue}>Rs. {props.oldBalance.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Jumaon Ka Chanda:</Text>
              <Text style={styles.summaryValue}>Rs. {props.totalJumaChanda.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Chanda from Bill Book:</Text>
              <Text style={styles.summaryValue}>Rs. {props.billBook.total_chanda.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Balance Before Expenses & Salary:</Text>
              <Text style={styles.summaryValue}>Rs. {props.totalBeforeExpenses.toLocaleString()}</Text>
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
                <Text style={styles.tableCol}>{props.imamSalary.date ? formatDate(props.imamSalary.date) : "N/A"}</Text>
                <Text style={styles.tableCol}>{props.imamSalary.amount.toLocaleString()}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCol}>Mouzan</Text>
                <Text style={styles.tableCol}>
                  {props.mouzanSalary.date ? formatDate(props.mouzanSalary.date) : "N/A"}
                </Text>
                <Text style={styles.tableCol}>{props.mouzanSalary.amount.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Salaries:</Text>
              <Text style={styles.summaryValue}>
                Rs. {(props.imamSalary.amount + props.mouzanSalary.amount).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Final Balance */}
          <View style={[styles.section, styles.highlight]}>
            <Text style={styles.sectionTitle}>Final Balance</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Balance Before Expenses & Salary:</Text>
              <Text style={styles.summaryValue}>Rs. {props.totalBeforeExpenses.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Expenses:</Text>
              <Text style={styles.summaryValue}>- Rs. {props.totalKharcha.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Salaries:</Text>
              <Text style={styles.summaryValue}>
                - Rs. {(props.imamSalary.amount + props.mouzanSalary.amount).toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.finalBalance]}>Final Balance:</Text>
              <Text style={[styles.summaryValue, styles.finalBalance]}>Rs. {props.finalBalance.toLocaleString()}</Text>
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
            This is an official financial report of the Masjid for the month of {formattedMonth}. Generated on {today}
          </Text>
        </Page>
      </Document>
    )
  }

  return (
    <PDFDownloadLink document={<FinancialReportPDF />} fileName={props.fileName} className="block">
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
          console.error("PDF generation error:", error)
          return (
            <Button size="lg" variant="destructive">
              Error generating PDF
            </Button>
          )
        }

        return (
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsGenerated(true)}>
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
  )
}

