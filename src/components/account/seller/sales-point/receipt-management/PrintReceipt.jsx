/**
 * Prints a formatted receipt to a thermal printer or standard printer
 * @param {Object} metaData - Receipt header information
 * @param {string} metaData.storeName - Name of the store
 * @param {string} metaData.address - Store address
 * @param {string} metaData.phone - Store phone number
 * @param {string} metaData.date - Transaction date
 * @param {Array<Object>} listOfItems - Array of items purchased
 * @param {string} listOfItems[].name - Item name
 * @param {number} listOfItems[].quantity - Quantity purchased
 * @param {number} listOfItems[].price - Unit price of item
 * @param {string} endNotes - Additional notes to display before footer
 * @param {string} footer - Footer text for receipt
 * @param {string} transactionId - Transaction ID for the receipt
 * @returns {void}
 */
const printReceipt = ({
  metaData,
  transactionId,
  listOfItems,
  endNotes,
  footer,
}) => {
  // print receipt with metadata, in receipt format, with list of items, end notes and footer and receipt paper size of 80mm width and dynamic length based on content
  const receiptContent = `
      <html>
        <head>
          <style>
            @media print {
                @page {
                    width: 80mm;
                    margin: 0;
                }
                body {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    margin: 0;
                    padding: 10px;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 5px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0;
                }
                .receipt-items {
                    width: 100%;
                    border-collapse: collapse;
                }
                .receipt-items th, .receipt-items td {
                    border-bottom: 1px solid #ddd;
                    padding: 5px 0;
                }
                .receipt-footer {
                    text-align: center;
                    margin-top: 10px;
                }
                .items-header {
                    border-bottom: 2px solid #000;
                    font-weight: bold;
                }
                    .receipt-items td {
                    padding: 5px 0;
                    border: none;
}
            }
            </style>
        </head>
        <body>
          <div class="receipt-header">
            <span style="font-weight: bold; font-size: 16px;">${metaData?.storeName || 'Store Name'}</span>
            <span>${metaData?.address || 'Store Address'}</span>
            <span>${metaData?.phone || 'Store Phone'}</span>
            <span>${metaData?.date || new Date().toLocaleString()}</span>
          </div>
          <p style="text-align: center; font-weight: bold;">${metaData?.title || ''}</p>
            <table class="receipt-items">
                <thead>
                    <tr class="items-header">
                        <th style="text-align: left;">Item</th>
                        <th style="text-align: left;">Qty</th>
                        <th style="text-align: left;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${(Array.isArray(listOfItems) ? listOfItems : [])
                      .map(
                        (item) => `
                            <tr>
                                <td style="padding-bottom: ${item.options?.length > 0 ? '0' : '5px'};">
                                    <div>${item.name}</div>
                                    ${
                                      item.options?.length > 0
                                        ? `<ul style="margin: 2px 0 4px 0; padding-left: 14px; list-style-type: disc;">
                                            ${item.options
                                              .map(
                                                (option) => `
                                                    <li style="font-size: 10px; color: #555;">
                                                        ${option.name}${option.additionalPrice > 0 ? ` (+${option.additionalPrice.toFixed(2)})` : ''}
                                                    </li>
                                                `
                                              )
                                              .join('')}
                                         </ul>`
                                        : ''
                                    }
                                </td>
                                <td style="vertical-align: top; padding-top: 2px;">${item.quantity}</td>
                                <td style="vertical-align: top; padding-top: 2px;">${item.price.toFixed(2)}</td>
                            </tr>
                        `
                      )
                      .join('')}
                </tbody>
            </table>
            <div class="receipt-footer">
                <ul style="list-style-type: none; padding: 0; display: flex; flex-direction: column; gap: 5px;">
                                        ${(Array.isArray(endNotes)
                                          ? endNotes
                                          : []
                                        )
                                          .map(
                                            (note) =>
                                              `<li style="display: flex; justify-content: space-between;"><span>${note.label}</span> <span>${note.value}</span></li>`
                                          )
                                          .join('')}
                </ul>
                
                <span style="font-style: italic; font-weight: bold;">You were served by: ${metaData?.cashierName || ' '}</span><br />
                <span style="font-style: italic;">${footer || ''}</span><br />
            </div>
            <div style="text-align: center; margin-top: 10px;">
                <svg id="barcode"></svg>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
            <script>
                JsBarcode("#barcode", "${transactionId}", {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 1,
                    height: 40,
                    displayValue: false,
                    margin: 0,
                });
            </script>
        </body>
      </html>
    `;
  //print on same window without opening a new tab or window
  const printWindow = window.open('', '', 'width=400,height=600');
  printWindow.document.write(receiptContent);
  printWindow.document.close();
  printWindow.print();
};

export default printReceipt;

// Example usage:
// const metaData = {
//   storeName: 'My Store',
//   address: '123 Main St',
//   phone: '555-1234',
//   date: '2024-01-01 12:00 PM',
//   cashierName: 'John Doe',
// };
// const listOfItems = [
//   { name: 'Item 1', quantity: 2, price: 9.99, options: [{ name: 'Option A', additionalPrice: 1.99 }] },
//   { name: 'Item 2', quantity: 1, price: 19.99, options: [] },
// ];
// const endNotes = [
//   { label: 'Subtotal:', value: '$39.97' },
//   { label: 'Tax:', value: '$3.20' },
//   { label: 'Total:', value: '$43.17' },
// ];
// const footer = 'Visit again!';
// const transactionId = '123456789012';
// printReceipt(metaData, transactionId, listOfItems, endNotes, footer);
