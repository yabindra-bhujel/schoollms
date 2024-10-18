import axios from "axios";

const BaseUrl = () => {
	return `/api/`;
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
