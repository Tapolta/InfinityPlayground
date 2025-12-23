import { Box, Button, CircularProgress, Container, FormControl, Grid2, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography, useTheme } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Delete, Edit, Upload } from '@mui/icons-material';
import api from '../../axiosConfig';
import { AppContext } from '../../AppProvider';

const gameGenres= [
  'adventure',
  'puzzle',
  'tactic',
  'calculation',
  'multiplayer'
]

const MenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: 'background.default2',
      boxShadow: 'none',
    },
  },
};

const getStyles = (genre, genres = [], theme) => {
  return {
    fontWeight: genres.includes(genre)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
};

const GamesHandle = () => {
  const theme = useTheme();
  const [gameDesc, setGameDesc] =useState([]);
  const { AddNotif, setPopUpContent } = useContext(AppContext);
  const [localLoading, setLocalLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(true);
  const [contentTypes, setContentTypes] = useState([])
  const [contentType, setContentType] = useState({
    id: '',
    app_label: '',
    model: ''
  })
  const [gameData, setGameData] =useState({
    Files: [],
    FileName: '',
    game_name: '',
    game_version: '',
    game_description: '',
    game_picture: '',
    genres: [],
  });
  const[editingData, setEditingData] = useState({
    id: '',
    game_name: '',
    game_version: '',
    game_description: '',
    game_picture: '',
    genres: [],
  });

  const getGameDesc = useCallback(async () => {
    setLocalLoading(true);
    try {
      const response = await api.get('api/base/game-desc/');
      setGameDesc(response.data);
    } catch (error) {
      console.log(`Tidak dapat fetching data games: ${error}`);
    }
    setLocalLoading(false);
  }, []);

  useEffect(() => {
    getGameDesc();
  }, [getGameDesc]); 

  useEffect(() => {
    const getContentTypes = async() => {
      try {
        const response = await api.get("api/get-content-type/");
        setContentTypes(response.data);
      } catch (error) {
        console.log("Gagal mengambil content type");
      }
    };

    getContentTypes();
  }, [])

  const handleUpdate = (data) => {
    setIsUpdate(data);
    setGameData({
      Files: [],
      FileName: '',
      game_name: '',
      game_version: '',
      game_description: '',
      game_picture: '',
      genres: [],
    })

    setEditingData({
      game_name: '',
      game_version: '',
      game_description: '',
      game_picture: '',
      genres: [],
    })
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (isUpdate) {
      setEditingData({
        ...editingData,
        [name]: type === 'checkbox' ? checked : value,
      })
    } else {
      setGameData({
        ...gameData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleImageChange = (e) => {
    if (!isUpdate) {
      setGameData({
        ...gameData,
        game_picture: e.target.files[0], 
      });
    } else {
      setEditingData({
        ...editingData,
        game_picture: e.target.files[0], 
      });
    }
    
  }

  const handleMultipleChoice = (e) => {
    const {
      target: { value },
    } = e;
    if (isUpdate) {
      setEditingData({
        ...editingData,
        genres: typeof value === 'string' ? value.split(',') : value,
      })
    } else {
      setGameData({
        ...gameData,
        genres: typeof value === 'string' ? value.split(',') : value,
      });
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (file.name.endsWith('.zip')) {
        setGameData({
          ...gameData,
          Files: files,
          FileName: file.name,
        });
      } else {
        AddNotif('Only ZIP files are allowed.');
        setGameData({
          ...gameData,
          Files: [],
          FileName: '',
        });
      }
    }
  };

  const handleUpdateGame = (index) => {
    const selectedIndex = index;

    if (selectedIndex !== '') {
      const data = gameDesc[selectedIndex];
      setEditingData({
        ...editingData,
        id: data.id,
        game_name: data.game_name,
        game_version: data.game_version,
        game_description: data.game_description,
        genres: data.genres.split(","),
      });

      setGameData({
        ...gameData,
        game_name: data.game_name,
        game_version: data.game_version,
        game_description: data.game_description,
        genres: data.genres.split(","),
        game_picture: data.game_picture
      })
    }
  };

  const handleContentTypeInput = (e) => {
    const index = e.target.value;
    
    if (index !== '') {
      const currentData = contentTypes[index]
      setContentType({
        id: currentData.id,
       app_label: currentData.app_label,
       model: currentData.model,
    })
    }
  }

  const submitUpload = async (e) => {
    e.preventDefault();

    if (!gameData.Files || gameData.Files.length === 0) {
      AddNotif('ZIP tidak boleh kosong!');
      return;
    }

    if (!gameData.game_picture) {
      AddNotif('Game Picture tidak boleh kosong!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('game_name', gameData.game_name);
      formData.append('game_version', gameData.game_version);
      formData.append('game_description', gameData.game_description);
      formData.append('genres', gameData.genres);
      formData.append('game_picture', gameData.game_picture);
      formData.append('content_type', contentType.id);
      Array.from(gameData.Files).forEach((file) => {
        formData.append('files', file);
      });

      await api.post('api/upload-game-folder/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      AddNotif('ZIP file successfully uploaded!', true);
      getGameDesc();
      setGameData({
        Files: [],
        FileName: '',
        game_name: '',
        game_version: '',
        game_description: '',
        game_picture: '',
        genres: [],
      });
    } catch (error) {
      AddNotif(error.response.data.message);
    }
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('game_name', editingData.game_name);
      formData.append('game_version', editingData.game_version);
      formData.append('game_description', editingData.game_description);
      formData.append('genres', editingData.genres);
      formData.append('game_picture', editingData.game_picture);
  
      if (gameData.Files && gameData.Files.length > 0) {
        Array.from(gameData.Files).forEach((file) => {
          formData.append('files', file);
        });
      }
  
      console.log(formData)
  
      await api.put(`api/base/game-desc/${editingData.id}/update-game/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      getGameDesc();
      AddNotif("Berhasil Update Data Permainan!", true);
      setEditingData({});
      setGameData({});
    } catch (error) {
      AddNotif(`${error}`);
    }
  };

  const gameInputField = (
    <>
     <Grid2 size={8}>
        <FormControl fullWidth>
          <InputLabel id="content-types" sx={{ color: 'text.dark' }}>
            Model Game
          </InputLabel>
          <Select
            labelId="content-types"
            id="content-types"
            label="Model Game"
            value={
              contentTypes.findIndex((item) => item.model === contentType.model) >= 0
              ? contentTypes.findIndex((item) => item.model === contentType.model)
              : ''
            }
            required
            onChange={handleContentTypeInput}
            sx={{ width: '100%' }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: 'background.default2',
                  boxShadow: 'none',
                },
              },
            }}
          >
            {contentTypes &&
              contentTypes.map((item, index) => (
                <MenuItem key={index} value={index}>
                  {item.model}
                </MenuItem>
              ))}
          </Select>
      </FormControl>
    </Grid2>
     <Grid2 size={4}>
        <Box>
          <Typography>{isUpdate ? "Update permainan ZIP" : "Upload permainan ZIP:"}</Typography>
          {gameData.FileName && gameData.Files.length > 0 && (
          <Typography sx={{ mt: 1, fontStyle: 'italic', color: 'text.default' }}>
            Selected file: <span style={{ color: 'green', fontWeight: 'bold' }}>{gameData.FileName}</span>
          </Typography>
        )}
        </Box>
        <input
          id="file-upload"
          type="file"
          accept=".zip"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button variant="contained" color="primary" component="span" sx={{ textTransform: 'none' }}>
            <Upload />
          </Button>
        </label>
      </Grid2>
     <Grid2 size={4} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box>
          {isUpdate ? 
          <>
          {editingData && (
              <Typography>Gambar saat ini:<span style={{color: 'green', fontWeight: 'bold'}}
              >{editingData.game_picture ? editingData.game_picture.name : gameData.game_picture}
              </span></Typography>
          )}
          </> : 
          <>
            <Typography>Unggah gambar permainan: :</Typography>
            {gameData.game_picture && (
              <Typography> Gambar yang dipilih: <span style={{color: 'green', fontWeight: 'bold'}}>{gameData.game_picture.name}</span></Typography>
            )}
          </>}
        <input
          id="game-picture"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
          />
        <label htmlFor="game-picture">
          <Button variant="contained" color="primary" component="span" sx={{ textTransform: 'none' }}>
            <Upload />
          </Button>
        </label>
        </Box>
      </Grid2>
       <Grid2 size={4}>
          <TextField
            label = 'game_name'
            name = 'game_name'
            value = {isUpdate ? editingData.game_name || [] :gameData.game_name || []}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            required
            slotProps={{
              inputLabel: {style: {color: theme.palette.text.primary}}
            }}
          />
      </Grid2>
      <Grid2 size={4}>
          <TextField
            label = 'game_version'
            name = 'game_version'
            value = {isUpdate ? editingData.game_version : gameData.game_version}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                handleInputChange(e);
              }
            }}
            fullWidth
            margin='normal'
            required
            slotProps={{
              inputLabel: {style: {color: theme.palette.text.primary}},
              htmlInput: { inputMode: 'decimal', pattern: '\\d*\\.?\\d*' }
            }}
          />
      </Grid2>
      <Grid2 size={4} sx={{alignSelf: 'center'}}>
          <TextField
            label = 'game_description'
            name = 'game_description'
            value = {isUpdate ? editingData.game_description : gameData.game_description}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            required
            slotProps={{
              inputLabel: {style: {color: theme.palette.text.primary}},
            }}
          />
      </Grid2>
      <Grid2 size={4} sx={{alignSelf: 'center'}}>
        <FormControl fullWidth sx={{mt:1}}>
          <InputLabel id="genres" sx={{color: 'text.primary'}}>Genres</InputLabel>
          <Select
            labelId="genres"
            id="genres"
            multiple
            required
            value={isUpdate ? editingData.genres : gameData.genres}
            onChange={handleMultipleChoice}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {gameGenres.map((genre) => (
              <MenuItem
                key={genre}
                value={genre}
                style={getStyles(genre, gameData.genres, theme)}
              >
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid2>
    </>
  )

  const uploadGameSection = (
      <form onSubmit={submitUpload}>
        <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8 }}>
          {gameInputField}
        </Grid2>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="submit" variant="contained" sx={{ mt: 2, width: '50%' }}>
            Upload permainan baru
          </Button>
        </Box>
      </form>
  );

  const updateGameSection = (
      <form onSubmit={submitUpdate}>
        <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8 }}>
          <Grid2 size={8} sx={{alignSelf: 'center'}}>
            <FormControl fullWidth>
              <InputLabel id="game-folder-label" sx={{ color: 'text.dark' }}>
                Nama Game
              </InputLabel>
              <Select
                labelId="game-folder-label"
                id="game-name"
                label="Nama Game"
                value={
                  gameDesc.findIndex((item) => item.game_name === gameData.game_name) >= 0
                    ? gameDesc.findIndex((item) => item.game_name === gameData.game_name)
                    : ''
                }
                required
                onChange={(e) => {handleUpdateGame(e.target.value)}}
                sx={{ width: '100%' }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: 'background.default2',
                      boxShadow: 'none',
                    },
                  },
                }}
              >
                {gameDesc &&
                  gameDesc.map((item, index) => (
                    <MenuItem key={index} value={index}>
                      {item.game_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid2>
          {gameData.game_name && gameInputField}
        </Grid2>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="submit" variant="contained" sx={{ mt: 2, width: '50%' }}>
            Update data permainan
          </Button>
        </Box>
      </form>
    );

  const inputDataGame = (
      <Container
        id='InputDataGame'
        maxWidth="md"
        sx={{
          border: '2px solid #ccc',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'background.default3',
          mt: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'text.primary',
          }}
        >
          Update atau Menambahkan Data Permainan
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: '8px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            onClick={() => handleUpdate(true)}
            disabled={isUpdate}
          >
            Update Game
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              padding: '8px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: 'secondary.dark',
              },
            }}
            onClick={() => handleUpdate(false)}
            disabled={!isUpdate}
          >
            Upload Game
          </Button>
        </Box>
  
        {isUpdate ? (
          <div>{updateGameSection}</div>
        ) : (
          <div>{uploadGameSection}</div>
        )}
  
      </Container>
    );
  
  const ShowAllGamesTable = () => {
    const EditHandle = (id, index) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }

      setIsUpdate(true);
      handleUpdateGame(index);
    };

    const DeleteHandle = async(id) => {
      try {
        const response = await api.delete(`api/base/game-desc/${id}`);
        getGameDesc();
        setGameData({
          Files: [],
          FileName: '',
          game_description: '',
          game_name: '',
          game_picture: '',
          game_version: '',
          genres: []
        });
        setEditingData({
          genres: [],
          game_description: '',
          game_name: '',
          game_picture: '',
          game_version: '',
          id: ''
        });
        AddNotif(`Berhasil menghapus permainan ${response.message}`, true);
      } catch (err) {
        AddNotif(`Gagal menghapus permainan ${err}`);
      }
    };

    const popUpDelete = (data) => {
      setPopUpContent([{content_name: "DeleteConfirm", data:data}, DeleteHandle])
    }
  
    return(
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          List Data Permainan
        </Typography>
        <TableContainer component={Paper} sx={{ bgcolor: 'background.default', borderRadius: 2, p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Game Name</TableCell>
                <TableCell align="center">Version</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Favourites</TableCell>
                <TableCell align="center">Accounts Played</TableCell>
                <TableCell align="center">Picture</TableCell>
                <TableCell align="center">Genres</TableCell>
                <TableCell align="center">Folder Path</TableCell>
                <TableCell align="center">game_model</TableCell>
                <TableCell align="center">created_date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!localLoading || gameDesc < 1) ? (
                gameDesc.length > 0 ? (
                  gameDesc.map((item, index) => (
                    <TableRow key={index + 1}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{item.game_name}</TableCell>
                      <TableCell align="center">{item.game_version}</TableCell>
                      <TableCell align="center">{item.game_description}</TableCell>
                      <TableCell align="center">{item.favourite_count}</TableCell>
                      <TableCell align="center">{item.account_played}</TableCell>
                      <TableCell align="center">
                        {item.game_picture ? (
                          <img 
                            src={item.game_picture} 
                            alt={item.game_name} 
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '8px' }} 
                          />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="center">{item.genres}</TableCell>
                      <TableCell align="center">{item.game_folder}</TableCell>
                      <TableCell align="center">{item.content_type}</TableCell>
                      <TableCell align="center">{item.created_date}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => EditHandle("InputDataGame", index)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => popUpDelete(item)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <Typography variant="body2" color="text.primary">
                        Tidak ada data.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Box 
                      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
                    >
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
  }

  return (
     <Box sx={{width: '100%', display: 'flex', flexDirection: 'column'}}>
      <Toolbar sx={{display: {xs: 'block', md: 'none'}}}/>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin Page - Game Handle
      </Typography>

      <Box>
        {inputDataGame}
      </Box>

      <Box sx={{mt:12}}>
       <ShowAllGamesTable />
      </Box>
    </Box>
  );
};
export default GamesHandle;
