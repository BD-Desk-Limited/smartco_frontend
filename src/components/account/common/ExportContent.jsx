import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // v3.x+ API: autoTable(doc, {...})
import { FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

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
 * - totals:        optional row added under the data, in bold ({ column: value }; the first
 *                  column usually holds a "Total" label)
 * - sections:      optional extra tables after the main one: [{ title, data, totals? }]
 *                  (e.g. totals by branch); exported, printed and previewed the same way
 */
const ExportContent = ({
  data = [],
  onClose,
  title = 'Export',
  metadata = {},
  hiddenButtons = [],
  fileName = 'exported_data',
  emptyMessage = 'No rows',
  totals = null,
  sections = [],
}) => {
  const show = (name) => !hiddenButtons.includes(name);
  const metadataEntries = Object.entries(metadata);
  const baseName = safeFileName(fileName);

  // every table exported: the main one, then the sections. rows include the totals row.
  const tables = [
    { title: null, data, totals },
    ...sections.filter((s) => s?.data?.length),
  ].map((t) => {
    const rows = t.totals ? [...t.data, t.totals] : t.data;
    const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))];
    return {
      ...t,
      rows,
      keys,
      body: rows.map((row) => keys.map((k) => cell(row[k]))),
    };
  });
  const main = tables[0];
  const keys = main.keys;
  const extra = tables.slice(1);

  // ---------- Excel ----------
  const exportToExcel = () => {
    const metadataRows = metadataEntries.map(([key, v]) => [`${key}:`, fmt(v)]);
    const worksheetData = [...metadataRows, []];
    tables.forEach((t) => {
      if (!t.keys.length) return;
      if (t.title) worksheetData.push([], [t.title]);
      worksheetData.push(t.keys, ...t.body);
    });
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const widest = Math.max(...tables.map((t) => t.keys.length));
    worksheet['!cols'] = Array.from({ length: widest }, (_, i) => ({
      wch: Math.min(
        40,
        Math.max(
          8,
          ...tables.flatMap((t) =>
            t.keys[i]
              ? [t.keys[i].length, ...t.body.map((r) => String(r[i]).length)]
              : []
          )
        ) + 2
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

    tables.forEach((t) => {
      if (!t.keys.length) return;
      if (t.title) {
        y = (doc.lastAutoTable?.finalY ?? y) + 8;
        if (y > pageH - margin * 2) {
          doc.addPage();
          y = margin;
        }
        doc.setFontSize(11);
        doc.text(String(t.title), margin, y);
        doc.setFontSize(9);
      }
      autoTable(doc, {
        startY: y + 2,
        head: [t.keys],
        body: t.body,
        styles: { fontSize: 8 },
        margin: { left: margin, right: margin },
        // the totals row in bold
        didParseCell: (hook) => {
          if (
            t.totals &&
            hook.section === 'body' &&
            hook.row.index === t.body.length - 1
          ) {
            hook.cell.styles.fontStyle = 'bold';
          }
        },
      });
    });
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

    const tableOf = (t) =>
      `${t.title ? `<h3>${escapeHtml(t.title)}</h3>` : ''}<table>
          <thead><tr>${t.keys.map((k) => `<th>${escapeHtml(k)}</th>`).join('')}</tr></thead>
          <tbody>${t.body
            .map(
              (row, i) =>
                `<tr${t.totals && i === t.body.length - 1 ? ' class="total"' : ''}>${row
                  .map((v) => `<td>${escapeHtml(v)}</td>`)
                  .join('')}</tr>`
            )
            .join('')}</tbody>
        </table>`;
    const tableHtml =
      (keys.length
        ? tableOf(main)
        : `<p><em>${escapeHtml(emptyMessage)}</em></p>`) +
      extra.map(tableOf).join('');

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
        tr.total td { font-weight: bold; background: #f7f7f7; }
        h3 { margin: 18px 0 0; font-size: 13px; }
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
    <div className="relative bg-white p-3 sm:p-5 rounded-lg shadow-lg w-[94vw] sm:w-[90vw] max-h-[94dvh] overflow-y-auto">
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

      <div className="p-1 sm:p-5">
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
          <div className="max-h-[45vh] overflow-auto flex flex-col gap-4">
            {/* the preview of what gets exported: a table from md up, cards on phones */}
            {tables
              .filter((t) => t.keys.length)
              .map((t, n) => (
                <div key={n}>
                  {t.title && (
                    <h3 className="text-sm font-semibold text-text-black mb-1">
                      {t.title}
                    </h3>
                  )}
                  <ResponsiveTable
                    align="left"
                    dense
                    maxHeightClass=""
                    rows={t.rows}
                    getRowKey={(_, i) => i}
                    rowClassName={(row) =>
                      t.totals && row === t.totals
                        ? 'font-semibold bg-gray-shadow10'
                        : ''
                    }
                    columns={t.keys.map((key, i) => ({
                      key,
                      header: key,
                      mobile: i === 0 ? 'title' : 'field',
                      cell: (item) => cell(item[key]),
                    }))}
                  />
                </div>
              ))}
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
