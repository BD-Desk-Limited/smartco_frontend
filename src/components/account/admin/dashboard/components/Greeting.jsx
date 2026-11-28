import React from 'react'
import { firstName } from '@/utilities/stringUtils';

const Greeting = ({ user }) => {
    const getGreatingMessage = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12 && currentHour >= 5) {
            return 'Good Morning 🌅';
        } else if (currentHour < 18 && currentHour >= 12) {
            return 'Good Afternoon 🌞';
        } else if (currentHour < 22 && currentHour >= 18) {
            return 'Good Evening 🌜';
        } else {
            return 'You should be sleeping by now! 🙄, working late!';
        }
    };

  return (
    <div className="h-fit flex justify-between w-full border-y-2 border-gray-border shadow-md p-1 bg-text-white">
      <div className="font-bold flex flex-col justify-start items-start text-brand-green shadow-sm">
        <span>
            {user && `Hello, ${firstName(user?.fullName)}`}
        </span>
        <span className="flex justify-center items-center text-sm font-thin">
          {getGreatingMessage()}
        </span>
      </div>
      
    </div>
  );
};

export default Greeting;