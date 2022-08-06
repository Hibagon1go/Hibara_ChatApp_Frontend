import axios from "axios";
import { toast } from 'react-toastify';

const axiosJWTClient = axios.create()

axiosJWTClient.interceptors.request.use(
    config => {
        const localJWT = localStorage.getItem("token");
        if (localJWT && config.headers) {
            config.headers.Authorization = 'Bearer ' + localJWT;
            return config
        }
        else {
            toast('ログインしなおして下さい')
            return 
        }   
    },
    error => {
        return Promise.reject(error)
    }
)


export default axiosJWTClient