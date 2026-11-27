import React from 'react';

// A table on md and up, a list of cards on phones, from one column list.
// Use it for every admin table.
//
// columns: [{
//   key: 'supplier',
//   header: 'Supplier',
//   cell: (row, index) => node,     // what to show (both layouts)
//   align: 'left' | 'center' | 'right',   // table only, defaults to the table's `align`
//   cellClass: (row) => 'text-success',   // extra classes for this cell (both layouts)
//   mobile: 'title' | 'subtitle' | 'badge' | 'field' | 'wide' | 'hidden',  // default 'field'
//   mobileLabel: 'Supplier',        // label on the card, defaults to header
//   desktop: false,                 // set to hide the column on the table (card only)
// }]
// Card layout: title + badge on the first line, subtitle under it, then the
// 'field' columns as label/value pairs in two columns ('wide' fields take a full
// row). Keep cards to 3-5 fields; mark the rest 'hidden'.
//
// selection: { isSelected(row), onToggle(row), allSelected, onToggleAll, rowLabel(row), isDisabled(row) }
//   adds a checkbox column (table) / a checkbox on each card, plus "Select all".
// actions: (row) => node   last column on the table, a row of buttons at the
//   bottom of each card. Clicks inside it don't trigger onRowClick.
// layout: 'auto' (table from md up) | 'cards' (always cards, e.g. in a narrow
//   side panel) | 'table' (always a table that scrolls sideways, e.g. a grid
//   people compare across)
// dense: smaller padding, for tables inside panels and modals.
// footer: node shown under the rows (totals, "load more"...), both layouts.
// groups: [{ key, label, rows }] instead of `rows`, for rows shown under
//   headings (e.g. users by role): a heading row on the table, a heading above
//   each group of cards.
const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' };

const stop = (e) => e.stopPropagation();

const ResponsiveTable = ({
  columns,
  rows = [],
  getRowKey = (row, i) => row?._id ?? i,
  onRowClick,
  emptyMessage = 'Nothing to show.',
  maxHeightClass = 'md:max-h-[70vh]',
  isRowSelected,
  rowClassName,
  selection,
  actions,
  actionsHeader = 'Actions',
  align = 'center',
  layout = 'auto',
  dense = false,
  minWidthClass = '',
  footer = null,
  className = '',
  groups,
}) => {
  const sections = groups || [{ key: '__all', label: null, rows }];
  const total = sections.reduce((n, g) => n + (g.rows?.length || 0), 0);
  const tableCols = columns.filter((c) => c.desktop !== false);
  const byRole = (role) =>
    columns.filter((c) => (c.mobile || 'field') === role);
  const titleCols = byRole('title');
  const subtitleCols = byRole('subtitle');
  const badgeCols = byRole('badge');
  const fieldCols = columns.filter((c) =>
    ['field', 'wide'].includes(c.mobile || 'field')
  );
  const clickable = typeof onRowClick === 'function';
  const selected = (row) =>
    selection?.isSelected?.(row) || isRowSelected?.(row) || false;
  const colCount = tableCols.length + (selection ? 1 : 0) + (actions ? 1 : 0);

  const showTable = layout !== 'cards';
  const showCards = layout !== 'table';
  const tableVis = layout === 'auto' ? 'hidden md:block' : '';
  const cardVis = layout === 'auto' ? 'md:hidden' : '';

  const cellPad = dense ? 'px-3 py-2' : 'px-4 py-3';
  const headPad = dense ? 'px-3 py-2' : 'px-4 py-3';

  const onKey = (e, row) => {
    if (e.target !== e.currentTarget) return; // a button inside the card
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onRowClick(row);
    }
  };

  const checkbox = (row) => (
    <input
      type="checkbox"
      className="h-4 w-4 cursor-pointer accent-brand-blue"
      checked={selection.isSelected(row)}
      disabled={selection.isDisabled?.(row) || false}
      onClick={stop}
      onChange={() => selection.onToggle(row)}
      aria-label={
        selection.rowLabel ? `Select ${selection.rowLabel(row)}` : 'Select row'
      }
    />
  );

  const selectAll = selection?.onToggleAll && (
    <input
      type="checkbox"
      className="h-4 w-4 cursor-pointer accent-brand-blue"
      checked={Boolean(selection.allSelected)}
      onChange={selection.onToggleAll}
      aria-label="Select all"
    />
  );

  return (
    <div className={className}>
      {/* ---------- table ---------- */}
      {showTable && (
        <div className={`${tableVis} overflow-auto ${maxHeightClass}`}>
          <table className={`w-full ${minWidthClass}`}>
            <thead className="sticky top-0 bg-white z-[1]">
              <tr className="bg-gray-shadow10 text-sm text-text-gray">
                {selection && (
                  <th
                    className={`${headPad} w-10 border-b border-gray-shadow8`}
                  >
                    {selectAll}
                  </th>
                )}
                {tableCols.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`${headPad} border-b border-gray-shadow8 font-semibold whitespace-nowrap ${ALIGN[col.align || align]}`}
                  >
                    {col.header}
                  </th>
                ))}
                {actions && (
                  <th
                    scope="col"
                    className={`${headPad} border-b border-gray-shadow8 font-semibold whitespace-nowrap ${ALIGN[align]}`}
                  >
                    {actionsHeader}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="text-text-gray">
              {total > 0 ? (
                sections.map((group) => (
                  <React.Fragment key={group.key}>
                    {group.label != null && group.rows?.length > 0 && (
                      <tr>
                        <td
                          colSpan={colCount}
                          className={`${cellPad} bg-blue-shadow10 text-sm font-semibold text-text-gray`}
                        >
                          {group.label}
                        </td>
                      </tr>
                    )}
                    {(group.rows || []).map((row, i) => (
                      <tr
                        key={getRowKey(row, i)}
                        onClick={clickable ? () => onRowClick(row) : undefined}
                        className={`border-b border-gray-border text-sm ${clickable ? 'cursor-pointer hover:bg-gray-shadow10' : ''} ${selected(row) ? 'bg-blue-shadow10' : ''} ${rowClassName?.(row) || ''}`}
                      >
                        {selection && (
                          <td className={`${cellPad} w-10`}>{checkbox(row)}</td>
                        )}
                        {tableCols.map((col) => (
                          <td
                            key={col.key}
                            className={`${cellPad} leading-5 ${ALIGN[col.align || align]} ${col.cellClass?.(row) || ''}`}
                          >
                            {col.cell(row, i)}
                          </td>
                        ))}
                        {actions && (
                          <td className={cellPad} onClick={stop}>
                            <div
                              className={`flex items-center gap-3 ${align === 'left' ? 'justify-start' : 'justify-center'}`}
                            >
                              {actions(row)}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr className="text-center text-text-gray">
                  <td
                    className={`font-semibold ${dense ? 'py-8' : 'py-24'}`}
                    colSpan={colCount}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {footer && <div className="bg-white">{footer}</div>}
        </div>
      )}

      {/* ---------- cards ---------- */}
      {showCards && (
        <div className={cardVis}>
          {selectAll && total > 0 && (
            <label className="flex items-center gap-2 px-1 pb-2 text-sm text-text-gray">
              {selectAll}
              Select all
            </label>
          )}
          {total > 0 ? (
            sections.map((group) =>
              group.rows?.length > 0 ? (
                <section
                  key={group.key}
                  className="flex flex-col gap-2 [&+section]:mt-3"
                >
                  {group.label != null && (
                    <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-shadow4">
                      {group.label}
                    </h3>
                  )}
                  <ul className="flex flex-col gap-2">
                    {group.rows.map((row, i) => (
                      <li
                        key={getRowKey(row, i)}
                        onClick={clickable ? () => onRowClick(row) : undefined}
                        onKeyDown={(e) => onKey(e, row)}
                        tabIndex={clickable ? 0 : undefined}
                        role={clickable ? 'button' : undefined}
                        className={`rounded-lg border border-gray-border bg-white p-3 text-sm text-text-gray flex flex-col gap-2 ${clickable ? 'active:bg-gray-shadow10 cursor-pointer' : ''} ${selected(row) ? 'ring-2 ring-blue-shadow7' : ''} ${rowClassName?.(row) || ''}`}
                      >
                        {(titleCols.length > 0 ||
                          badgeCols.length > 0 ||
                          selection) && (
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 min-w-0">
                              {selection && (
                                <span className="pt-0.5 shrink-0">
                                  {checkbox(row)}
                                </span>
                              )}
                              <div className="font-semibold text-text-black min-w-0 break-words leading-5">
                                {titleCols.map((col) => (
                                  <span
                                    key={col.key}
                                    className={`block ${col.cellClass?.(row) || ''}`}
                                  >
                                    {col.cell(row, i)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {badgeCols.length > 0 && (
                              <div className="shrink-0 flex flex-col items-end gap-1">
                                {badgeCols.map((col) => (
                                  <span
                                    key={col.key}
                                    className={col.cellClass?.(row) || ''}
                                  >
                                    {col.cell(row, i)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {subtitleCols.map((col) => (
                          <div
                            key={col.key}
                            className={`text-xs leading-snug ${col.cellClass?.(row) || ''}`}
                          >
                            {col.cell(row, i)}
                          </div>
                        ))}
                        {fieldCols.length > 0 && (
                          <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
                            {fieldCols.map((col) => (
                              <div
                                key={col.key}
                                className={`min-w-0 ${col.mobile === 'wide' ? 'col-span-2' : ''}`}
                              >
                                <dt className="text-xs text-gray-shadow5 leading-4">
                                  {col.mobileLabel || col.header}
                                </dt>
                                <dd
                                  className={`text-text-black break-words leading-5 ${col.cellClass?.(row) || ''}`}
                                >
                                  {col.cell(row, i)}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {actions && (
                          <div
                            onClick={stop}
                            className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-border pt-2 [&>*]:min-h-9 [&>*]:min-w-9 [&>*]:flex [&>*]:items-center [&>*]:justify-center"
                          >
                            {actions(row)}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null
            )
          ) : (
            <p className="text-center font-semibold text-text-gray py-16">
              {emptyMessage}
            </p>
          )}
          {footer && <div className="pt-2">{footer}</div>}
        </div>
      )}
    </div>
  );
};

export default ResponsiveTable;
