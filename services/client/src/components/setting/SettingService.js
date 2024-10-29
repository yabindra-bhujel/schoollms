import instance from "../../api/axios";

const getUserProfile = async () => {
  try {
    const endpoint = `users/profile/`;
    const response = await instance.get(endpoint);
    return response;
  } catch (error) {
    throw error;
  }
};

const uploadImage = async (image) => {
  try {
    const endpoint = `profile/me/`;
    const response = await instance.put(endpoint, image);
    return response;
  } catch (error) {
    throw error;
  }
};

const getUserProfileInfo = async () => {
  try {
    const endpoint = `users/profile_details/`;
    const response = await instance.get(endpoint);
    return response;
  } catch (error) {
    throw error;
  }
};

const updateUserInfo = async (data) => {
  try {
    const endpoint = `profile/update_user_profile_info/`;
    const response = await instance.put(endpoint, data);
    return response;
  } catch (error) {
    throw error;
  }
};

const chnagePassword = async (data) => {
  try {
    const endpoint = `password/chnage_password/`;
    const response = await instance.post(endpoint, data);
    return response;
  } catch (error) {
    throw error;
  }
};

const handleLogout = async () => {
  try {
    const endpoint = "api/logout/";
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.refresh) {
      const response = await instance.post(endpoint, {
        refresh: userData.refresh,
      });
      if (response.status === 200) {
        localStorage.removeItem("userData");
        window.location.href = "/login";
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const checkEmailNotification = async () => {
  try {
    const endpoint = "settings/have_email_notification/";
    const response = await instance.get(endpoint);
    return response;
  } catch (error) {}
};

const updateEmailNotification = async (data) => {
  try {
    const endpoint = "settings/update_setting/";
    const response = await instance.put(endpoint, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export {
  getUserProfile,
  uploadImage,
  getUserProfileInfo,
  updateUserInfo,
  chnagePassword,
  handleLogout,
  checkEmailNotification,
  updateEmailNotification,
};
