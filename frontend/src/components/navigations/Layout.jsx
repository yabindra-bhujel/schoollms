import React from "react";
import Sidebar from "./Sidebar";

const mainContentStyle = {
    marginTop: '72px',  // Top margin of 72px
    marginLeft: '80px', // Left margin of 80px
};

const Layout = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <main style={mainContentStyle}>{children}</main>
        </div>
    );
};

export default Layout;
