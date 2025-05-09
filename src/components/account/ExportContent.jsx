import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportContent = ({ data, onClose, title, metadata = {} }) => {
  // Extract all keys from the data array
  const keys = data.length > 0 ? Object.keys(data[0]) : [];

  // Function to export the table to Excel
  const exportToExcel = () => {
    const metadataRows = Object.entries(metadata).map(([key, values]) => [`${key}:`, values.join(', ')]);
    const worksheetData = [
      ...metadataRows,
      [],
      ...data.map(item => keys.map(key => (typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]))),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'exported_data.xlsx');
  };

  // Function to export the table to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 20, 10);
    let startY = 20;
    Object.entries(metadata).forEach(([key, values]) => {
      doc.text(`${key}: ${values.join(', ')}`, 20, startY);
      startY += 10;
    });
    doc.autoTable({
      startY,
      head: [keys],
      body: data.map(item => keys.map(key => (typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]))),
    });
    doc.save('exported_data.pdf');
  };

  // Function to print the table
  const printTable = () => {
    const metadataContent = Object.entries(metadata).map(([key, values]) => `<p>${key}: ${values?.join(', ')}</p>`)?.join('');
    const printContent = document.getElementById('printableTable').outerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Table</title>');
    printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<h2>${title}</h2>`);
    printWindow.document.write(metadataContent);
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="relative bg-white p-5 rounded-lg shadow-lg w-[90vw]">
      <button
        onClick={onClose}
        title="Close"
        className="bg-brand-gray text-white px-4 py-2 rounded-full absolute top-0.5 right-0.5 hover:bg-gray-shadow2"
      >
        X
      </button>
      <h2 className="text-lg text-text-gray font-semibold text-center">{title}</h2>
      
      <div className="p-5">
        <div className='text-sm font-medium text-text-gray'>
        <hr className="my-1" />
          {Object.entries(metadata).map(([key, values]) => (
            <p key={key} className='my-2'><strong>{key}:</strong> {values?.join(', ')}</p>
          ))}
          <hr className="my-1" />
        </div>
        <div id="printableTable" className='max-h-[55vh] overflow-y-auto scrollbar-thin'>
          <table className="min-w-full bg-white border border-gray-border">
            <thead className='sticky top-0 bg-background-1'>
              <tr>
                {keys.map((key) => (
                  <th key={key} className="px-4 py-2 border-b border-gray-border text-left text-sm font-semibold text-text-gray">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-shadow10 cursor-text">
                  {keys.map((key) => (
                    <td key={key} className="px-4 py-2 border-b border-gray-border text-sm text-text-gray">
                      {typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex gap-2 w-full justify-between text-sm">
          <button
            onClick={exportToExcel}
            className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-shadow1"
          >
            Export to Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-shadow1"
          >
            Export to PDF
          </button>
          <button
            onClick={printTable}
            className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-shadow1"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportContent;