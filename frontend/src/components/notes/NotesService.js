import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";


const username = getUserInfo().username;


const getNotesbyID = async(noteID) =>{
    const endpoint = `/notification/getNotesByID/${username}/${noteID}/`;

    try{
        const res = await instance.get(endpoint);
        const noteData = res.data;
        return noteData;
    }catch(error){
        console.error("Error fetching notes data: ", error);
        throw error;
    }

}


const getNotes = async() =>{
    const endpoint = `/notification/getNotes/${username}/`;

    try{
        const res = await instance.get(endpoint);
        const noteData = res.data;
        return noteData;
    }catch(error){
        console.error("Error fetching notes data: ", error);
        throw error;
    }
}

const addNotes = async( data ) =>{
    const endpoint = `/notification/addNotes/`;
    try{
        const res = await instance.post(endpoint, data);
        const noteData = res.data;
        return noteData;
    }catch(error){
        console.error("Error fetching notes data: ", error);
        throw error;
    }
    

}


const deleteNote = async (noteID) => {
    const endpoint = `/notification/deleteNotes/${noteID}/`;
    try {
      const res = await instance.delete(endpoint);
      const noteData = res.data;
      return noteData;
    } catch (error) {
      console.error("Error deleting note: ", error);
      throw error;
    }
  };


const updatedNotes = async (noteID, data) => {
    const endpoint = `/notification/updateNotes/${noteID}/`;
    try {
        const res = await instance.put(endpoint, data);
        const noteData = res.data;
        return noteData;
    } catch (error) {
        console.error("Error updating note: ", error);
        throw error;
    }
}

const updateNoteTitle = async (noteID, title) =>{
    const endpoint = `/notification/updateNotesTitle/${noteID}/`;
    try {
        const res = await instance.put(endpoint, {title: title});
        const noteData = res.data;
        return noteData;
    } catch (error) {
        console.error("Error updating note: ", error);
        throw error;
    }

}

const updateNoteColor = async (notes, color) =>{
    const endpoint = `/notification/updateNotesColor/${notes}/`;
    try {
        const res = await instance.put(endpoint, {color: color});
        const noteData = res.data;
        return noteData;
    } catch (error) {
        console.error("Error updating note: ", error);
        throw error;
    }
}

  
  

export  { getNotes, addNotes, deleteNote, updatedNotes, getNotesbyID, updateNoteTitle, updateNoteColor };