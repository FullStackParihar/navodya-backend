import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order) => {
    try {
        console.log("Generating invoice for order:", order?._id);
        if (!order) {
            console.error("No order data provided for invoice generation");
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // 1. Company Branding
        doc.setFontSize(22);
        doc.setTextColor(47, 74, 103); // Deep blue theme
        doc.text('NAVODAYA TRENDZ', 15, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Premium JNV Alumni Merchandise', 15, 26);
        doc.text('www.navodayatrendz.com', 15, 31);

        // 2. Invoice Details
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text('INVOICE', pageWidth - 15, 20, { align: 'right' });
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Order ID: ${order._id || order.id || 'N/A'}`, pageWidth - 15, 28, { align: 'right' });
        doc.text(`Date: ${new Date(order.created_at || Date.now()).toLocaleDateString()}`, pageWidth - 15, 34, { align: 'right' });
        doc.text(`Status: ${order.payment_info?.status || 'PAID'}`, pageWidth - 15, 40, { align: 'right' });

        // 3. Billing & Shipping Info
        doc.setDrawColor(226, 232, 240);
        doc.line(15, 45, pageWidth - 15, 45);

        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text('Ships To:', 15, 55);
        
        const addr = order.shipping_address || {};
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        const addressLines = [
            order.userName || 'Valued Customer',
            addr.street || addr.address || 'N/A',
            `${addr.city || 'N/A'}, ${addr.state || 'N/A'} - ${addr.zip_code || addr.pincode || 'N/A'}`,
            `India`,
            `Phone: ${order.userPhone || 'N/A'}`
        ];
        let yPos = 62;
        addressLines.forEach(line => {
            doc.text(line, 15, yPos);
            yPos += 5;
        });

        // 4. Items Table
        const items = order.items || [];
        const tableData = items.map(item => [
            item.name || 'Product',
            `Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}`,
            `Rs. ${item.price || 0}`,
            item.quantity || 1,
            `Rs. ${(item.price || 0) * (item.quantity || 1)}`
        ]);

        autoTable(doc, {
            startY: 95,
            head: [['Product', 'Variants', 'Price', 'Qty', 'Total']],
            body: tableData,
            headStyles: { fillColor: [47, 74, 103], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { fontSize: 10, cellPadding: 5 },
            columnStyles: {
                0: { cellWidth: 60 },
                4: { halign: 'right' }
            }
        });

        // 5. Final Calculation Summary
        const lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;
        let finalY = lastY + 10;
        const summaryX = pageWidth - 70;

        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);
        
        const pricing = order.pricing || {};
        const labels = ['Subtotal:', 'Shipping:', 'Tax (18%):', 'Discount:'];
        const values = [
            `Rs. ${pricing.subtotal || 0}`,
            pricing.shipping_fee === 0 ? 'FREE' : `Rs. ${pricing.shipping_fee || 0}`,
            `Rs. ${pricing.tax || 0}`,
            `-Rs. ${pricing.discount || 0}`
        ];

        labels.forEach((label, i) => {
            doc.text(label, summaryX, finalY);
            doc.text(values[i], pageWidth - 15, finalY, { align: 'right' });
            finalY += 7;
        });

        doc.setDrawColor(47, 74, 103);
        doc.line(summaryX, finalY - 2, pageWidth - 15, finalY - 2);
        
        finalY += 5;
        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59);
        doc.text('Grand Total:', summaryX, finalY);
        doc.text(`Rs. ${pricing.total || 0}`, pageWidth - 15, finalY, { align: 'right' });

        // 6. Footer
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text('Thank you for shopping with Navodaya Trendz!', pageWidth / 2, 280, { align: 'center' });
        doc.text('This is a computer generated invoice and does not require a physical signature.', pageWidth / 2, 285, { align: 'center' });

        doc.save(`Invoice_${order._id || order.id || 'order'}.pdf`);
        console.log("Invoice PDF successfully generated and saved.");
    } catch (error) {
        console.error("Error generating invoice PDF:", error);
    }
};



