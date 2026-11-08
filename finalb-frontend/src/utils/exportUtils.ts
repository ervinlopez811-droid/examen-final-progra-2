import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

const crearPdfBase = (tituloReporte: string) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Logo (cuadro azul institucional)
  doc.setFillColor(41, 128, 185);
  doc.rect(14, 10, 15, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('LOGO', 17, 19);

  // Título y Fecha
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(tituloReporte, 35, 18);

  const fechaActual = new Date().toLocaleString('es-GT');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de emisión: ${fechaActual}`, 35, 24);

  // Línea divisora
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 28, 283, 28);

  return doc;
};

export const exportarTablaPDF = (
  titulo: string,
  columnas: string[],
  filas: (string | number)[][],
  nombreArchivo: string
) => {
  const doc = crearPdfBase(titulo);

  autoTable(doc, {
    startY: 32,
    head: [columnas],
    body: filas,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14, right: 14 }
  });

  doc.save(`${nombreArchivo}.pdf`);
};

export const exportarTablaExcel = async (
  titulo: string,
  columnas: string[],
  filas: (string | number)[][],
  nombreArchivo: string
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(titulo);

  // Título
  worksheet.mergeCells('A1', `${String.fromCharCode(64 + columnas.length)}1`);
  const titleCell = worksheet.getCell('A1');
  titleCell.value = titulo;
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2980B9' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Encabezados
  const headerRow = worksheet.addRow(columnas);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '34495E' } };
  });

  // Datos
  filas.forEach((fila) => worksheet.addRow(fila));

  worksheet.columns.forEach((column) => {
    let maxLength = 12;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength + 3;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${nombreArchivo}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};