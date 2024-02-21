import instance from "../../../api/axios";


const getUserList = async(username) =>{
    const endpoint = `get_user_list`
    try{
        const response = await instance.get(endpoint)
        return response.data
    }catch(error){
        throw error
    }
}

export { getUserList }
