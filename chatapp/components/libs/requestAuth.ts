import axios from "axios";


const axiosJWTClient = axios.create()

axiosJWTClient.interceptors.request.use(
    config => {
        const localJWT = localStorage.getItem("token");
        if (localJWT && config.headers) {
            config.headers.Authorization = 'Bearer ' + localJWT;
            return config
        }
        else {
            alert('ログインしなおして下さい')
            return 
        }   
    },
    error => {
        return Promise.reject(error)
    }
)


export default axiosJWTClient