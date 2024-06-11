import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import AuthService from './services/AuthService.jsx'

const api = axios.create({
    baseURL:`${import.meta.env.url}`
})

api.interceptors.request.use(
    async(config)=>{
        var token = localStorage.getItem('token');
        if(token){
            const decodedToken = jwtDecode(token);
            const currTime = Date.now();

            if(decodedToken.exp < currTime){
                try{
                    const newToken = await AuthService.refreshToken();
                    token = newToken;
                }catch(error){
                    console.error('Failed to refresh token', error);
                    AuthService.logout();
                    window.location.href = '/login';
                }
            }

            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    }, 
    (error)=>{
        return Promise.reject(error);
    }
);

export default api;