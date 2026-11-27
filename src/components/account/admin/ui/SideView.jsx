import React from 'react';
import useEscapeToClose from './useEscapeToClose';

// Detail panel that slides over the page from the right (order details, transfer
// details, customer profile...). Full screen on phones, a share of the width from md up.
// Click the dimmed area or press Escape to close.
//
//   <SideView onClose={() => setOrder(null)} label="Purchase order">
//     <PurchaseAndSupplyDetailSideView ... />
//   </SideView>
const SideView = ({
  onClose,
  children,
  label,
  widthClass = 'md:w-2/3 lg:w-1/2 xl:w-1/3',
  zClass = 'z-50',
}) => {
  useEscapeToClose(onClose);

  return (
    <div
      className={`fixed inset-0 ${zClass} bg-black bg-opacity-50 flex justify-end`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className={`relative h-full w-full ${widthClass} bg-text-white shadow-xl overflow-y-auto pb-[env(safe-area-inset-bottom)]`}
      >
        {children}
      </div>
    </div>
  );
};

export default SideView;
