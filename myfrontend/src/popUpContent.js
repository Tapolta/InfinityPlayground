import { Box, IconButton } from "@mui/material";
import { useContext, useEffect } from "react";
import { AppContext } from "./AppProvider";
import { Close } from "@mui/icons-material";
import EditProfile from "./components/Profile/editProfile";
import DeleteConfirmation from "./components/deleteConfirmation";
import UserFavouriteGames from "./components/PopUp/userFavouriteGame";
import ResetPassword from "./components/PopUp/resetPassword";

const PopUpContent = () => {
    const {popUpContent, setPopUpContent} = useContext(AppContext);
    let content = <></>;

    const ClosePopUp = () => {
        setPopUpContent(null);
    }

    useEffect(() => {
        if (popUpContent) {
        document.body.style.overflow = 'hidden';
        } else {
        document.body.style.overflow = 'auto';
        }

    }, [popUpContent]);

    if (popUpContent === null) {
        return null;
    } else {
        const data = popUpContent[0].data;
        const callback = popUpContent[1];

        switch (popUpContent[0].content_name) {
            case null:
                content=<></>;
                break;
            case "EditProfile":
                content=<EditProfile data={data} callback={callback}/>;
                break;
            case "DeleteConfirm":
                content=<DeleteConfirmation data={data} callback={callback}/>;
                break;
            case "UserFavouriteGames":
                content=<UserFavouriteGames data={data} callback={callback}/>
                break;
            case "ResetPassword":
                content = <ResetPassword data={data} callback={callback}/>
                break;
            default:
                content=<></>;
        }
    }

    return(
        <Box sx={{
            position: 'fixed',
            zIndex: 9990,
            bgcolor: 'rgba(0,0,0,0.6)',
            height: '100vh',
            minWidth: '100vw',
            display: 'flex',
            alignItems: 'center',
        }}>
            <IconButton sx={{
                bgcolor: 'white', 
                right: 20, 
                top: 20, 
                position: 'absolute', 
                '&:hover': {
                bgcolor: 'rgba(255,255,255,0.5)'
            }}}
            onClick={ClosePopUp}
            >
                <Close />
            </IconButton>
            {content}
        </Box>
    )
}

export default PopUpContent;