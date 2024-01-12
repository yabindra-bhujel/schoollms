import React, { useEffect, useState } from "react";
import "./style/folterlist.css";
import instance from "../../api/axios";
import { FiDelete } from "react-icons/fi";
import { AiFillFolderAdd, AiFillEdit } from "react-icons/ai";
import { FaRegTrashCan } from "react-icons/fa6";

import Modal from "react-modal";
import getUserInfo from "../../api/user/userdata";
import FolderImage from "../images/folder.png";
import { createFolder, deleteFolder, editFolderName } from "./FileManagerService";

Modal.setAppElement("#root");
const userdata = getUserInfo();
const user_id = userdata.user_id;



const FileManagerFolderList = ({folders, getFolder, handleSelectFolder, selectedFolder}) => {
  const [deleteDiglog, setDeleteDiglog] = useState(false);
  const [renameDiglog, setRenameDiglog] = useState(false);
  const [newFolder, setNewFolder] = useState(false);
  const [seletedFolderid, setSeletedFolderid] = useState(null);



  const openCreateFolder = () => {
    setNewFolder(true);
  };
  const closeCreateFolder = () => {
    setNewFolder(false);
  };

  const openRenameDialog = (folderID) => {
    setSeletedFolderid(folderID);
    setRenameDiglog(true);
  };
  const closeRenameDialog = () => {
    setRenameDiglog(false);
  };

  const openDeleteDialog = (folderID) => {
    setSeletedFolderid(folderID);
    setDeleteDiglog(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDiglog(false);
  };



  return (
    <>
      {/* create new folder popup */}
      <Modal
        isOpen={newFolder}
        onRequestClose={closeCreateFolder}
        className="file-modal"
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal__content">
          <CreateNewFolder
            closeDialog={closeCreateFolder}
            request={getFolder}
          />
        </div>
      </Modal>

      {/* delete button popup */}

      <Modal
        isOpen={deleteDiglog}
        onRequestClose={closeDeleteDialog}
        className="file-modal"
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal__content">
          <DeleteFolder
            closeDialog={closeDeleteDialog}
            folderId={seletedFolderid}
            request={getFolder}
          />
        </div>
      </Modal>

      {/* rename folder name model */}

      <Modal
        isOpen={renameDiglog}
        onRequestClose={closeRenameDialog}
        className="rename_folder_model"
        shouldCloseOnOverlayClick={false}
      >
        <div className="rename___model">
          <RenameFolder
            closeRename={closeRenameDialog}
            folderId={seletedFolderid}
            request={getFolder}
          />
        </div>
      </Modal>

      <div className="file-manager__folder">
        <div className="folder_creaet_btn">
          <h2>My Folders</h2>
          <button onClick={openCreateFolder}>
            <AiFillFolderAdd className="folder_add" />
            <span>Create Folder</span>
          </button>
        </div>
        <div className="folder__items-container">
          {folders.map((folder, index) => (
            <div
            className={`folder__items ${
              selectedFolder === folder ? "selected__folder_items" : ""
            }`}
            onClick={() => handleSelectFolder(folder)}
            key={index}
          >
              <div className="folder_icons__name">
                <div className="folder_image">
                  <img src={FolderImage} alt="folder" />
                </div>
                <div className="folder__info">
                  <h3>{folder.name}</h3>
                  <strong>
                    {folder.total_file_count} files .{folder.formatted_size}
                  </strong>
                </div>
              </div>

              <div className="other-action">
                <button>
                  <AiFillEdit
                    onClick={() => openRenameDialog(folder.id)}
                    className="more"
                  />
                </button>
                <button>
                  <FiDelete
                    onClick={() => openDeleteDialog(folder.id)}
                    className="folder-delete"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FileManagerFolderList;

const DeleteFolder = ({ closeDialog, folderId, request }) => {
  const handleFolderDelete =  () => {
    deleteFolder(folderId)
    .then(() =>{
      closeDialog();
      request();
    })
    .catch((error) =>{
      console.error("Error deleting folder: ", error);
    });
    
  };

  return (
    <div className="delete__popup">
      <FaRegTrashCan className="delete__icon" />
      <h2>Are you sure you want to delete this folder?</h2>
      <div className="delete__popup__btn">
        <button className="cancle-btn" onClick={closeDialog}>
          Cancel
        </button>
        <button className="delete-btn" onClick={handleFolderDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

const RenameFolder = ({ closeRename, folderId, request }) => {
  const [newFileName, setNewFileName] = useState("New Name"); 

  const handleRename = async () => {
    const data = {
      name: newFileName,
    };

    editFolderName(folderId, data)
    .then(() =>{
      closeRename();
      request();
    })
    .catch((error) =>{
      console.error("Error renaming folder: ", error);
    });
    
  };

  return (
    <div className="folder__rename">
      <div className="rename__header">
        <h2>Rename Folder</h2>
      </div>
      <div className="input__foldername">
        <input
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)} 
          type="text"
          placeholder="New Folder Name"
          required
        />
      </div>
      <div className="cancle_btn_submit_btn">
        <button className="rename-cancle" onClick={closeRename}>
          Cancel
        </button>
        <button className="rename-save" onClick={handleRename}>
          Save
        </button>
      </div>
    </div>
  );
};

const CreateNewFolder = ({ closeDialog, request }) => {
  const [newFolderName, setNewFolderName] = useState("New Folder");
  


  const handleCreateFolder = () => {
    const data = {
      name: newFolderName,
      user: user_id,
    };

    createFolder(data)
    .then(() =>{
      closeDialog();
      request();

    })
    .catch((error) =>{
      console.error("Error creating new folder: ", error);
    });
    
  };
  // Check if newFolderName is empty to determine button disabled state
  const isSaveButtonDisabled = newFolderName.trim() === "";

  return (
    <div className="create__folder">
      <div className="create__folder__header">
        <h2>Create New Folder</h2>
      </div>
      <div className="input__foldername">
        <input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)} // Update newFolderName state
          type="text"
          placeholder="New Folder Name"
          required
        />
      </div>
      <div className="cancle_btn_submit_btn">
        <button className="create-cancle" onClick={closeDialog}>
          Cancel
        </button>
        <button
          className="create-save"
          onClick={handleCreateFolder}
          disabled={isSaveButtonDisabled}
        >
          Create
        </button>
      </div>
    </div>
  );
};
