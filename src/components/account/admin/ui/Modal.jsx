import React from 'react';
import useEscapeToClose from './useEscapeToClose';

// Dimmed overlay for dialogs. Escape calls onClose.
//
// bare: the child is a self-styled dialog (ErrorModal, ExportContent,
//   RaiseTransferModal...) and is placed straight in the overlay, so widths it
//   sets in % or vw still measure against the full screen.
// Otherwise the child goes in a white panel:
//   size="sm": small dialogs, centred with a margin on phones.
//   size="lg": forms and previews, full screen on phones, centred card from sm up.
const Modal = ({
  onClose,
  children,
  label,
  size = 'sm',
  bare = false,
  zClass = 'z-[70]',
  closeOnBackdrop = false, // forms shouldn't vanish on a stray tap
  panelClass = '',
}) => {
  useEscapeToClose(onClose); // no onClose (e.g. a half-filled form): Escape does nothing

  const onBackdrop = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) onClose?.();
  };

  if (bare) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`fixed inset-0 ${zClass} bg-black bg-opacity-50 flex justify-center items-center`}
        onClick={onBackdrop}
      >
        {children}
      </div>
    );
  }

  const panel =
    size === 'lg'
      ? 'w-full h-full sm:h-auto sm:max-h-[90dvh] sm:w-auto sm:max-w-[min(92vw,64rem)] sm:rounded-lg'
      : 'w-full max-w-md max-h-[90dvh] rounded-lg';

  return (
    <div
      className={`fixed inset-0 ${zClass} bg-black bg-opacity-50 flex justify-center items-center ${size === 'lg' ? 'p-0 sm:p-4' : 'p-4'}`}
      onClick={onBackdrop}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`${panel} bg-white shadow-xl overflow-y-auto ${panelClass}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
