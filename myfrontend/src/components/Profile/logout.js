import { Button } from "@mui/material"
import { localStorageData } from "../../axiosConfig"
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { logOut } from "../../firebaseConfig";

const LogoutSystem = () => {
    const navigate = useNavigate()

    const Logout = () => {
        localStorage.removeItem(localStorageData.accessToken)
        localStorage.removeItem(localStorageData.refreshToken)
        navigate('/')
        window.location.reload();
        logOut();
    }

    return(
        <Button onClick={Logout} variant="contained" color="error" startIcon={<LogoutIcon />}>
            Logout
        </Button>
    )
}

export default LogoutSystem;