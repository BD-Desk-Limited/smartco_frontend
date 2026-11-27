import React, { useEffect, useId } from 'react';
import { FaLightbulb } from 'react-icons/fa';
import { usePageDescriptionApi } from './admin/shell/PageDescriptionSlot';

// Inside the admin frame this renders nothing: the text goes to the frame, which
// shows it as a bar at the bottom (md and up) or behind a lightbulb button in
// the header (phones). See admin/shell/PageDescriptionSlot.jsx.
// Outside the frame it falls back to the old inline box.
const PageDescription = ({ pageDescription }) => {
  const slot = usePageDescriptionApi();
  const id = useId();

  useEffect(() => {
    slot?.register(id, pageDescription);
  }, [slot, id, pageDescription]);

  useEffect(() => () => slot?.unregister(id), [slot, id]);

  if (slot) return null;

  return (
    <div className="bg-white p-3 mx-5 m-0 rounded-md italic text-text-gray max-h-20 overflow-y-auto relative">
      <h1 className="text-base font-semibold sticky top-0 pt-2 bg-white">
        <FaLightbulb className="inline text-brand-blue text-lg" /> Page
        description{' '}
      </h1>
      <span className="text-sm font-thin">{pageDescription}</span>
    </div>
  );
};

export default PageDescription;
