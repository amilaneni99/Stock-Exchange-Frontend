import { useState } from 'react';

export default function UserAuthService() {
    
    const getUser = () => {
        const userString = sessionStorage.getItem('currentUser');
        const user = JSON.parse(userString);
        return user;
    };
    
    const [user, setUser] = useState(getUser());

    const saveUser = user => {
        sessionStorage.setItem('currentUser', user);
        setUser(user);
    };

    return {
        setUser: saveUser,
        user
    }

}