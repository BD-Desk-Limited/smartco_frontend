import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import { useAuth } from '@/contexts/authContext';
import React from 'react'
import Greeting from './Greeting';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
    <div className='relative bg-background-1 h-screen w-full'>
        <div className="w-full sticky top-0 z-50">
            <Header />
        </div>
        <div className="w-full">
            <Greeting user={user} />
        </div>
        <div className="flex flex-col gap-5 w-full h-full items-center justify-center">

            <p className="text-4xl font-mono text-brand-green">Welcome to your dashboard</p>
            <p className="text-xl font-mono">Watch this space, fantastic functionalities are coming-up soonest!!! You will love it</p>
            <p className="text-xl font-mono">For now, you can explore the existing features and provide feedback.</p>


        </div>
    </div>
  )
};

export default AdminDashboard;