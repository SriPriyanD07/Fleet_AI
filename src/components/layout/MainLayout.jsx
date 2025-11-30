import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div 
          className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${mobileSidebarOpen ? 'block' : 'hidden'}`}
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex h-full flex-col bg-white shadow-lg">
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto bg-indigo-600 pt-5 pb-4">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <Header 
          onMenuClick={toggleMobileSidebar}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
        
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
