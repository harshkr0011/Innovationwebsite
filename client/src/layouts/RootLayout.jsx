import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AICoFounder from '../components/AICoFounder';

const RootLayout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </main>
            <AICoFounder />
            <Footer />
        </div>
    );
};

export default RootLayout;
