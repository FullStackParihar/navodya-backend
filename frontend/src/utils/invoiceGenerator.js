import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates and downloads a premium PDF invoice for an order
 * @param {Object} order - The order document from backend
 */
export const generateInvoice = (order) => {
    try {
        console.log("Generating invoice for order:", order?._id || order?.id);
        
        if (!order) {
            console.error("No order data provided for invoice generation");
            return;
        }

        // Initialize PDF in A4 format
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;

        // --- 1. Branding Section ---
        doc.setFontSize(24);
        doc.setTextColor(47, 74, 103); // Theme Primary
        doc.setFont('helvetica', 'bold');
        doc.text('NAVODAYA TRENDZ', margin, 25);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text('Premium JNV Alumni & Student Merchandise', margin, 31);
        doc.text('Email: support@navodayatrendz.com', margin, 36);
        doc.text('Website: www.navodayatrendz.com', margin, 41);

        // --- 2. Invoice Details Header ---
        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text('TAX INVOICE', pageWidth - margin, 25, { align: 'right' });
        
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'normal');
        const orderId = order._id || order.id || 'N/A';
        doc.text(`Invoice No: INV-${orderId.substring(orderId.length - 8).toUpperCase()}`, pageWidth - margin, 31, { align: 'right' });
        doc.text(`Order ID: ${orderId}`, pageWidth - margin, 36, { align: 'right' });
        doc.text(`Date: ${new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}`, pageWidth - margin, 41, { align: 'right' });
        doc.text(`Status: ${order.payment_info?.status || 'PAID'}`, pageWidth - margin, 46, { align: 'right' });

        // --- 3. Billing & Shipping ---
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, 52, pageWidth - margin, 52);

        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text('SHIPPING ADDRESS:', margin, 62);
        
        const addr = order.shipping_address || {};
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'normal');
        
        const addressLines = [
            addr.name || 'Valued Customer',
            addr.street || addr.address || 'N/A',
            `${addr.city || 'N/A'}, ${addr.state || 'N/A'} - ${addr.zip_code || addr.pincode || 'N/A'}`,
            `Country: ${addr.country || 'India'}`,
            `Phone: ${addr.phone || 'N/A'}`
        ];

        let yPos = 68;
        addressLines.forEach(line => {
            doc.text(line, margin, yPos);
            yPos += 5;
        });

        // --- 4. Products Table ---
        const items = order.items || [];
        const tableBody = items.map((item, index) => [
            index + 1,
            item.name || 'Product',
            `${item.size || 'N/A'}${item.color ? ' / ' + item.color : ''}`,
            `Rs. ${(item.price || 0).toLocaleString('en-IN')}`,
            item.quantity || 1,
            `Rs. ${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}`
        ]);

        autoTable(doc, {
            startY: 100,
            head: [['#', 'Item Description', 'Variant', 'Price', 'Qty', 'Total']],
            body: tableBody,
            theme: 'striped',
            headStyles: { fillColor: [47, 74, 103], textColor: 255, fontStyle: 'bold', halign: 'center' },
            styles: { fontSize: 9, cellPadding: 4, halign: 'center' },
            columnStyles: {
                1: { halign: 'left', cellWidth: 'auto' },
                5: { halign: 'right' }
            },
            margin: { left: margin, right: margin }
        });

        // --- 5. Summary Section ---
        let finalY = doc.lastAutoTable.finalY + 10;
        const summaryX = pageWidth - margin - 60;
        const valueX = pageWidth - margin;

        const pricing = order.pricing || {};
        const subtotal = pricing.subtotal || items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const shipping = pricing.shipping_fee || 0;
        const tax = pricing.tax || 0;
        const discount = pricing.discount || 0;
        const grandTotal = pricing.total || (subtotal + shipping + tax - discount);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        
        const summaryRows = [
            { label: 'Subtotal:', value: `Rs. ${subtotal.toLocaleString('en-IN')}` },
            { label: 'Shipping:', value: shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString('en-IN')}` },
            { label: 'Tax (GST 18%):', value: `Rs. ${tax.toLocaleString('en-IN')}` },
            { label: 'Discount:', value: `- Rs. ${discount.toLocaleString('en-IN')}` }
        ];

        summaryRows.forEach(row => {
            doc.text(row.label, summaryX, finalY);
            doc.text(row.value, valueX, finalY, { align: 'right' });
            finalY += 6;
        });

        doc.setDrawColor(47, 74, 103);
        doc.setLineWidth(0.5);
        doc.line(summaryX, finalY - 2, valueX, finalY - 2);
        
        finalY += 4;
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL AMOUNT:', summaryX, finalY);
        doc.text(`Rs. ${grandTotal.toLocaleString('en-IN')}`, valueX, finalY, { align: 'right' });

        // --- 6. Footer ---
        const footerY = pageHeight - 20;
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('This is a computer-generated document and does not require a signature.', pageWidth / 2, footerY + 5, { align: 'center' });

        // Save the PDF
        doc.save(`Invoice_${orderId.substring(0, 8)}.pdf`);
        console.log("Invoice generated successfully.");

    } catch (error) {
        console.error("CRITICAL ERROR generating invoice:", error);
    }
};
