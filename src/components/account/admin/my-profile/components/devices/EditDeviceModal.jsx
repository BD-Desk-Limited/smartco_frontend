import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';

const ALL_BRANCHES = '-1';

// Rename a trusted device and choose which branches it can access.
const EditDeviceModal = ({ device, branches, saving, error, onSave, onClose }) => {
  const [name, setName] = useState(device.deviceName);
  const [allBranches, setAllBranches] = useState(device.allBranches);
  const [selected, setSelected] = useState(() => new Set(device.branches.map((b) => String(b._id))));
  const [localError, setLocalError] = useState(null);

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 50) {
      return setLocalError('Device name must be 2 to 50 characters long.');
    }
    if (!allBranches && selected.size === 0) {
      return setLocalError('Select at least one branch.');
    }
    setLocalError(null);
    return onSave({
      deviceName: trimmed,
      deviceBranches: allBranches ? [ALL_BRANCHES] : [...selected],
    });
  };

  return (
    <div className="inset-0 z-50 flex justify-center items-center fixed bg-black bg-opacity-80 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-md rounded-md shadow-md flex flex-col overflow-hidden"
      >
        <h2 className="bg-brand-blue text-text-white text-center py-3">Edit device</h2>
        <div className="flex flex-col gap-4 p-5">
          <label className="text-sm font-semibold text-text-gray">
            Device name
            <input
              type="text"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 border border-gray-border rounded-md p-2 w-full text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold text-text-gray mb-1">Branches this device can access</legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allBranches}
                onChange={(e) => setAllBranches(e.target.checked)}
                className="h-4 w-4 accent-brand-blue"
              />
              All branches <span className="text-xs text-text-gray">(including ones added later)</span>
            </label>
            <div
              className={`max-h-48 overflow-y-auto border border-gray-border rounded-md p-2 flex flex-col gap-1 ${
                allBranches ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {branches.map((b) => (
                <label key={b._id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.has(String(b._id))}
                    onChange={() => toggle(String(b._id))}
                    className="h-4 w-4 accent-brand-blue"
                  />
                  {b.name}
                </label>
              ))}
              {branches.length === 0 && <span className="text-xs text-text-gray">No branches found.</span>}
            </div>
          </fieldset>

          {(localError || error) && <ErrorInterface error={localError || error} />}

          <div className="flex flex-row justify-center gap-5">
            <Button type="submit" text="Save" loading={saving} loadingText="Saving..." buttonStyle="px-5" />
            <Button
              onClick={onClose}
              text="Cancel"
              buttonStyle="bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 px-5"
            />
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default EditDeviceModal;
