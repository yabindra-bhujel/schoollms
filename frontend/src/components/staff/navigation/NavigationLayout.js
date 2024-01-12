// AdminLayout.js
import React from "react";
import AdminSideBar from "./Drawer";

const mainContentStyle = {
    marginTop: '72px',  
    
    marginLeft: '150px',
};

const AdminLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex',
        flexDirection: 'column',
         }}>  
            <AdminSideBar />
            <div style={mainContentStyle} className="main-content">
                {children}
            </div>
        </div>
    );
};


export default AdminLayout;
