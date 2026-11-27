import React from 'react';
import SectionMenu from '../../shell/SectionMenu';

const BASE = '/pages/account/admin/manage-materials';
const submenus = [
  { name: 'Create ungrouped Material', link: '/create-material' },
  { name: 'Create grouped Material', link: '/create-grouped-material' },
  { name: 'View ungrouped Materials', link: '/view-materials' },
  { name: 'View grouped Materials', link: '/view-grouped-materials' },
];

const MaterialSidebar = ({ selectedSubMenu, isOpen, setIsOpen }) => (
  <SectionMenu
    items={submenus.map((s) => ({ key: s.name, label: s.name, href: `${BASE}${s.link}` }))}
    activeKey={selectedSubMenu?.name}
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    title="Materials"
  />
);

export default MaterialSidebar;
