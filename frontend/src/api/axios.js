import axios from "axios";

const BaseUrl = () => {
  return `http://127.0.0.1:8000/api`;
  // return `http://0.0.0.0:8000/api`;

};

const instance = axios.create({
  baseURL: BaseUrl(),
});

instance.interceptors.request.use(
  (config) => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const accessToken = storedUserData ? storedUserData.access : null;

    if (accessToken) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
