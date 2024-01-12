import React from 'react';
import moment from 'moment';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const Notifications = ({ notifications }) => {
  return (
    <div style={{ width: '300px' }}>
      {notifications.length > 0 ? (
        notifications.map((item, index) => (
          <div key={index}>
            <Typography variant="subtitle1" color="primary" style={{ fontWeight: 'bold' }}>
              {item.notification.title} {item.is_read ? '' : '*'}
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
              {item.notification.content}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {moment(item.notification.timestamp).fromNow()}
            </Typography>
            <Divider variant="middle" style={{ margin: '8px 0' }} />
          </div>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          You don't have any notifications.
        </Typography>
      )}
    </div>
  );
};

export default Notifications;
