import React, { useState, useEffect } from 'react'
import Sidebar from '../components/navigation/Sidebar'
import MobileNavbar from '../components/navigation/MobileNavbar'
import Navbar from '../components/navigation/Navbar'

const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('fhasal_sidebar_collapsed')
      if (saved !== null) return saved === 'true'
      return typeof window !== 'undefined' ? window.innerWidth < 1024 : false
    } catch {
      return false
    }
  })

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileDrawerOpen) {
        setMobileDrawerOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileDrawerOpen])

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileDrawerOpen((prev) => !prev)
    } else {
      setIsCollapsed((prev) => {
        const next = !prev
        try {
          localStorage.setItem('fhasal_sidebar_collapsed', String(next))
        } catch {}
        return next
      })
    }
  }

  return (
    <div className="min-h-screen flex bg-fhasal-background relative">
      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform md:hidden transition-transform duration-300 ease-in-out ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          isCollapsed={false}
          isMobileOpen={mobileDrawerOpen}
          onCloseMobile={() => setMobileDrawerOpen(false)}
        />
      </div>

      {/* Desktop Persistent Sidebar */}
      <div
        className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Main Application Area */}
      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isCollapsed}
        />

        {/* Page Content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNavbar />
      </div>
    </div>
  )
}

export default MainLayout
