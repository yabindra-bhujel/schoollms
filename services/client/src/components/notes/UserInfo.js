import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const UserInfoDialog = ({ loginuserData }) => {
  return (
    <DialogContent>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
        <Avatar 
        src={loginuserData.image}
         alt="User Avatar"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }} 

         />
        <div>
          <Typography variant="h6">
            {loginuserData.first_name} {loginuserData.last_name}
          </Typography>
          <Typography color="textSecondary">{loginuserData.username} (Admin)</Typography>
        </div>
      </div>
    </DialogContent>
  );
};

export default UserInfoDialog;
