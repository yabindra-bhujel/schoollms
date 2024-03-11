import React , {useEffect, useState} from "react";
import Layout from "../layout/Layout";
import FileManagerHeader from "./filemanager_header";
import "./style/file.css"
import FileManagerFolderList from "./FolderList";
import FileList from "./files";
import getUserInfo from "../../api/user/userdata";
import instance from "../../api/axios";
import { getFolder } from "./FileManagerService";




const FileManager = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState([]);
  



const userdata = getUserInfo();


  const fetchData = async () =>{
    try{
      const folderdata = await getFolder();
      setFolders(folderdata);
    }catch(erro){
      console.error("Error fetching folder data: ", erro);
    }
  
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectFolder = (folder) =>{
    setSelectedFolder(folder)
  }




    
    return (
        <Layout >

        <div className="file">
            <div className="file_manager_header">
            <FileManagerHeader/>
            </div>

            <div className="file_manager_body">
                <div className="file_manager_folder_site">
                <FileManagerFolderList selectedFolder={selectedFolder} folders= {folders} getFolder = {fetchData} handleSelectFolder = {handleSelectFolder}/>
                </div>
                <div className="file_manager_folder_content">
                    <FileList selectedFolder = {selectedFolder}/>
                </div>
            </div>



        </div>
        </Layout>

    );
}
export default FileManager;