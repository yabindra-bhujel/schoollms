import axios from "axios";

// Function to generate the dynamic base URL
const getDynamicBaseUrl = () => {
    const currentURL = window.location.href;
    // Extract subdomain using regular expression
    const subdomainMatch = currentURL.match(/\/\/([^\.]+)\./);
    const subdomain = subdomainMatch ? subdomainMatch[1] : null;
    
    return `http://127.0.0.1:8000`; 
    // return `http://172.30.56.190:8000`;
};

// Create an Axios instance with the dynamic base URL
const instance = axios.create({
    baseURL: getDynamicBaseUrl(),
    // withCredentials: true,
});

export default instance;
