import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo1.png'; // Adjust if needed

export const generateBusSummary = (assignments) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 🔷 Draw Border
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

  // 🖼 Logo
  doc.addImage(logo, 'PNG', pageWidth / 2 - 15, 12, 30, 20);

  // 🏢 Company Name
  const companyNameY = 38;
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 80);
  doc.setFont(undefined, 'bold');
  doc.text('Falcon Superline Pvt Ltd', pageWidth / 2, companyNameY, { align: 'center' });

  // 📞 Contact Info
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

  // 🔻 Line
  doc.setDrawColor(180);
  doc.line(10, contactY + 6, pageWidth - 10, contactY + 6);

  // 📄 Title
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.setFont(undefined, 'bold');
  doc.text('Bus Route Assignments Summary', pageWidth / 2, contactY + 14, { align: 'center' });

  // 📋 Table Data (without time)
  const headers = [[
    'Bus Number',
    'Departure',
    'Arrival',
    'Driver',
    'Conductor',
    'Garage'
  ]];

  const rows = assignments.map(a => [
    a.busId?.busNumber || 'N/A',
    a.routeId?.mainTown || 'N/A',
    a.routeId?.secondaryTown || 'N/A',
    a.busId?.assignedDriver?.name || 'Not assigned',
    a.busId?.assignedConductor?.name || 'Not assigned',
    a.busId?.assignedGarage?.name || 'Not assigned'
  ]);

  autoTable(doc, {
    startY: contactY + 20,
    head: headers,
    body: rows,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [28, 28, 46],
      textColor: [255, 255, 255],
    },
    margin: { left: 10, right: 10 },
  });

  doc.save('bus-summary.pdf');
};
