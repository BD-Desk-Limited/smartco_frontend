import { useEffect, useRef } from 'react';

// Escape closes only the overlay on top (e.g. the export dialog, not the detail
// panel under it). Each open overlay registers itself; the last one registered wins.
const stack = [];

const onKeyDown = (e) => {
  if (e.key !== 'Escape' || stack.length === 0) return;
  stack[stack.length - 1].current?.();
};

export default function useEscapeToClose(onClose, active = true) {
  const handler = useRef(onClose);
  useEffect(() => {
    handler.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!active || !onClose) return;
    const entry = handler;
    if (stack.length === 0) window.addEventListener('keydown', onKeyDown);
    stack.push(entry);
    return () => {
      const i = stack.lastIndexOf(entry);
      if (i !== -1) stack.splice(i, 1);
      if (stack.length === 0) window.removeEventListener('keydown', onKeyDown);
    };
    // onClose identity can change every render; only (de)register on open/close
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, Boolean(onClose)]);
}
