import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const MaterialSidebar = ({ selectedSubMenu, isOpen, setIsOpen }) => {

  const submenus = [
    {
      name: 'Create Material',
      link: '/create-material',
    },
    {
      name: 'Create Grouped Material',
      link: '/create-grouped-material',
    },
    {
      name: 'View All Materials',
      link: '/view-materials',
    },
    {
      name: 'View Grouped Materials',
      link: '/view-grouped-materials',
    },
  ];

  const handleSelectSubMenu = (submenu) => {
    window.location.href = `/pages/account/admin/manage-materials${submenu.link}`;
  };

  return (
    <div className="text-sm">
      {isOpen ? (
        <motion.div
          initial={{ x: '-10%', y: '-10%' }}
          animate={{ x: 0, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-brand-green h-[80vh] w-full flex flex-col rounded-md m-2 py-1 text-text-white gap-3"
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
          {submenus.map((submenu, index) => (
            <div
              key={index}
              onClick={() => handleSelectSubMenu(submenu)}
              className={`p-1 rounded-sm mx-0.5 cursor-pointer hover:bg-text-white hover:text-brand-green ${selectedSubMenu.name === submenu.name ? 'bg-text-white text-brand-green' : ''}`}
            >
              {submenu.name}
            </div>
          ))}
        </motion.div>
      ) : (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer py-2 px-3 bg-brand-green rounded-md m-0.5"
        >
          <Image
            src="/assets/double_arrow_right.png"
            width={20}
            height={20}
            alt="open"
            title="Open Sidebar"
            className=""
          />
        </div>
      )}
    </div>
  );
};

export default MaterialSidebar;
