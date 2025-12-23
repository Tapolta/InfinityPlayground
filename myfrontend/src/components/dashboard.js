import { Box, Button, Typography, IconButton, Grid2, Card, CardMedia, CardContent, Divider } from "@mui/material";
import React, { useContext, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import { baseApiUrl, localStorageData } from "../axiosConfig";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { AppContext } from "../AppProvider";
import axios from "axios";
// import ReactPlayer from 'react-player';

export default function DashboardPage() {
    const [gameList, setGameList] = useState([]);
    const {isTokenValid} = useContext(AppContext);
    const navigate = useNavigate();
    const {setLoadingCondition, isLoading} = useContext(AppContext);

    useEffect(() => {
      const GetGameDesc = async() => {
        setLoadingCondition(true);
        try {
          const response = await axios.get(`http://${baseApiUrl}api/dashboard-games/`);
          setGameList(response.data);
        } catch (error) {
          console.log(`Terjadi kesalahan saat memuat game desc! ${error}`);
        }
        setLoadingCondition(false);
      }

      GetGameDesc();
    }, [setLoadingCondition])

    const SaveCurrentGame = (x) => {
        localStorage.setItem(localStorageData.currentGame,x);
        navigate(isTokenValid ? "/testGame" : "/login");
    }

    const Banner = () => {
        const [currentBannerContent, setCurrentBannerContent] = useState(0);
        const maxBannerContent = gameList.length - 1;
      
        const IncreaseIndexBanner = () => {
          setCurrentBannerContent((prev) => (prev < maxBannerContent ? prev + 1 : 0));
        };
      
        const DecreaseIndexBanner = () => {
          setCurrentBannerContent((prev) => (prev > 0 ? prev - 1 : maxBannerContent));
        };
      
        const handleDotClick = (index) => {
          setCurrentBannerContent(index);
        };
      
        const Slider = () => (
          <Box
            sx={{
              height: "100%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              width="100%"
              height="100%"
              alt="Game Banner"
              src={gameList[currentBannerContent].game_picture}
              style={{
                filter: "brightness(50%)",
                objectFit: "cover",
                transition: "opacity 0.5s ease-in-out",
              }}
            />
      
            <IconButton
              onClick={DecreaseIndexBanner}
              sx={{
                position: "absolute",
                left: "16px",
                color: "#fff",
                background: "rgba(0,0,0,0.5)",
                "&:hover": { background: "rgba(0,0,0,0.7)" },
              }}
            >
              <ArrowBack />
            </IconButton>
      
            <IconButton
              onClick={IncreaseIndexBanner}
              sx={{
                position: "absolute",
                right: "16px",
                color: "#fff",
                background: "rgba(0,0,0,0.5)",
                "&:hover": { background: "rgba(0,0,0,0.7)" },
              }}
            >
              <ArrowForward />
            </IconButton>
      
            <Box
              sx={{
                position: "absolute",
                bottom: "16px",
                display: "flex",
                gap: "8px",
              }}
            >
              {gameList.map((value, index) => (
                <Box
                  key={index}
                  onClick={() => handleDotClick(index)}
                  sx={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: index === currentBannerContent ? "#fff" : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                  }}
                />
              ))}
            </Box>
          </Box>
        );
      
        return (
          <Box component="main" sx={{ flexGrow: 1, position: "relative", overflow: "hidden" }}>
            <Box height="100vh">
              <Slider />
            </Box>
      
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#fff",
                textAlign: "center",
                zIndex: 2,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                {gameList[currentBannerContent].game_name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {gameList[currentBannerContent].genres}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "primary.main",
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
                onClick={() => SaveCurrentGame(gameList[currentBannerContent].game_name)}
              >
                Mainkan Sekarang!
              </Button>
            </Box>
          </Box>
        );
      };

    const ListGame = () => {
        return (
            <Box>
                <Typography variant="h5">Mulai jelajahi taman bermainmu!</Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 6,
                        padding: 2,
                        paddingTop: 6
                    }}
                >
                    {gameList.map((value, index) => (
                        <Box
                            onClick={() => SaveCurrentGame(value.game_name)}
                            key={index}
                            sx={{
                                borderRadius: "20px",
                                padding: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "14rem",
                                minWidth: 0,
                                boxShadow: "8px 8px 15px rgba(0, 0, 0, 0.1), -8px -8px 15px rgba(0, 0, 0, 0.3)",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                gap: 2,
                                cursor: "pointer",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.15), -6px -6px 10px rgba(0, 0, 0, 0.8)",
                                    filter: "brightness(100%)"
                                },
                                backgroundImage: `url(${value.game_picture})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: "brightness(50%)",
                                textDecoration:'none'
                            }}
                        >
                            <Typography variant="body1" color={"text.light"}>{value.game_name}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        const sectionId = localStorage.getItem(localStorageData.sectionScroll);
        if (sectionId) {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      }, 500); 
    
      return () => clearTimeout(timer);
    }, []);

    const FavouriteSection = () => {
      return (
        <section style={{ marginBottom: 20 }}>
          <Box id="favorit" sx={{pb:10}}></Box>
          <Typography id="favorit" variant="h4" fontWeight="bold" align="center" gutterBottom>
            Permainan Terfavorit!
          </Typography>
          <Grid2 container spacing={3} justifyContent="flex-start" sx={{ p: 4, mt: 2 }}>
          {gameList
          .sort((a, b) => b.favourite_count - a.favourite_count)
          .map((game, index) => (
            <Grid2 key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Card
                sx={{
                  maxWidth: 280,
                  aspectRatio: "3/4",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  '&:hover': { transform: "scale(1.05)", boxShadow: 6 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: 'pointer',
                  mb: 1,
                }}
                onClick={()=>SaveCurrentGame(game.game_name)}
              >
                <CardMedia
                  component="img"
                  image={game.game_picture || "/placeholder.jpg"}
                  alt={game.game_name}
                  sx={{
                    width: "80%",
                    aspectRatio: "3/4",
                    borderRadius: "12px 12px 0 0",
                  }}
                />
                <CardContent
                  sx={{ bgcolor: "background.default2", textAlign: "center", width: "100%" }}
                >
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    {game.game_name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
      </Grid2>
    </section>
      )
    }
    
    const SedangTrenSection = () => {
      return (
          <section style={{ marginBottom: 20 }}>
            <Box id="sedang-trend" sx={{pb:10}}></Box>
            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
              Permainan Trending!
            </Typography>
            <Grid2 container spacing={3} justifyContent="flex-start" sx={{ p: 4, mt: 2 }}>
            {gameList
            .sort((a, b) => b.account_played - a.account_played)
            .map((game, index) => (
              <Grid2 key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <Card
                  sx={{
                    maxWidth: 280,
                    aspectRatio: "3/4",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "0.3s",
                    '&:hover': { transform: "scale(1.05)", boxShadow: 6 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: 'pointer',
                    mb: 1,
                  }}
                  onClick={()=>SaveCurrentGame(game.game_name)}
                >
                  <CardMedia
                    component="img"
                    image={game.game_picture || "/placeholder.jpg"}
                    alt={game.game_name}
                    sx={{
                      width: "80%",
                      aspectRatio: "3/4",
                      borderRadius: "12px 12px 0 0",
                    }}
                  />
                  <CardContent
                    sx={{ bgcolor: "background.default2", textAlign: "center", width: "100%" }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      {game.game_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
        </Grid2>
      </section>
      )
    }

    const PermainanBaruSection = () => {
      return (
          <section style={{ marginBottom: 20 }}>
            <Typography id="permainan-baru" variant="h4" fontWeight="bold" align="center" gutterBottom>
              Permainan Terbaru!
            </Typography>
            <Grid2 container spacing={3} justifyContent="flex-start" sx={{ p: 4, mt: 2 }}>
            {gameList
            .sort((a, b) => new Date(b.created_date) - new Date(a.created_date)) // Sort by created_date
            .map((game, index) => (
              <Grid2 key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <Card
                  sx={{
                    maxWidth: 280,
                    aspectRatio: "3/4",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "0.3s",
                    '&:hover': { transform: "scale(1.05)", boxShadow: 6 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: 'pointer',
                    mb: 1,
                  }}
                  onClick={()=>SaveCurrentGame(game.game_name)}
                >
                  <CardMedia
                    component="img"
                    image={game.game_picture || "/placeholder.jpg"}
                    alt={game.game_name}
                    sx={{
                      width: "80%",
                      aspectRatio: "3/4",
                      borderRadius: "12px 12px 0 0",
                    }}
                  />
                  <CardContent
                    sx={{ bgcolor: "background.default2", textAlign: "center", width: "100%" }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      {game.game_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
        </Grid2>
      </section>
      )
    }

    //Main Return
    return (
        <Box sx={{width: '100%'}} id='home'>
            {(!isLoading && gameList.length > 0) ? 
            <>
                <Banner />
                <br />
                <ListGame />
                <Divider sx={{bgcolor: 'text.primary'}} />
                <br />
                <FavouriteSection />
                <Divider sx={{bgcolor: 'text.primary'}} />
                <br />
                <SedangTrenSection />
                <Divider sx={{bgcolor: 'text.primary'}} />
                <br />
                <PermainanBaruSection />
                <Divider sx={{bgcolor: 'text.primary'}} />
                <br />
            </> :  <>Loading...</>
            }
        </Box>
    );
}