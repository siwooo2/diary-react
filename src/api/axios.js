import axios from "axios";

const api = axios.create({
    
    //spring server url
    baseURL: "http://localhost:8001/",
})

export default api ;