import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaTimes } from 'react-icons/fa';
import useEscapeToClose from '../../ui/useEscapeToClose';

// Phones (below md): the profile menu has hover fly-outs on desktop, which don't
// work on touch. Here it is a bar naming the open page; it opens a bottom sheet
// where sections expand in place (Security > My sessions ...).
const MobileProfileMenu = ({ items, activePath, activeChain, onSelect }) => {
  const [open, setOpen] = useState(false);
  // sections shown expanded in the sheet; starts with the open page's section
  const [expanded, setExpanded] = useState(() => activePath.slice(0, -1));
  useEscapeToClose(() => setOpen(false), open);

  const hasChildren = (item) =>
    Array.isArray(item?.subMenus) && item.subMenus.length > 0;

  const toggle = (name) =>
    setExpanded((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  const pick = (item, path) => {
    onSelect(item, path);
    setOpen(false);
  };

  const renderItems = (list, parents, depth) => (
    <ul className={depth === 0 ? 'flex flex-col' : 'flex flex-col border-l border-gray-border ml-4'}>
      {list.map((item) => {
        const path = [...parents, item.name];
        const isActive = activePath.join('/') === path.join('/');
        const inActiveBranch = activePath[depth] === item.name;
        if (hasChildren(item)) {
          const isOpen = expanded.includes(item.name);
          return (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => toggle(item.name)}
                aria-expanded={isOpen}
                className={`w-full flex items-center justify-between px-4 py-3 text-left ${inActiveBranch ? 'text-brand-blue font-semibold' : 'text-text-black'}`}
              >
                {item.label}
                {isOpen ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              {isOpen && renderItems(item.subMenus, path, depth + 1)}
            </li>
          );
        }
        return (
          <li key={item.name}>
            <button
              type="button"
              onClick={() => pick(item, path)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full text-left px-4 py-3 ${isActive ? 'bg-blue-shadow10 text-brand-blue font-semibold' : 'text-text-black'}`}
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="w-full h-11 px-3 rounded-md bg-brand-blue text-text-white flex items-center justify-between gap-2 text-sm"
      >
        <span className="truncate font-semibold">
          {activeChain.map((i) => i.label).join(' / ') || 'My Profile'}
        </span>
        <span className="flex items-center gap-1 text-xs shrink-0">
          Menu <FaChevronDown />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[66] bg-black bg-opacity-50 flex items-end"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Profile menu"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[80dvh] overflow-y-auto bg-white rounded-t-2xl shadow-xl pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-sm"
          >
            <div className="sticky top-0 bg-white flex items-center justify-between px-4 py-3 border-b border-gray-border">
              <p className="font-semibold text-text-black">My Profile</p>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-text-gray"
              >
                <FaTimes />
              </button>
            </div>
            {renderItems(items, [], 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileProfileMenu;
