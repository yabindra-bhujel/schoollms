import instance from "../../api/axios";



const addNewEvent = async (event) => {
    const endpoint = `/notification/addevent/`;
    
    try {
        const response = await instance.post(endpoint, event);
        return response;
    }
    catch (error) {
        return error.response;
    }
}

const deleteEvent = async (eventId) => {
    const endpoint = `/notification/delete_event/${eventId}/`;
    try{
        const response = await instance.delete(endpoint);
        return response;
    }catch(error){
        return error.response;
    }

}

const getEvents = async () => {
    const endpoint = `/notification/calendar/`;

    try{
        const response = await instance.get(endpoint);
        return response;
    }catch(error){
        return error.response;
    }
}

const updateEvent = async (event) => {
    const endpoint = `/notification/update_event_date/`;
    try{
        const response = await instance.put(endpoint, event);
        return response;
    }catch(error){
        return error.response;
    }

}

const makeClassCancellation = async (event) => {
    const endpoint = `/notification/make_class_cancellation/`;
    try{
        const response = await instance.put(endpoint, event);
        return response;
    }catch(error){
        return error.response;
    }

}

export { addNewEvent , deleteEvent, getEvents, updateEvent, makeClassCancellation}
