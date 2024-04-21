import React from 'react';
import moment from 'moment';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

const Notifications = ({ notifications }) => {
  const { t } = useTranslation();

  return (
    <div style={{ width: '300px' }}>
      {notifications.length > 0 ? (
        notifications.map((item, index) => (
          <div key={index}>
            <Typography variant="subtitle1" color="primary" style={{ fontWeight: 'bold' }}>
              {item.title} {item.is_read ? '' : '*'}
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
              {item.content}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {moment(item.timestamp).fromNow()}
            </Typography>
            <Divider variant="middle" style={{ margin: '8px 0' }} />
          </div>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          {t("header.noNotice")}
        </Typography>
      )}
    </div>
  );
};

export default Notifications;
