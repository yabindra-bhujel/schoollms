// Layout.js
import Sidebar from './Sidebar';

const Layout = ({ children }) => {

  return (
    <div>
      <div className="main-container">
        <div className="main-sidebar">
          <Sidebar/>
        </div>
        <div className="main-content">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
