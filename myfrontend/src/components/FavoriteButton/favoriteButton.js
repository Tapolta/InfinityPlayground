import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../axiosConfig';

const FavoriteButton = ({ gameName, isLogin}) => {
    const [likes, setLikes] = useState(0);
    const [isUserLike, setIsUserLike] = useState(false);
    const [localLoading, setLocalLoading] = useState(true);
    const handleFavourite = async() => {
        if (gameName === undefined || gameName === '') {
            return;
        }

        setLocalLoading(true)
       try {
       await api.post('api/base/likes/likes-add/', {"game_name": gameName});
        
        setLikes(likes + (isUserLike ? -1 : 1));
        setIsUserLike(!isUserLike);
       } catch (error) {
        console.log(error.response ? error.response.data : error);
       }
       setLocalLoading(false)
    }

    useEffect(() => {
        const GetFavouriteCount = async () => {
            setLocalLoading(true)

            try {
                const response = await api.post('api/base/likes/likes-count/', {'game_name': gameName});
                setLikes(response.data.likes_count);
                setIsUserLike(response.data.i_liked);
            } catch (error) {
                console.log(error.response ? error.response.data : error);
            }
            setLocalLoading(false)
        }
        
        if (gameName !== undefined) {
            GetFavouriteCount();
        }
    }, [gameName, isLogin])

    if (localLoading) {
        return(
            <CircularProgress />
        )
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <Button
             variant='outlined'
             sx={{
                minWidth: '1rem',
                padding: 0,
                borderRadius: '50%',
                width: '2.5rem',
                height: '2.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: 'none',
                bgcolor: 'red',
                position: 'absolute'
            }}
            onClick={handleFavourite}
            >
                {isUserLike ? <FavoriteIcon sx={{color: 'text.primary'}}/> :  <FavoriteBorderIcon sx={{width: '100%', color: 'text.primary'}}/>}
            </Button>
            <Typography sx={{ml: '3rem'}}>{likes} users menyukai{isUserLike ? " Dan anda menyukai" : ""}.</Typography>
        </Box>
    )
}

export default FavoriteButton;