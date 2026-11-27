import React from 'react';
import SectionMenu from '../../shell/SectionMenu';

const BASE = '/pages/account/admin/branch-management';
const submenus = [
  { name: 'View all branches', link: '/' },
  { name: 'Create New branch', link: '/create-branch' },
];

const BranchSidebar = ({ selectedSubMenu, isOpen, setIsOpen }) => (
  <SectionMenu
    items={submenus.map((s) => ({ key: s.name, label: s.name, href: `${BASE}${s.link}` }))}
    activeKey={selectedSubMenu?.name}
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    title="Branches"
  />
);

export default BranchSidebar;
