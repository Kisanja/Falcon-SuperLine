import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo1.png'; // Adjust path if needed

export const generateIncomePDF = (incomeData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 🔸 Border
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

  // 🔸 Logo
  doc.addImage(logo, 'PNG', pageWidth / 2 - 15, 12, 30, 20);

  // 🔸 Company Name
  const companyNameY = 38;
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 80);
  doc.setFont(undefined, 'bold');
  doc.text('Falcon Superline Pvt Ltd', pageWidth / 2, companyNameY, { align: 'center' });

  // 🔸 Contact Info
  const contactY = companyNameY + 6;
  doc.setFontSize(9.5);
  doc.setTextColor(60);
  doc.setFont(undefined, 'normal');
  doc.text(
    'Email: falcon.superline@example.com  |  Address: No. 123, Colombo  |  Contact: +94 77 123 4567',
    pageWidth / 2,
    contactY,
    { align: 'center' }
  );

  // 🔸 Separator Line
  doc.setDrawColor(180);
  doc.line(10, contactY + 6, pageWidth - 10, contactY + 6);

  // 🔸 PDF Title
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.setFont(undefined, 'bold');
  doc.text('Income Report', pageWidth / 2, contactY + 14, { align: 'center' });

  // 🔸 Table Content
  const headers = [['Title', 'Sub Type', 'Date', 'Amount']];
  const rows = incomeData.map((item) => [
    item.title,
    item.subType,
    item.date?.slice(0, 10),
    `Rs. ${item.amount.toFixed(2)}`
  ]);

  // 🔸 Total Income Calculation
  const totalIncome = incomeData.reduce((acc, item) => acc + Number(item.amount || 0), 0);

  // 🔸 AutoTable
  autoTable(doc, {
    startY: contactY + 20,
    head: headers,
    body: rows,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [28, 28, 46],
      textColor: [255, 255, 255],
    },
    margin: { left: 10, right: 10 },
  });

  // 🔸 Add Total Income at Bottom
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Total Income: Rs. ${totalIncome.toFixed(2)}`, pageWidth - 20, finalY, {
    align: 'right'
  });

  // 🔸 Save PDF
  doc.save('income-report.pdf');
};
