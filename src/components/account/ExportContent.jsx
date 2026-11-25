import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // v3.x+ API: autoTable(doc, {...})
import { FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';

// metadata values can be a string or an array; arrays are joined with ", "
const fmt = (v) => [].concat(v ?? []).join(', ');

// table cell value: objects are stringified, null/undefined become ''
const cell = (v) =>
  v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : v;

const escapeHtml = (v) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]
  );

const safeFileName = (name) => String(name).replace(/[\\/:*?"<>|]/g, '_');

/**
 * Props
 * - data:          array of flat objects (one per row). Columns = union of keys.
 *                  Keep numbers as numbers so Excel can sum them.
 * - title:         heading shown in the modal and on every export
 * - metadata:      { Label: string | string[] } shown above the table.
 *                  Line breaks in values are preserved (screen, print, PDF, Excel).
 * - hiddenButtons: any of 'excel' | 'pdf' | 'print'
 * - fileName:      base name for the downloaded files (no extension)
 * - emptyMessage:  shown when data is empty (metadata is still exported)
 */
const ExportContent = ({
  data = [],
  onClose,
  title = 'Export',
  metadata = {},
  hiddenButtons = [],
  fileName = 'exported_data',
  emptyMessage = 'No rows',
}) => {
  const show = (name) => !hiddenButtons.includes(name);
  const keys = [...new Set(data.flatMap((row) => Object.keys(row)))];
  const metadataEntries = Object.entries(metadata);
  const baseName = safeFileName(fileName);

  const bodyRows = () => data.map((row) => keys.map((k) => cell(row[k])));

  // ---------- Excel ----------
  const exportToExcel = () => {
    const metadataRows = metadataEntries.map(([key, v]) => [`${key}:`, fmt(v)]);
    const worksheetData = [
      ...metadataRows,
      [],
      ...(keys.length ? [keys, ...bodyRows()] : []),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet['!cols'] = keys.map((k) => ({
      wch: Math.min(
        40,
        Math.max(k.length, ...data.map((r) => String(cell(r[k])).length)) + 2
      ),
    }));
    const workbook = XLSX.utils.book_new();
    const sheetName =
      String(title)
        .replace(/[\\/?*[\]:]/g, '')
        .slice(0, 31) || 'Sheet1';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${baseName}.xlsx`);
  };

  // ---------- PDF ----------
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: keys.length > 6 ? 'landscape' : 'portrait',
    });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 14;

    doc.setFontSize(14);
    doc.text(String(title), margin, 14);

    doc.setFontSize(9);
    let y = 22;
    metadataEntries.forEach(([key, v]) => {
      const lines = doc.splitTextToSize(
        `${key}: ${fmt(v)}`,
        pageW - margin * 2
      );
      // push to a new page if a long block (e.g. notes) won't fit
      if (y + lines.length * 4.5 > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 1.5;
    });

    if (keys.length) {
      autoTable(doc, {
        startY: y + 2,
        head: [keys],
        body: bodyRows(),
        styles: { fontSize: 8 },
        margin: { left: margin, right: margin },
      });
    }
    doc.save(`${baseName}.pdf`);
  };

  // ---------- Print ----------
  const printTable = () => {
    const metaHtml = metadataEntries
      .map(
        ([key, v]) =>
          `<p class="meta"><strong>${escapeHtml(key)}:</strong> ${escapeHtml(fmt(v))}</p>`
      )
      .join('');

    const tableHtml = keys.length
      ? `<table>
          <thead><tr>${keys.map((k) => `<th>${escapeHtml(k)}</th>`).join('')}</tr></thead>
          <tbody>${data
            .map(
              (row) =>
                `<tr>${keys.map((k) => `<td>${escapeHtml(cell(row[k]))}</td>`).join('')}</tr>`
            )
            .join('')}</tbody>
        </table>`
      : `<p><em>${escapeHtml(emptyMessage)}</em></p>`;

    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) {
      alert(
        'Your browser blocked the print window. Allow pop-ups and try again.'
      );
      return;
    }
    printWindow.document.write(`<html><head><title>${escapeHtml(title)}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; padding: 16px; }
        .meta { margin: 4px 0; white-space: pre-wrap; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #f0f0f0; }
        tr { break-inside: avoid; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      </style></head><body>
      <h2>${escapeHtml(title)}</h2>${metaHtml}${tableHtml}
      </body></html>`);
    printWindow.document.close();
    printWindow.focus();
    // give the new window a moment to lay out before opening the print dialog
    setTimeout(() => printWindow.print(), 250);
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
      <h2 className="text-lg text-text-gray font-semibold text-center">
        {title}
      </h2>

      <div className="p-5">
        {metadataEntries.length > 0 && (
          <div className="text-sm font-medium text-text-gray max-h-[25vh] overflow-y-auto scrollbar-thin">
            <hr className="my-1" />
            {metadataEntries.map(([key, v]) => (
              <p key={key} className="my-2 whitespace-pre-wrap break-words">
                <strong>{key}:</strong> {fmt(v)}
              </p>
            ))}
            <hr className="my-1" />
          </div>
        )}

        {keys.length > 0 ? (
          <div className="max-h-[45vh] overflow-y-auto scrollbar-thin">
            <table className="min-w-full bg-white border border-gray-border">
              <thead className="sticky top-0 bg-background-1">
                <tr>
                  {keys.map((key) => (
                    <th
                      key={key}
                      className="px-4 py-2 border-b border-gray-border text-left text-sm font-semibold text-text-gray"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-shadow10 cursor-text"
                  >
                    {keys.map((key) => (
                      <td
                        key={key}
                        className="px-4 py-2 border-b border-gray-border text-sm text-text-gray"
                      >
                        {cell(item[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-4 text-center text-sm italic text-text-gray">
            {emptyMessage}
          </p>
        )}

        <div className="mt-5 flex flex-wrap justify-between gap-4 w-full text-sm">
          {show('excel') && (
            <button
              onClick={exportToExcel}
              className="bg-brand-green text-white px-2 py-2 rounded-sm hover:scale-105 flex flex-row gap-1"
            >
              <FaFileExcel className="text-text-white" />
              Export to Excel
            </button>
          )}
          {show('pdf') && (
            <button
              onClick={exportToPDF}
              className="bg-error text-white px-2 py-2 rounded-sm hover:scale-105 flex flex-row gap-1"
            >
              <FaFilePdf className="text-text-white" />
              Export to PDF
            </button>
          )}
          {show('print') && (
            <button
              onClick={printTable}
              className="bg-brand-blue text-white px-2 py-2 rounded-sm hover:scale-105 flex flex-row gap-1"
            >
              <FaPrint className="text-text-white" />
              Print
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportContent;
