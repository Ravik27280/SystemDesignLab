import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

export const MainLayout: React.FC = () => {
    return (
        <div className="page-container">
            <Sidebar />
            <div className="content-area flex flex-col">
                <Topbar />
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
