import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomeLayout = () => {

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <section className="lg:hidden">
                <Navbar />
            </section>

            <div className="flex">
                <section className="fixed hidden lg:block top-0 left-0 h-[95vh] mt-4 z-10">
                    <Sidebar className="h-[95vh]" />
                </section>

                <section className="flex-1 lg:ml-60 w-[10vw]">
                    <Outlet />
                </section>
            </div>

            <section className="mt-auto">
                <Footer />
            </section>
        </div>
    );
};

export default HomeLayout;