import React, { useState } from 'react';
import { Order } from '../types';
import { FileText, Loader2, FileDown, Download } from 'lucide-react';

interface InvoiceGeneratorProps {
  order: Order;
}

// Define an interface for the item in the orderDetails
interface OrderDetailItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ order }) => {
  const [invoice, setInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const generateInvoice = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Format the order data for the AI prompt
      const orderDetails = {
        id: order.id,
        customerName: order.customerName,
        date: order.date,
        status: order.status,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        })),
        total: order.total
      };
      
      // Create a prompt for the Groq AI model
      const prompt = `
        Generate a professional invoice based on the following order details:
        
        Order ID: ${orderDetails.id}
        Customer: ${orderDetails.customerName}
        Date: ${orderDetails.date}
        Status: ${orderDetails.status}
        
        Items:
        ${orderDetails.items.map(item => 
          `- ${item.name} x ${item.quantity} @ $${item.price.toFixed(2)} = $${item.subtotal.toFixed(2)}`
        ).join('\n')}
        
        Total: $${orderDetails.total.toFixed(2)}
        
        Please format this as a complete, professional invoice from Sarathi Electricals, including:
        1. A header with company name, logo placeholder, and contact information
        2. Invoice number (based on order ID)
        3. Customer billing information section
        4. Itemized list of products with quantities, unit prices, and subtotals
        5. Subtotal, tax (18% GST), and final total calculations
        6. Payment terms and methods
        7. A thank you message
        
        Return the invoice in a format that can be displayed as HTML.
      `;
      
      // Make a real API call to Groq
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: [
              {
                role: "system",
                content: "You are an expert invoice generator. You create professional, well-formatted HTML invoices based on order details."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 4000
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate invoice');
        }
        
        const data = await response.json();
        const generatedInvoice = data.choices[0].message.content;
        
        // Extract HTML content if the AI wrapped it in markdown code blocks
        let cleanedInvoice = generatedInvoice;
        if (generatedInvoice.includes('```html')) {
          cleanedInvoice = generatedInvoice.split('```html')[1].split('```')[0].trim();
        } else if (generatedInvoice.includes('```')) {
          cleanedInvoice = generatedInvoice.split('```')[1].split('```')[0].trim();
        }
        
        setInvoice(cleanedInvoice);
      } catch (apiError) {
        console.error('Groq API error:', apiError);
        // Fall back to the sample invoice if the API call fails
        const generatedInvoice = generateSampleInvoice(orderDetails);
        setInvoice(generatedInvoice);
      }
      
    } catch (err) {
      setError('Failed to generate invoice. Please try again.');
      console.error('Invoice generation error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to generate a sample invoice (as fallback)
  const generateSampleInvoice = (orderDetails: {
    id: string;
    customerName: string;
    date: string;
    status: string;
    items: OrderDetailItem[];
    total: number;
  }) => {
    const today = new Date().toLocaleDateString();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    
    const subtotal = orderDetails.total;
    const taxRate = 0.18; // 18% GST
    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;
    
    return `
      <div class="invoice-container" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea;">
        <div class="invoice-header" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h1 style="color: #333; margin: 0;">INVOICE</h1>
            <p style="color: #666; margin: 5px 0;">Sarathi Electricals</p>
            <p style="color: #666; margin: 5px 0;">123 Main Street, Bangalore, India</p>
            <p style="color: #666; margin: 5px 0;">Phone: +91 9876543210</p>
            <p style="color: #666; margin: 5px 0;">Email: info@sarathielectricals.com</p>
          </div>
          <div style="text-align: right;">
            <h2 style="color: #333; margin: 0;">Invoice #: INV-${orderDetails.id}</h2>
            <p style="color: #666; margin: 5px 0;">Date: ${today}</p>
            <p style="color: #666; margin: 5px 0;">Due Date: ${dueDate.toLocaleDateString()}</p>
            <p style="color: #666; margin: 5px 0;">Order ID: ${orderDetails.id}</p>
            <p style="color: #666; margin: 5px 0;">Status: ${orderDetails.status.toUpperCase()}</p>
          </div>
        </div>
        
        <div class="customer-info" style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #333;">Bill To:</h3>
          <p style="margin: 5px 0;"><strong>${orderDetails.customerName}</strong></p>
          <p style="margin: 5px 0; color: #666;">Customer ID: CUST-${Math.floor(1000 + Math.random() * 9000)}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Quantity</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Unit Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails.items.map((item: OrderDetailItem) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">$${item.subtotal.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;"><strong>Subtotal:</strong></td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">$${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;"><strong>GST (18%):</strong></td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">$${taxAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd; font-weight: bold;">$${grandTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div class="payment-info" style="margin-bottom: 20px;">
          <h3 style="color: #333;">Payment Information</h3>
          <p style="margin: 5px 0;"><strong>Payment Terms:</strong> Net 30 days</p>
          <p style="margin: 5px 0;"><strong>Payment Methods:</strong> Bank Transfer, Credit Card, UPI</p>
          <p style="margin: 5px 0;"><strong>Bank Account:</strong> XXXX-XXXX-XXXX-1234</p>
          <p style="margin: 5px 0;"><strong>UPI ID:</strong> sarathielectricals@upi</p>
        </div>
        
        <div class="notes" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
          <p style="color: #666;"><strong>Note:</strong> This is a computer-generated invoice and doesn't require a signature.</p>
          <p style="color: #666; margin-top: 20px; text-align: center;">Thank you for your business with Sarathi Electricals!</p>
        </div>
      </div>
    `;
  };

  // Function to generate PDF from HTML
  const generatePDF = async () => {
    if (!invoice) return;
    
    setGeneratingPdf(true);
    
    try {
      // Use html2pdf.js for PDF generation
      // We need to dynamically import it since it's a client-side library
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      
      // Create a temporary div to hold the invoice HTML
      const element = document.createElement('div');
      element.innerHTML = invoice;
      document.body.appendChild(element);
      
      // Configure PDF options
      const options = {
        margin: 10,
        filename: `Invoice-${order.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Generate PDF
      html2pdf()
        .from(element)
        .set(options)
        .save()
        .then(() => {
          // Clean up
          document.body.removeChild(element);
          setGeneratingPdf(false);
        });
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Please try again.');
      setGeneratingPdf(false);
      
      // Fallback to HTML download if PDF generation fails
      downloadHTML();
    }
  };
  
  // Function to download HTML invoice
  const downloadHTML = () => {
    if (!invoice) return;
    
    // Create a blob from the HTML content
    const blob = new Blob([invoice], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6">
      {!invoice ? (
        <button
          onClick={generateInvoice}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Generating Invoice...</span>
            </>
          ) : (
            <>
              <FileText size={18} />
              <span>Generate Invoice</span>
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Generated Invoice</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setInvoice(null)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Generate New
              </button>
              <button
                onClick={downloadHTML}
                className="px-3 py-1.5 text-sm flex items-center gap-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                <FileDown size={14} />
                <span>HTML</span>
              </button>
              <button
                onClick={generatePDF}
                disabled={generatingPdf}
                className="px-3 py-1.5 text-sm flex items-center gap-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {generatingPdf ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div 
            className="border border-gray-200 rounded-md p-4 max-h-[500px] overflow-auto"
            dangerouslySetInnerHTML={{ __html: invoice }}
          />
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator; 