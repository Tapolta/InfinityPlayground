import { Avatar, Box, Card, CardContent, CardMedia, Chip, Collapse, Grid2, IconButton, List, ListItem, ListItemText, Stack, Typography, useMediaQuery, Divider } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useTheme } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../axiosConfig";
import { AppContext } from "../../AppProvider";
import { Star, EmojiEvents, MilitaryTech, SportsEsports  } from '@mui/icons-material';

const  GameFavorit = ({ dataGames, context }) => {
    const [page, setPage] = useState(0);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const itemsPerPage = isSmallScreen ? 1 : 3;
  
    const handleNextPage = () => {
      if ((page + 1) * itemsPerPage < dataGames.length) {
        setPage(page + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (page > 0) {
        setPage(page - 1);
      }
    };

    const statistikPopUp = (index) => {
      const data = dataGames[index]
      context([{data: data, content_name:"UserFavouriteGames"}, context])
    }

    if (dataGames === undefined) {
      return <Typography>Terjadi kesalahan</Typography>
    }  
  
    return (
      <Box p={3} sx={{ background: "#0d1117", borderRadius: 4, boxShadow: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#FFF", textAlign: "center", fontWeight: "bold" }}>
        🎮 Game Favorit
      </Typography>

      <Box position="relative" display="flex" alignItems="center" overflow="hidden">
        {page > 0 && (
          <IconButton
            onClick={handlePrevPage}
            sx={{
              position: "absolute",
              left: 0,
              zIndex: 1,
              backgroundColor: "#21262d",
              color: "#FFF",
              boxShadow: 3,
              '&:hover': { backgroundColor: "#30363d" }
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
        )}

        <AnimatePresence initial={false}>
          <Stack
            key={page}
            direction="row"
            spacing={3}
            component={motion.div}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {dataGames.length > 0 ? (
              dataGames.map((game, index) => (
                <Card
                  key={index}
                  sx={{
                    minWidth: 260,
                    maxWidth: 300,
                    borderRadius: 4,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
                    background: "linear-gradient(135deg, #1f2937, #374151)",
                    color: "#FFF",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.4s",
                    '&:hover': {
                      transform: "scale(1.05)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.8)",
                    }
                  }}
                  onClick={() => statistikPopUp(index)}
                >
                  <Chip
                    label="❤️ Favorite"
                    color="secondary"
                    size="small"
                    sx={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}
                  />
                  <CardMedia
                    component="img"
                    height="150"
                    image={game.game_picture_url}
                    alt={game.game_name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {game.game_name}
                    </Typography>
                    <Typography variant="body2" color="#9ca3af">
                      {game.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography color="#FFF">*User belum menyukai permainan manapun</Typography>
            )}
          </Stack>
        </AnimatePresence>

        {(page + 1) * itemsPerPage < dataGames.length && (
          <IconButton
            onClick={handleNextPage}
            sx={{
              position: "absolute",
              right: 0,
              zIndex: 1,
              backgroundColor: "#21262d",
              color: "#FFF",
              boxShadow: 3,
              '&:hover': { backgroundColor: "#30363d" }
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </Box>
    </Box>
    );
}

const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; 
const PeringkatTertinggi = ({ topScore }) => {
  if (topScore === undefined) {
    return <Typography>Terjadi kesalahan</Typography>
  }

  const leaderboardData = Object.entries(topScore).map(([game, data]) => ({
      id: `${game}-${data.username}`,
      game,
      ...data,
      avatar: `https://ui-avatars.com/api/?name=${data.username}`,
  }));

  const sortedData = leaderboardData.sort((a, b) => a.rank - b.rank);

  return (
      <Box p={3} width="100%" sx={{ backgroundColor: '#1a1a1a' }}>
          <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold" color="#FFF">
              🏆 Peringkat Tertinggi
          </Typography>

          <Grid2 container spacing={3} justifyContent="center">
              {sortedData.map((player, index) => (
                  <Grid2 xs={12} sm={6} md={4} lg={3} key={player.id}>
                      <Card
                          sx={{
                              background: 'linear-gradient(145deg, #2a2a2a, #3a3a3a)',
                              color: '#FFF',
                              borderRadius: 4,
                              boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                              transition: 'transform 0.3s',
                              '&:hover': { transform: 'translateY(-8px)' },
                              position: 'relative',
                              p: 2,
                          }}
                      >
                          <Chip
                              icon={index === 0 ? <EmojiEvents /> : index === 1 ? <MilitaryTech /> : <Star />}
                              label={`#${player.rank}`}
                              sx={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                  backgroundColor: rankColors[index] || '#555',
                                  color: '#000',
                                  fontWeight: 'bold',
                              }}
                          />

                          <CardContent>
                              <Stack direction="column" alignItems="center" spacing={1}>
                                  <Avatar
                                      src={player.avatar}
                                      sx={{
                                          width: 80,
                                          height: 80,
                                          border: `3px solid ${rankColors[index] || '#FFF'}`,
                                      }}
                                  />
                                  <Typography variant="h6" fontWeight="bold">
                                      {player.username}
                                  </Typography>
                                  <Chip
                                      label={player.game}
                                      icon={<SportsEsports />}
                                      sx={{ backgroundColor: '#4a4a4a', color: '#FFF', mt: 1 }}
                                  />
                                  <Divider sx={{ width: '100%', my: 1, background: '#666' }} />
                                      <Grid2 container spacing={2}>
                                      {Object.entries(player).map(([key, value]) => (
                                        key !== 'username' &&
                                        key !== 'rank' &&
                                        key !== 'avatar' &&
                                        key !== 'game' &&
                                        key !== 'id' &&
                                        (
                                            <Grid2 size={12} key={key} variant="body2" color="#FFD700" fontWeight="bold"textAlign={'center'}>
                                                {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
                                            </Grid2>
                                        )
                                    ))}
                                      </Grid2>
                              </Stack>
                          </CardContent>
                      </Card>
                  </Grid2>
              ))}
          </Grid2>
      </Box>
  );
};

const StatistikDanAktivitas = () => {
    const [open, setOpen] = useState(false);
    const [dataGames, setDataGames] = useState([]);
    const {setPopUpContent} = useContext(AppContext)

    useEffect(() => {
      const FetchGamesData = async() => {
        try {
          const response = await api.get("api/base/user-api/user-games-favourite");
          setDataGames(response.data);
        } catch (error) {
          console.log(error);
        }
      }

      FetchGamesData();
    }, [])
    
    const handleToggle = () => {
        setOpen(!open);
    };

    return(
        <List>
            <ListItem button="true" onClick={handleToggle} sx={{borderBottom: '0.1rem solid black'}}>
                <ListItemText primary="Statistik dan Aktivitas" />
                <IconButton sx={{color: "text.primary"}}>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button="true" sx={{display: 'flex', justifyContent: 'center'}}>
                        <GameFavorit  dataGames={dataGames.favorite_games} context={setPopUpContent}/>
                    </ListItem>
                    <ListItem button="true">
                        <PeringkatTertinggi topScore={dataGames.top_score} />
                    </ListItem>
                </List>
            </Collapse>
        </List>
    )
}

export default StatistikDanAktivitas;