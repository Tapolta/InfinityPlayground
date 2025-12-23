import React, {createContext, useRef, useState} from "react";

export const  AppContext = createContext();

export const AppProvider = ({children}) => {
    const [isAdmin, setAdminCondition] = useState(false);
    const [isTokenValid, setTokenValidCondition] = useState(false);
    const [isLoading, setLoadingCondition] = useState(false);
    const notificationRef = useRef();
    const AddNotif = (message, success) => notificationRef.current.triggerNotification(message, success);
    const [popUpContent, setPopUpContent] = useState(null);

    return (
        <AppContext.Provider value={{
            isAdmin, setAdminCondition,
            isTokenValid, setTokenValidCondition,
            isLoading, setLoadingCondition,
            notificationRef, AddNotif,
            popUpContent, setPopUpContent
        }}>
            {children}
        </AppContext.Provider>
    )
}