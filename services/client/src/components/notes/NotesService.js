import instance from "../../api/axios";

const baseURL = 'notes/';

const getNotesbyID = async(noteID) =>{
    const endpoint = `${baseURL}${noteID}/`;

    try{
        const res = await instance.get(endpoint);
        const noteData = res.data;
        return noteData;
    }catch(error){
        throw error;
    }

}

const getNotes = async() =>{
    const endpoint = baseURL;

    try{
        const res = await instance.get(endpoint);
        const noteData = res.data;
        return noteData;
    }catch(error){
        throw error;
    }
}

const addNotes = async( data ) =>{
    const endpoint = baseURL;
    try{
        const res = await instance.post(endpoint, data);
        const noteData = res.data;
        return noteData;
    }catch(error){
        throw error;
    }
}


const deleteNote = async (noteID) => {
    const endpoint = `${baseURL}${noteID}/`;
    try {
      const res = await instance.delete(endpoint);
      const noteData = res.data;
      return noteData;
    } catch (error) {
      throw error;
    }
  };


const updatedNote = async (noteID, data) => {
    const endpoint = `${baseURL}${noteID}/`;
    try {
        const res = await instance.put(endpoint, data);
        const noteData = res.data;
        return noteData;
    } catch (error) {
        throw error;
    }
}

const updateNoteTitle = async (noteID, title) =>{
    const endpoint = `${baseURL}${noteID}/`;
    try {
        const res = await instance.put(endpoint, {title: title});
        const noteData = res.data;
        return noteData;
    } catch (error) {
        console.error("Error updating note: ", error);
        throw error;
    }

}


  
const updateNoteCollaborator = async (noteId, data) => {
    const endpoint = `${baseURL}share_note/${noteId}/`;

    try {
        const response = await instance.put(endpoint, data);
        return response;
    } catch (error) {
        throw error;
    }

}

export  { getNotes, addNotes, deleteNote, updatedNote, getNotesbyID, updateNoteTitle ,updateNoteCollaborator};