// Layout.js
import Header from '../navigations/header/header';
import Sidebar from '../navigations/sidebar/Sidebar';
import "./layout.css";
import  React, { useState } from 'react';

const Layout = ({ children }) => {
    // set sidebar width (70px or 200)
const [sidebarWidth, setSidebarWidth] = useState(() => {
  const storedWidth = localStorage.getItem('sidebarWidth');
  try {
    return storedWidth !== null ? JSON.parse(storedWidth) : true;
  } catch (error) {
    console.error('Error parsing storedWidth:', error);
    return true; // Use a default value or handle the error accordingly
  }
});

const toggleSidebar = () => {
  setSidebarWidth((prevWidth) => {
    const newWidth = !prevWidth;
    localStorage.setItem('sidebarWidth', JSON.stringify(newWidth));
    return newWidth;
  });
};

  return (
    <div>
      <div className="main-container">
        <div className="main-sidebar" style={{
          width: sidebarWidth ? "200px" : "70px",
        }}>
          <Sidebar toggleSidebar={toggleSidebar} sidebarWidth={sidebarWidth} />
        </div>
        <div className="main-content" style={{
          width: sidebarWidth ? "calc(100% - 200px)" : "calc(100% - 70px)",
        }}>
          <div className='header-bar' >
            <Header />
          </div>
          <div className="body-content">
              {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
