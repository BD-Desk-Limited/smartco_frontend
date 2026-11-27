// Money held right now, by why it is held
const HeldPanel = ({ held, money, onShow }) => {
  const lines = [
    {
      label: 'Open orders',
      hint: 'Deposits on orders not fulfilled yet',
      group: held.open,
    },
    {
      label: 'Cancelled, needs refunding',
      hint: 'Paid on cancelled orders and not refunded yet',
      group: held.cancelled,
      filter: 'needs-refund',
    },
    {
      label: 'Overpaid, needs refunding',
      hint: 'Paid above the final price (the price dropped, or a late payment)',
      group: held.overpaid,
      filter: 'needs-refund',
    },
  ];
  return (
    <div className="border border-gray-shadow8 rounded-xl p-4 shadow-md text-sm flex flex-col gap-2">
      <div>
        <h3 className="font-semibold text-base">Held now</h3>
        <p className="text-xs text-text-gray">
          Money customers have paid that is not part of a sale yet.
        </p>
      </div>
      <ul className="flex flex-col gap-1">
        {lines.map((l) => (
          <li key={l.label} className="flex justify-between gap-3">
            <span>
              {l.label} ({l.group.count})
              <span className="block text-xs text-text-gray">{l.hint}</span>
            </span>
            <span className="whitespace-nowrap text-right">
              {money(l.group.amount)}
              {l.filter && l.group.count > 0 && (
                <button
                  type="button"
                  onClick={() => onShow(l.filter)}
                  className="block text-xs text-brand-blue hover:underline ml-auto"
                >
                  Show
                </button>
              )}
            </span>
          </li>
        ))}
        <li className="flex justify-between gap-3 border-t pt-1 font-semibold">
          <span>Total held</span>
          <span>{money(held.total)}</span>
        </li>
      </ul>
    </div>
  );
};

export default HeldPanel;
