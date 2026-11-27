import React from 'react';
import SectionMenu from '../../shell/SectionMenu';

const BASE = '/pages/account/admin/users-management';
const submenus = [
  { name: 'Create New User', link: '/create-user' },
  { name: 'View All Users', link: '/' },
];

const UsersManagementSidebar = ({ selectedSubMenu, isOpen, setIsOpen }) => (
  <SectionMenu
    items={submenus.map((s) => ({ key: s.name, label: s.name, href: `${BASE}${s.link}` }))}
    activeKey={selectedSubMenu?.name}
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    title="Users"
  />
);

export default UsersManagementSidebar;
