import api from '../api';
import jwtDecode from 'jwt-decode';

const AuthService = {
    login: async(username, password)=>{
        const response = await api.post('/auth/login', {
            username: username,
            password: password
        });

        const accessToken = response.accessToken;
        const refreshToken = response.refreshToken;

        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        return jwtDecode(accessToken);

    },

    logout: ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },

    refreshToken: async()=>{
        const refreshToken = localStorage.getItem('refreshToken');
        if(!refreshToken){
            throw new Error('No refresh Token Available');
        }

        const response = await api.post('/auth/refreshToken', {token: refreshToken});

        const accessToken = response.accessToken;
        localStorage.setItem('token', accessToken);

        return accessToken;
    }
}

export default AuthService;