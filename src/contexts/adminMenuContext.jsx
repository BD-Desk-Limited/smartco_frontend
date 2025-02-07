"use client";   
import React, { createContext, useContext, useState } from 'react';

const AdminMenuContext = createContext();
const UseAdminMenu = () => useContext(AdminMenuContext);

const AdminMenuProvider = ({ children }) => {
    const [selectedMenu, setSelectedMenu] = useState({
        name: 'Dashboard',
        icon: '/assets/dashboard.png',
        iconActive: '/assets/dashboard_active.png',
        link: '/',
    });

    return (
        <AdminMenuContext.Provider value={{ selectedMenu, setSelectedMenu }}>
            {children}
        </AdminMenuContext.Provider>
    );
};

export { UseAdminMenu, AdminMenuProvider };