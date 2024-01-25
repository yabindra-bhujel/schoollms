import instance from "../../api/axios";


const getUserProfile = async (username) => {
    try {
        const endpoint = `get_user_profile_pic/${username}/`;
        const response = await instance.get(endpoint);
        return response;
    } catch (error) {
        throw error;
    }
    }


const uploadImage = async(image) =>{
    try {
        const endpoint = `update_user_profile_pic/`;
        const response = await instance.post(endpoint, image);
        return response;
    } catch (error) {
        throw error;
    }
}

const getUserProfileInfo = async() =>{
    try {
        const endpoint = `get_user_profile_details/`;
        const response = await instance.get(endpoint);
        return response;
    } catch (error) {
        throw error;
    }
}


const updateUserInfo = async(data) =>{
    try {
        const endpoint = `upadte_user_info/`;
        const response = await instance.post(endpoint, data);
        return response;
    } catch (error) {
        throw error;
    }
}

const chnagePassword = async(data) =>{
    try {
        const endpoint = `change_password`;
        const response = await instance.post(endpoint, data);
        return response;
    } catch (error) {
        throw error;
    }
}

const handleLogout = async () => {
    try {
        const endpoint = "api/logout/";
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.refresh) {
            const response = await instance.post(endpoint, { "refresh": userData.refresh });
            if (response.status === 200) {
                localStorage.removeItem("userData");
                window.location.href = "/login";
            }
        }
    } catch (error) {
        console.log(error);
    }
}


const checkTwoFactorAuth = async () => {
    try {
        const endpoint = "havetwoFactorAuth";
        const response = await instance.get(endpoint);
        return response;
    } catch (error) {
        throw error;
    }
}


const updateTwoFactorAuth = async (data) => {
    try {
        const endpoint = "update_two_factor_auth";
        const response = await instance.post(endpoint, data);
        return response;
    } catch (error) {
        throw error;
    
}
}




export { getUserProfile , uploadImage, getUserProfileInfo, updateUserInfo, chnagePassword, handleLogout, checkTwoFactorAuth, updateTwoFactorAuth};