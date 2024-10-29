import DialogContent from "@mui/material/DialogContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import "./style/Collaborator.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import React from "react";

const CollaboratorItem = ({
  image,
  fullname,
  username,
  role,
  isAdmin = false,
  handleRemoveUser,
}) => (
  <div className="collaborator_list">
    <div className="collaborator_list_item">
      <Avatar src={image} alt="User Avatar" className="user-av" />
      <div>
        <Typography variant="h6">{fullname}</Typography>
        <Typography color="textSecondary">
          {username} {role && `(${role})`}
        </Typography>
      </div>
    </div>
    <div className="collaborator_list_action">
      {!isAdmin && (
        <button
          onClick={() => handleRemoveUser(username)}
          className="remove-col"
        >
          <RiDeleteBin6Line size={25} className="remove-icon" />
        </button>
      )}
    </div>
  </div>
);

const Collaborators = ({ adminUserdata, collaborators, handleRemoveUser }) => {
  return (
    <DialogContent>
      <div>
        <CollaboratorItem
          image={adminUserdata.profile_image}
          fullname={`${adminUserdata.fullname} (You)`}
          username={adminUserdata.username}
          role="Admin"
          isAdmin={true}
        />

        {/* Collaborators List */}
        {collaborators.map((collaborator) => (
          <CollaboratorItem
            key={collaborator.username}
            image={collaborator.image}
            fullname={collaborator.fullname}
            username={collaborator.username}
            handleRemoveUser={handleRemoveUser}
          />
        ))}
      </div>
    </DialogContent>
  );
};

export default Collaborators;
