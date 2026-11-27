import React from 'react';
import SectionMenu from '../../shell/SectionMenu';

const BASE = '/pages/account/admin/product-management';
const submenus = [
  { name: 'View All Products', link: '/' },
  { name: 'Create New Product', link: '/create-new-product' },
];

const ProductManagementSidebar = ({ selectedSubMenu, isOpen, setIsOpen }) => (
  <SectionMenu
    items={submenus.map((s) => ({ key: s.name, label: s.name, href: `${BASE}${s.link}` }))}
    activeKey={selectedSubMenu?.name}
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    title="Products"
  />
);

export default ProductManagementSidebar;
