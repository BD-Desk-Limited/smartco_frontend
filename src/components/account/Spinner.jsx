import React from 'react';

const Spinner = ({ size = 16, spaceHeight = '50vh', color = 'blue-500' }) => {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: spaceHeight }}
    >
      <div
        className={`w-${size} h-${size} border-4 border-${color} border-t-transparent border-solid rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
