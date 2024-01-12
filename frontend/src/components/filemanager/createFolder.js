import React from "react";

const CreateFolder = () => {
    return (
        <div className="create-folder">
        <div className="create-folder__header">
            <span className="create-folder__header__title">Create Folder</span>
            <span className="create-folder__header__close">X</span>
        </div>
        <div className="create-folder__body">
            <input
            type="text"
            className="create-folder__body__input"
            placeholder="Enter folder name"
            />
            <button className="create-folder__body__btn">Create</button>
        </div>
        </div>
    );
    }
    export default CreateFolder;
    