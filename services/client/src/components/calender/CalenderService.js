import instance from "../../api/axios";


const baseURL = "calendar/";

const addNewEvent = async (event) => {
    const endpoint = baseURL;
    
    try {
        const response = await instance.post(endpoint, event);
        return response;
    }
    catch (error) {
        return error.response;
    }
}

const deleteEvent = async (eventId) => {
    const endpoint = `${baseURL}${eventId}/`;
    try{
        const response = await instance.delete(endpoint);
        return response;
    }catch(error){
        return error.response;
    }

}

const getEvents = async () => {
    const endpoint = baseURL;

    try{
        const response = await instance.get(endpoint);
        return response;
    }catch(error){
        return error.response;
    }
}

const updateEvent = async (event) => {
    const endpoint = `${baseURL}update_event_date/`;
    try{
        const response = await instance.put(endpoint, event);
        return response;
    }catch(error){
        return error.response;
    }

}

const makeClassCancellation = async (event) => {
    const endpoint = `${baseURL}make_class_cancellation/`;
    try{
        const response = await instance.put(endpoint, event);
        return response;
    }catch(error){
        return error.response;
    }

}

export { addNewEvent , deleteEvent, getEvents, updateEvent, makeClassCancellation}
