import {
  formatChange,
  formatCount,
  formatMoney,
  rangeLabel,
} from '../../../reportFormat';

// Plain-language summary for the insight panel at the bottom of the page.
const BuildInsight = (data, period, compare) => {
  const { totals, compareTotals, change, currency } = data;
  const lines = [];
  if (!totals.transactionCount)
    lines.push(`No completed sales in ${rangeLabel(period.from, period.to)}.`);
  else {
    lines.push(
      `${formatMoney(totals.totalSales, currency)} from ${formatCount(totals.transactionCount)} transactions ` +
        `in ${rangeLabel(period.from, period.to)}, an average of ${formatMoney(totals.averagePerTransaction, currency)} each.`
    );
  }
  if (compare && compareTotals) {
    const vs = rangeLabel(compare.from, compare.to);
    if (change.totalSales === null) {
      lines.push(`There were no sales in ${vs} to compare with.`);
    } else {
      const word = change.totalSales >= 0 ? 'up' : 'down';
      lines.push(
        `Sales are ${word} ${formatChange(Math.abs(change.totalSales)).replace('+', '')} on ${vs} ` +
          `(${formatMoney(compareTotals.totalSales, currency)}).`
      );
    }
  }
  if (totals.branchCount > 1) {
    lines.push(
      `${totals.branchesWithSales} of ${totals.branchCount} branches made sales.`
    );
  }
  return lines.join(' ');
};

export default BuildInsight;
