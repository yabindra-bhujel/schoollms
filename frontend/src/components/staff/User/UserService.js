import instance from "../../../api/axios";


const getUserList = async() =>{
    const endpoint = `users/admin/`
    try{
        const response = await instance.get(endpoint)
        return response.data
    }catch(error){
        throw error
    }
}

export { getUserList }
