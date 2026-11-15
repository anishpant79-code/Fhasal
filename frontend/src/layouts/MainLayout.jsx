
import React from 'react'
import Sidebar from '../components/navigation/Sidebar'
import MobileNavbar from '../components/navigation/MobileNavbar'
import Navbar from '../components/navigation/Navbar'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-fhasal-background">

      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Main Application Area */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNavbar />

      </div>

    </div>
  )
}

export default MainLayout
