import React from 'react';
import SectionMenu from './SectionMenu';

// Section menu used by purchases, customers, reports and tax pages.
// sideBarSubmenus: [{ name, label, link }] with absolute links.
const SideBar = ({ selectedSubMenu, isOpen, setIsOpen, sideBarSubmenus }) => (
  <SectionMenu
    floating
    items={sideBarSubmenus.map((s) => ({
      key: s.name,
      label: s.label,
      href: s.link,
    }))}
    activeKey={selectedSubMenu}
    isOpen={isOpen}
    setIsOpen={setIsOpen}
  />
);

export default SideBar;
