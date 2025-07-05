// utils/generateTicketPDF.js
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';

export const generateTicketPDF = async (booking) => {
  const {
    customerName = 'Customer',
    busNumber = 'N/A',
    route = {},
    seatNumbers = [],
    departureTime = 'N/A',
    date = null,
    bookingId = 'TICKET123456'
  } = booking;

  const ticketId = bookingId.slice(-6).toUpperCase();

  // Create a canvas to render barcode
  const barcodeCanvas = document.createElement('canvas');
  JsBarcode(barcodeCanvas, ticketId, {
    format: 'CODE128',
    width: 2,
    height: 40,
    displayValue: false
  });

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85, 140] });

  // Border
  doc.setLineWidth(0.5);
  doc.rect(5, 5, 130, 75);

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Falcon Superline - Bus Ticket', 70, 15, { align: 'center' });

  // Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ticket ID: ${ticketId}`, 10, 25);
  doc.text(`Customer: ${customerName}`, 10, 33);
  doc.text(`Bus No: ${busNumber}`, 10, 41);
  doc.text(`Date: ${date ? new Date(date).toLocaleDateString() : 'N/A'}`, 10, 49);
  doc.text(`Departure: ${route.mainTown || 'N/A'} at ${departureTime}`, 10, 57);
  doc.text(`Arrival: ${route.secondaryTown || 'N/A'}`, 10, 65);
  doc.text(`Seats: ${Array.isArray(seatNumbers) ? seatNumbers.join(', ') : 'N/A'}`, 10, 73);

  // Barcode
  const barcodeImg = barcodeCanvas.toDataURL('image/png');
  doc.addImage(barcodeImg, 'PNG', 100, 55, 30, 10);

  // Download
  doc.save(`Ticket_${ticketId}.pdf`);
};
