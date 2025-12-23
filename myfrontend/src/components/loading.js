import { useContext } from "react";
import { AppContext } from "../AppProvider";
import { Box, CircularProgress } from "@mui/material";

const MainLoading = () => {
    const {isLoading} = useContext(AppContext)

    if(!isLoading) {
        return null;
    }

    return (
        <Box
        sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: "background.default",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        }}
        >
            <CircularProgress sx={{ color: 'white' }} />
        </Box>
    )
}

export default MainLoading;