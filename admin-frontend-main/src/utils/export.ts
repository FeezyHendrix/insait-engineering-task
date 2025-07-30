import ExcelJS from 'exceljs'
import Papa from 'papaparse'
import { toast } from 'react-toastify'

export const handleTxtExport = (
  textData: string | ExcelJS.Buffer,
  filename: string,
  fileType: string = 'text/plain'
) => {
  const blob = new Blob([textData], { type: fileType })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export const handleExcelExport = async (
  data: Array<any>,
  filename: string,
  worksheet: string,
  type: 'xlsx' | 'csv' = 'xlsx'
) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet(worksheet)

  data.forEach((row) => {
    sheet.addRow(row)
  })

  const mimeType =
    type === 'xlsx'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv'

  let buffer = await workbook[type].writeBuffer()
  if (type === 'csv') {
    const BOM = new Uint8Array([0xef, 0xbb, 0xbf]) // UTF-8 BOM
    buffer = new Uint8Array([...BOM, ...new Uint8Array(buffer)])
  }
  const blob = new Blob([buffer], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export const exportCSV = (
  dataToExport: unknown[] | Papa.UnparseObject<unknown>
) => {
  const csv = Papa.unparse(dataToExport)
  const fileName =
    window.prompt('Enter filename for export:', 'valid_values.csv') ||
    'valid_values.csv'

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute(
    'download',
    fileName.endsWith('.csv') ? fileName : `${fileName}.csv`
  )
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  toast.success('CSV exported successfully.')
}
