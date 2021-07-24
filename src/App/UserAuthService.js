import { useEffect, useState } from 'react';

export default function UserAuthService() {
    
    const getUser = () => {
        const userString = sessionStorage.getItem('currentUser');
        const user = JSON.parse(userString);
        return user;
    };

    const getToken = () => {
        const token = sessionStorage.getItem('token');
        return token;
    }
    
    const [user, setUser] = useState(getUser());
    const [token, setToken] = useState(getToken())

    const saveUser = user => {
        sessionStorage.setItem('currentUser', user);
        setUser(user);
    };

    const saveToken = token => {
        sessionStorage.setItem('token', token);
        setToken(token);
    };

    return {
        setUser: saveUser,
        user,
        setToken: saveToken,
        token
    }

}