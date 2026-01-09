import Spinner from '@/components/account/Spinner';
import React, { useEffect, useRef } from 'react';
import ShiftManagementSidebar from './ShiftManagementSidebar';
import MovableCircle from './MovableCircle';

const ShiftManagement = ({ onClose, style }) => {
  const [minimized, setMinimized] = React.useState(true);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!minimized) {
      const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setMinimized(true);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [minimized]);

  if (minimized) {
    return <MovableCircle setMinimized={setMinimized} />;
  }

  if (!minimized) {
    return (
      <div
        className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-95 flex items-center justify-end z-50`}
      >
        <div ref={sidebarRef} className="w-[40%] h-full">
          <ShiftManagementSidebar style={style} setMinimized={setMinimized} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50`}
    >
      <Spinner />
    </div>
  );
};

export default ShiftManagement;
