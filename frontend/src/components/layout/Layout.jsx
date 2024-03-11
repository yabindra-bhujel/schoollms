// Layout.js
import Header from '../navigations/header';
import Sidebar from '../navigations/sidebar/Sidebar';
import "./layout.css";

const Layout = ({ children }) => {

  return (
    <div>
      <div className="main-container">
        <div className="main-sidebar">
          <Sidebar/>
        </div>
        <div className="main-content">
          <div className='header-bar'>
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
