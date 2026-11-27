import { FaChevronRight } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const SideMenu = ({
  items,
  depth,
  parentPath,
  hoverPath,
  activePath,
  onHover,
  onSelect,
  hasChildren,
}) => {
  const flyoutVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: 'easeOut' },
    },
    exit: { opacity: 0, x: -30, transition: { duration: 0.9, ease: 'easeIn' } },
  };

  return (
    <ul
      className={`${depth === 0 ? 'flex flex-col gap-1' : 'flex flex-col gap-1 py-2 px-1 rounded-r-xl'}
        h-full bg-brand-blue`}
    >
      {items.map((item) => {
        const path = [...parentPath, item.name];
        const expandable = hasChildren(item);
        const isHovered = hoverPath[depth] === item.name;
        const isActive =
          activePath[depth] === item.name &&
          activePath.slice(0, depth).every((n, i) => n === path[i]);
        const isOpen = expandable && isHovered;

        return (
          <li
            key={item.name}
            className="relative bg-brand-blue"
            onMouseEnter={() => onHover(path)}
          >
            <button
              type="button"
              onClick={() => onSelect(item, path)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm text-left whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-brand-green text-text-white font-semibold'
                  : isHovered
                    ? 'bg-green-shadow8'
                    : 'hover:bg-green-shadow8 text-text-white'
              }`}
            >
              <span>{item.label}</span>
              {expandable && (
                <motion.span
                  animate={{ x: isOpen ? 2 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs"
                >
                  <FaChevronRight />
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                // pl-2 bridges the gap so the pointer doesn't "leave" while moving across
                <motion.div
                  key={`${item.name}-flyout`}
                  variants={flyoutVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute left-full top-0 pl-2 z-50"
                >
                  <div className="md:min-w-[200px] bg-text-white rounded-lg shadow-lg border border-gray-border">
                    <SideMenu
                      items={item.subMenus}
                      depth={depth + 1}
                      parentPath={path}
                      hoverPath={hoverPath}
                      activePath={activePath}
                      onHover={onHover}
                      onSelect={onSelect}
                      hasChildren={hasChildren}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
};

export default SideMenu;
