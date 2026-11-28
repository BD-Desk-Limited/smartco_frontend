'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaLightbulb,
  FaTimes,
} from 'react-icons/fa';
import useEscapeToClose from '../admin/ui/useEscapeToClose';

// Pages keep writing <PageDescription pageDescription="..." /> where they always
// did. Inside the admin and manager account frame that component renders nothing and hands its text
// to this slot instead, and the frame shows it in one place:
// - md and up: a bar under the scroll area (<PageDescriptionBar/>). It is outside
//   the scrolling <main>, so it never covers content, even scrolled to the end.
// - phones: a lightbulb button in the header (<PageDescriptionButton/>) that
//   opens the text in a bottom sheet, so it costs no screen height.

// Two contexts: the register/unregister functions never change, so pages that
// register don't re-render (or loop) when the text changes.
const SlotApi = createContext(null);
const SlotText = createContext(null);

export const PageDescriptionProvider = ({ children }) => {
  const [entry, setEntry] = useState(null); // { id, text }

  const register = useCallback((id, text) => {
    setEntry((e) => (e?.id === id && e.text === text ? e : { id, text }));
  }, []);
  // only the page that registered can clear it, so a page that mounts before
  // the previous one unmounts doesn't get wiped
  const unregister = useCallback((id) => {
    setEntry((e) => (e?.id === id ? null : e));
  }, []);

  const api = useMemo(() => ({ register, unregister }), [register, unregister]);

  return (
    <SlotApi.Provider value={api}>
      <SlotText.Provider value={entry}>{children}</SlotText.Provider>
    </SlotApi.Provider>
  );
};

export const usePageDescriptionApi = () => useContext(SlotApi);
const usePageDescription = () => useContext(SlotText);

// ---------- md and up: bar at the bottom of the frame ----------
export const PageDescriptionBar = () => {
  const entry = usePageDescription();
  if (!entry?.text) return null;
  // keyed by page, so "Show more" resets when you move to another page
  return <DescriptionBar key={entry.id} text={entry.text} />;
};

const DescriptionBar = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const textRef = useRef(null);

  // show "Show more" only when the one-line version is cut off
  useEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return;
    const measure = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    const frame = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [text, expanded]);

  return (
    <aside
      aria-label="Page description"
      className="hidden md:block shrink-0 border-t border-gray-border bg-white"
    >
      <div className="flex items-start gap-3 px-5 py-2">
        <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-blue-shadow10 flex items-center justify-center">
          <FaLightbulb className="text-brand-blue text-xs" />
        </span>
        <p
          ref={textRef}
          className={`flex-1 min-w-0 text-sm leading-7 text-text-gray ${expanded ? 'max-h-32 overflow-y-auto pr-2' : 'truncate'}`}
        >
          <span className="font-semibold text-text-black mr-2">
            About this page
          </span>
          {text}
        </p>
        {(overflowing || expanded) && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="shrink-0 h-7 px-2 rounded-md text-xs font-semibold text-brand-blue hover:bg-blue-shadow10 flex items-center gap-1"
          >
            {expanded ? 'Show less' : 'Show more'}
            {expanded ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        )}
      </div>
    </aside>
  );
};

// ---------- phones: header button + bottom sheet ----------
export const PageDescriptionButton = () => {
  const entry = usePageDescription();
  const [open, setOpen] = useState(false);
  useEscapeToClose(() => setOpen(false), open);

  if (!entry?.text) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="About this page"
        title="About this page"
        className="md:hidden shrink-0 h-9 w-9 rounded-full bg-blue-shadow10 text-brand-blue flex items-center justify-center"
      >
        <FaLightbulb />
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-[66] bg-black bg-opacity-50 flex items-end"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="About this page"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[70dvh] overflow-y-auto bg-white rounded-t-2xl shadow-xl px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
          >
            <div className="sticky top-0 bg-white flex items-center justify-between py-4">
              <p className="font-semibold text-text-black flex items-center gap-2">
                <FaLightbulb className="text-brand-blue" />
                About this page
              </p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-text-gray"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm leading-6 text-text-gray">{entry.text}</p>
          </div>
        </div>
      )}
    </>
  );
};
