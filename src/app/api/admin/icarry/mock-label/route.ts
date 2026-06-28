import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id') || 'ORD-UNKNOWN';
  const carrier = searchParams.get('carrier') || 'Delhivery Express';
  const awb = searchParams.get('awb') || 'AWB-MOCK-9999';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Shipping Label - ${orderId}</title>
      <style>
        body {
          font-family: 'Courier New', Courier, monospace;
          background: #fff;
          color: #000;
          margin: 40px;
          padding: 0;
        }
        .label-container {
          border: 4px solid #000;
          width: 380px;
          padding: 20px;
          box-sizing: border-box;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          font-size: 1.2rem;
          font-weight: bold;
          border-bottom: 2px dashed #000;
          padding-bottom: 10px;
          margin-bottom: 15px;
          letter-spacing: 1px;
        }
        .routing-box {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 15px;
          border-bottom: 1px solid #000;
          padding-bottom: 10px;
        }
        .address-box {
          margin-bottom: 15px;
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .address-title {
          font-weight: bold;
          text-transform: uppercase;
          text-decoration: underline;
          margin-bottom: 5px;
        }
        .barcode-section {
          text-align: center;
          margin: 20px 0;
        }
        .barcode-lines {
          display: inline-block;
          height: 60px;
          border-left: 3px solid #000;
          border-right: 1px solid #000;
          width: 250px;
          background: repeating-linear-gradient(
            90deg,
            #000,
            #000 2px,
            #fff 2px,
            #fff 6px
          );
        }
        .barcode-number {
          font-size: 1rem;
          font-weight: bold;
          letter-spacing: 2px;
          margin-top: 5px;
        }
        .footer-info {
          border-top: 2px dashed #000;
          padding-top: 10px;
          margin-top: 15px;
          font-size: 0.75rem;
          text-align: center;
        }
        .badge {
          border: 1px solid #000;
          padding: 2px 6px;
          font-weight: bold;
          display: inline-block;
          margin-top: 5px;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="label-container">
        <div class="header">
          iCarry.in Fulfillment
          <br>
          <span style="font-size: 0.75rem;">PREPAID LOGISTICS SHIPPING LABEL</span>
        </div>
        
        <div class="routing-box">
          <div>
            <strong>CARRIER:</strong><br>
            ${carrier}
          </div>
          <div style="text-align: right;">
            <strong>WEIGHT:</strong><br>
            250 gm
          </div>
        </div>

        <div class="address-box">
          <div class="address-title">FROM (Origin):</div>
          <div>ETERNYX Warehouse</div>
          <div>Pincode: 829122</div>
          <div>Jharkhand, India</div>
        </div>

        <div class="address-box">
          <div class="address-title">TO (Destination):</div>
          <div>Shipment Recipient</div>
          <div>Order Ref: ${orderId}</div>
          <div>Recipient Pincode Verified</div>
        </div>

        <div class="barcode-section">
          <div class="barcode-lines"></div>
          <div class="barcode-number">${awb}</div>
        </div>

        <div class="footer-info">
          Thank you for choosing ETERNYX Perfumes.
          <br>
          <span class="badge">Luxury Scent Dispatch</span>
        </div>
      </div>
      <script>
        // Automatically open the print dialog when page loads
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
