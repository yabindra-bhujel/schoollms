// Layout.js
import Header from '../navigations/header/header';
import Sidebar from '../navigations/sidebar/Sidebar';
import "./layout.css";
import  React, { useEffect, useState } from 'react';
import MobileMenu from './MobileMenu';

const Layout = ({ children }) => {
const [sidebarWidth, setSidebarWidth] = useState(() => {
  const storedWidth = localStorage.getItem('sidebarWidth');
  try {
    return storedWidth !== null ? JSON.parse(storedWidth) : true;
  } catch (error) {
    return true;
  }
});

const [isMobile, setIsMobile] = useState(false);

const checkScreenSize = () => {
  setIsMobile(window.innerWidth < 519);
};

console.log(isMobile);

useEffect(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  return () => {
    window.removeEventListener('resize', checkScreenSize);
  };
}, []);

const toggleSidebar = () => {
  setSidebarWidth((prevWidth) => {
    const newWidth = !prevWidth;
    localStorage.setItem('sidebarWidth', JSON.stringify(newWidth));
    return newWidth;
  });
};

return (
  <div className="main-container">
    {isMobile ? (
      <MobileMenu />
    ) : (
      <>
        <div
          className="main-sidebar"
          style={{
            width: sidebarWidth ? "200px" : "70px",
          }}
        >
          <Sidebar toggleSidebar={toggleSidebar} sidebarWidth={sidebarWidth} />
        </div>
        <div
          className="main-content"
          style={{
            width: sidebarWidth ? "calc(100% - 200px)" : "calc(100% - 70px)",
          }}
        >
          <div className="header-bar">
            <Header />
          </div>
          <div className="body-content">
            {children}
          </div>
        </div>
      </>
    )}
  </div>
);
};

export default Layout;
