import { Box, CircularProgress, Container, Toolbar, Typography } from "@mui/material";
import UnityPlayer from "./unityTest";
import api, { baseApiUrl, localStorageData } from "../axiosConfig";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppProvider";
import FavoriteButton from "./FavoriteButton/favoriteButton";

const GamePage = () => {
    const [currentGameData, setCurrentGameData] = useState([]);
    const {isLoading, setLoadingCondition} = useContext(AppContext);
    const currentGame = localStorage.getItem(localStorageData.currentGame);

    useEffect(() => {
        const GetGameData = async() => {
            setLoadingCondition(true);
            try {
                const response = await api.post('api/get-current-game/', {game_name: currentGame});
                setCurrentGameData(response.data)
            } catch (error) {
                console.log("Error");
            }
            setLoadingCondition(false);
        }

        GetGameData();
    }, [currentGame, setLoadingCondition])
    
    if (isLoading){
        return(
            <CircularProgress />
        )
    }

    return (
        <Container sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: "center"}} maxWidth='lg'>
            <Toolbar />

            <Typography variant="h5" sx={{textAlign: 'center'}}>{currentGameData.game_name}</Typography>
            <UnityPlayer gameName={currentGameData.game_folder} baseUrl={baseApiUrl}/>
            <Box sx={{display: 'flex', flexDirection: 'column', width: "85%"}}>
                <Box sx={{ml: 1}}>
                    <FavoriteButton gameName={currentGameData.game_name}/>
                </Box>
                <Box 
                    sx={{ 
                        mt: 6, 
                        p: 3, 
                        borderRadius: 2, 
                        bgcolor: "rgba(255, 255, 255, 0.1)", 
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", 
                        backdropFilter: "blur(10px)",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: "#ff9800" }}>
                        Deskripsi Permainan
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.6, opacity: 0.9 }}>
                        {currentGameData.game_description}
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
};

export default GamePage;