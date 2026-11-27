import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import useEscapeToClose from '../ui/useEscapeToClose';

const isPhone = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 767px)').matches;

// The green "in this section" menu (e.g. View all branches / Create new branch).
// - md and up: unchanged: a small toggle that opens the green panel beside the page.
// - phones: a full-width bar naming the current page; it opens a drawer over the
//   page. Pages stack it above the content (flex-col md:flex-row), so the content
//   keeps the full width.
// items: [{ key, label, href }]
// floating: the old shared SideBar sat absolutely over the page; the per-section
//   copies sat in the page flow. Kept as-is on desktop.
const SectionMenu = ({
  items,
  activeKey,
  isOpen,
  setIsOpen,
  floating = false,
  title = 'In this section',
}) => {
  const router = useRouter();

  // the phone drawer is an overlay; the desktop panel is not, so this only acts on phones
  useEscapeToClose(() => isPhone() && setIsOpen(false), isOpen);

  const go = (item) => {
    if (isPhone()) setIsOpen(false);
    router.push(item.href);
  };

  const toggleButton = (extraClass = '') => (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Open section menu"
      aria-expanded={isOpen}
      className={`cursor-pointer py-2 px-3 bg-brand-green rounded-md m-0.5 w-10 ${extraClass}`}
    >
      <Image
        src="/assets/double_arrow_right.png"
        width={20}
        height={20}
        alt=""
        title="Open Sidebar"
      />
    </button>
  );

  const activeLabel = items.find((item) => item.key === activeKey)?.label;

  return (
    <div
      className={`text-sm ${floating ? 'md:absolute md:top-0 md:left-0 md:z-50' : ''}`}
    >
      {/* ---------- md and up: original panel ---------- */}
      <div className="hidden md:block">
        {isOpen ? (
          <motion.div
            initial={{ x: '-10%', y: '-10%' }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-brand-green h-[80vh] flex flex-col rounded-md m-2 py-1 text-text-white gap-3 ${floating ? 'w-36' : 'w-full'}`}
          >
            <p className="cursor-pointer w-full justify-end flex px-3">
              <Image
                src="/assets/arrow_left.png"
                onClick={() => setIsOpen(!isOpen)}
                width={10}
                height={10}
                alt="close"
                className="my-2"
              />
            </p>
            {items.map((item) => (
              <div
                key={item.key}
                onClick={() => go(item)}
                className={`p-1 rounded-sm mx-0.5 hover:shadow-md cursor-pointer hover:bg-text-white hover:text-brand-green ${activeKey === item.key ? 'bg-text-white text-brand-green' : ''}`}
              >
                {item.label}
              </div>
            ))}
          </motion.div>
        ) : (
          toggleButton()
        )}
      </div>

      {/* ---------- phones: section bar + drawer ---------- */}
      <div className="md:hidden px-2 pt-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-label={`${title}: ${activeLabel || 'pages'}`}
          className="w-full h-11 px-3 rounded-md bg-white border border-gray-border flex items-center justify-between gap-2 text-left"
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="h-6 w-6 shrink-0 rounded bg-brand-green flex items-center justify-center">
              <Image
                src="/assets/double_arrow_right.png"
                width={12}
                height={12}
                alt=""
              />
            </span>
            <span className="font-semibold text-text-black truncate">
              {activeLabel || title}
            </span>
          </span>
          <span className="flex items-center gap-1 text-xs text-text-gray shrink-0">
            Pages <FaChevronDown />
          </span>
        </button>
        {isOpen && (
          <div
            className="fixed inset-0 z-[66] bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.2 }}
              aria-label={title}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-72 max-w-[85vw] bg-brand-green text-text-white flex flex-col shadow-xl pt-[env(safe-area-inset-top)]"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-green-shadow3">
                <p className="font-semibold text-base">{title}</p>
                <button
                  type="button"
                  aria-label="Close section menu"
                  onClick={() => setIsOpen(false)}
                  className="p-2"
                >
                  <FaTimes />
                </button>
              </div>
              <ul className="flex flex-col py-2 overflow-y-auto">
                {items.map((item) => {
                  const active = activeKey === item.key;
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => go(item)}
                        aria-current={active ? 'page' : undefined}
                        className={`w-full text-left px-4 py-3 text-base ${active ? 'bg-text-white text-brand-green font-semibold' : ''}`}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionMenu;
