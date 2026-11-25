import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaRegUser, FaUser } from 'react-icons/fa';
import SubHeader from '../../SubHeader';
import Header from '../../AdminHeader';
import { PROFILE_MENU_ITEMS } from './PROFILE_MENU_ITEMS';
import SideMenu from './SideMenu';

const hasChildren = (item) =>
  Array.isArray(item?.subMenus) && item.subMenus.length > 0;

// Walks the tree following `path` (array of names) and returns the matching items.
const resolvePath = (items, path) => {
  const chain = [];
  let level = items;
  for (const name of path) {
    const found = level?.find((i) => i.name === name);
    if (!found) break;
    chain.push(found);
    level = found.subMenus;
  }
  return chain;
};

const MyProfile = () => {
  const [activePath, setActivePath] = useState(['personal-information']);
  const [hoverPath, setHoverPath] = useState([]);
  const closeTimer = useRef(null);

  const activeChain = useMemo(
    () => resolvePath(PROFILE_MENU_ITEMS, activePath),
    [activePath]
  );
  const activeItem = activeChain[activeChain.length - 1];

  const handleHover = (path) => {
    clearTimeout(closeTimer.current);
    setHoverPath(path);
  };

  // Small delay so diagonal mouse movement toward a flyout doesn't collapse it.
  const handleMenuLeave = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setHoverPath([]), 200);
  };

  const handleSelect = (item, path) => {
    if (hasChildren(item)) {
      // Clicking a parent toggles its flyout (useful on touch devices).
      setHoverPath((prev) =>
        prev[path.length - 1] === item.name ? path.slice(0, -1) : path
      );
      return;
    }
    setActivePath(path);
    setHoverPath([]); // collapse back to depth 1
  };

  return (
    <div className="h-full flex flex-col">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title="My Profile" FirstComponents={<Logo />} />
      </div>

      <div className="flex flex-row gap-4 w-full overflow-y-hidden no-scrollbar bg-text-white flex-1 p-4 items-start">
        <div className="h-[420px] p-2">
          <h2 className="flex flex-row items-baseline mb-5 mt-7 text-lg text-brand-blue gap-2">
            <FaRegUser />
            <span>My Profile</span>
          </h2>
          <nav
            className="relative z-40 w-fit shrink-0 py-5 bg-brand-blue h-full rounded-bl-3xl shadow-sm p-2"
            onMouseLeave={handleMenuLeave}
            onMouseEnter={() => clearTimeout(closeTimer.current)}
          >
            <SideMenu
              items={PROFILE_MENU_ITEMS}
              depth={0}
              parentPath={[]}
              hoverPath={hoverPath}
              activePath={activePath}
              onHover={handleHover}
              onSelect={handleSelect}
              hasChildren={hasChildren}
            />
          </nav>
        </div>

        <section className="flex w-full justify-center bg-text-white rounded-lg shadow-sm p-4 h-[90%] overflow-y-auto scrollbar-thin relative">
          <div className="w-full">
            <p className="text-xs text-text-gray mb-3 text-left">
              {activeChain.map((i) => i.label).join(' / ')}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePath.join('/')}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {activeItem?.content || (
                  <div className="text-text-gray text-sm">
                    Nothing here yet.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyProfile;

const Logo = () => {
  return <FaUser className="mx-1 text-text-gray" />;
};
