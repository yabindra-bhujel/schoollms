import React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { FaUser } from 'react-icons/fa';

const CollaboratorAvatars = ({ collaborators = [] }) => {
  const MAX_AVATARS = 3;
  const avatarSize = 24;

  return (
    <AvatarGroup max={MAX_AVATARS}>
      {collaborators.slice(0, MAX_AVATARS).map(collaborator => (
        collaborator.image ? (
          <Avatar
            alt={collaborator.username}
            src={collaborator.image}
          />
        ) : (
          <Avatar
          alt={collaborator.username} >
            <FaUser />
          </Avatar>
        )
      ))}
      {collaborators.length > MAX_AVATARS && (
        <Avatar>
          +{collaborators.length - MAX_AVATARS}
        </Avatar>
      )}
    </AvatarGroup>
  );
};

export default CollaboratorAvatars;
