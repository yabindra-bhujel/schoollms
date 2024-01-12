import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";

const username = getUserInfo().username;


const getFolder = async () => {
    try {
      const endpoint = `/file_manager/${username}`;
      const response = await instance.get(endpoint);
      return response.data;
    } catch (e) {
        throw e;
    }
  }


const createFolder = async ( folderData) =>{
    try{
        const endpoint = `/file_manager/create_folder/`;
        const response = await instance.post(
            endpoint,
            folderData
            );
        return response.data;
    }catch(e){
        throw e;
    }
}

const deleteFolder = async (folderID) =>{
    try{
    const endpoint = `file_manager/delete_folder/${folderID}/`;
    const response = await instance.delete(endpoint);
    return response.data;
    }catch(e){
        throw e;

    }

}


const editFolderName = async (folderID,name) =>{
    try{
      const endpoint = `file_manager/update_folder/${folderID}/`;
        const response = await instance.put(endpoint,  name );
        return response.data;
    }catch(e){
        throw e;
    }

}


export {getFolder, createFolder, deleteFolder, editFolderName};

