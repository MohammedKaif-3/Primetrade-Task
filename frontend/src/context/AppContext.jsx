import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContent = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = "http://localhost:8000";
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async () => {
        try {
            const {data} = await axios.get("http://localhost:8000" + "/api/auth/is-auth", {withCredentials: true});
            if(data.success){
                setIsLoggedIn(true);
                getUserData()
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const {data} = await axios.get("http://localhost:8000" + "/api/user/data", {withCredentials: true});
            console.log(data)
            data.success ? setUserData(data.userData) : console.log(data)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(()=> {
        getAuthState();
    }, [])

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}