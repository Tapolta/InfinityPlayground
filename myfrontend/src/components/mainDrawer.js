import { Box, Typography, AppBar, Divider, Drawer, IconButton, List, ListItem, ListItemButton, 
    ListItemIcon, ListItemText, Toolbar, useTheme, styled, alpha, InputBase,
    Button, Collapse,
    Card,
    CardContent,
    Paper,
    CircularProgress
 } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonIcon from '@mui/icons-material/Person';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import InfoIcon from '@mui/icons-material/Info';
import DiamondIcon from '@mui/icons-material/Diamond';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom'; 
import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { AppContext } from "../AppProvider";
import { baseApiUrl, localStorageData } from "../axiosConfig";
import { Games, Leaderboard, ExpandLess, ExpandMore } from "@mui/icons-material";
import LogoutSystem from "./Profile/logout";

const drawerWidth = 240;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const MenuContent = {
  'MenuItemsOne': {
    'Home': <HomeIcon />,
    'Favorit': <FavoriteIcon />,
    'Sedang Trend': <WhatshotIcon />,
    'Permainan Baru': <SportsEsportsIcon />
  },
  'MenuItemsTwo': {
    'Kontak': <ContactSupportIcon />,
    'Tentang': <InfoIcon />
  },
  'MenuItemsUser': {
    'Profil': <PersonIcon />,
    'Diamond': <DiamondIcon />,
    'Kontak': <ContactSupportIcon />,
    'Tentang': <InfoIcon />
  },
  'MenuItemsAdmin': {
    'Home': <HomeIcon />,
    'Profil': <PersonIcon />,
    'Diamond': <DiamondIcon />,
    'Permainan': {
      'Permainan' : <Games />,
      'Papan peringkat' : <Leaderboard />
    },
  }
}

function MainDrawer(props) {
    const theme = useTheme();
    const { isTokenValid, isAdmin } = useContext(AppContext);

    const { myWindow } = props;
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
  
    const handleDrawerClose = () => {
      setIsClosing(true);
      setMobileOpen(false);
    };
  
    const handleDrawerTransitionEnd = () => {
      setIsClosing(false);
    };
  
    const handleDrawerToggle = () => {
      if (!isClosing) {
        setMobileOpen(!mobileOpen);
      }
    };
    
    const LoginButton = () => {
        return(
          <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 3}}>
            <Button component={Link} to={`/login`} variant="contained" sx={{width: '80%'}}>Login</Button>
          </Box>
        )
    }

    const SearchComp = () => {
      const [query, setQuery] = useState("");
      const [isFocused, setIsFocused] = useState(false);
      const [results, setResults] = useState([]);
      const [loading, setLoading] = useState(false);
    
      useEffect(() => {
        const fetchData = async () => {
          if (query.trim() === "") {
            setResults([]);
            return;
          }
    
          setLoading(true);
          try {
            const response = await axios.get(`http://${baseApiUrl}api/mini-search`, {
              params: { q: query },
            });
            setResults(response.data.slice(0, 6)); 
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        };
    
        const delayDebounce = setTimeout(() => {
          fetchData();
        }, 500);
    
        return () => clearTimeout(delayDebounce);
      }, [query]);

      const handleKeyDown = (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
          navigate(`/search?q=${encodeURIComponent(query)}`);
        }
      };
    
      return (
        <Box position="relative">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Cari Post…"
              inputProps={{ "aria-label": "search" }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
            />
          </Search>
    
          {query && isFocused && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 10,
                mt: 1,
                boxShadow: 3,
                borderRadius: 1,
                overflowY: "auto",
                bgcolor: 'background.default'
              }}
            >
              {loading ? (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress size={20} />
                </Box>
              ) : results.length > 0 ? (
                results.map((item, index) => (
                  <Card key={index} sx={{ mb: 0.5, p: 1, cursor: "pointer", bgcolor: 'background.default2' }}>
                    <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                      <Typography variant="body2">{item.game_name}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" p={2} textAlign="center">
                  Tidak ada hasil
                </Typography>
              )}
            </Paper>
          )}
        </Box>
      );
    }
    
    const MainDrawer = () => { 
      const [openDropdown, setOpenDropdown] = useState(false);

      const handleDropdownClick = () => {
        setOpenDropdown(!openDropdown);
      };

      return(
      <div>

        <Toolbar sx={{userSelect: 'none', display: {}}}>  
          <img
            src="PraLogo.png"
            alt="logo"
            width={'100%'}
          />
        </Toolbar>

        <Divider />

        <List>
          {Object.entries((isAdmin && isTokenValid) ? MenuContent.MenuItemsAdmin : MenuContent.MenuItemsOne).map(([text, icon]) => (
              typeof icon === 'object' && text === 'Permainan' ? (
                <React.Fragment key={text}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDropdownClick}>
                      <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                        <Games />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {openDropdown ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
    
                  <Collapse in={openDropdown} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {Object.entries(icon).map(([subText, subIcon]) => (
                        <ListItem key={subText} disablePadding sx={{ pl: 4 }}>
                          <ListItemButton component={Link} to={`/${subText.toLowerCase().replace(' ', '-')}`}>
                            <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                              {subIcon}
                            </ListItemIcon>
                            <ListItemText primary={subText} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              ) : (
                <ListItem key={text} disablePadding>
                  <ListItemButton onClick={() => {
                    if (isTokenValid && isAdmin) {
                      navigate(`/${text.toLowerCase().replace(' ', '-')}`);
                      return;
                    }

                    const element = document.getElementById(`${text.toLowerCase().replace(' ', '-')}`);
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    } else {
                      navigate('/');
                    }
                    localStorage.setItem(`${localStorageData.sectionScroll}`, `${text.toLowerCase().replace(' ', '-')}`)
                  }}>
                    <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              )
          ))}
        </List>
          
        <Divider />

        <List>
          {!isAdmin && Object.entries(!isTokenValid ? MenuContent.MenuItemsTwo : MenuContent.MenuItemsUser).map(([text, icon]) => (
            <ListItem key={text} disablePadding>
              <ListItemButton component={Link} to={`/${text.toLowerCase().replace(' ', '-')}`}>
                <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                  {icon}
                </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
          ))}
        </List>
          
        {!isTokenValid && <LoginButton />}
        {isAdmin && isTokenValid &&
        <Box sx={{width: "100%", display: 'flex', justifyContent: 'center'}}> <LogoutSystem /></Box>}
      </div>
    )};
  
    const container = myWindow !== undefined ? () => window().document.body : undefined;
  
    return (
      <Box>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            display: {md: isAdmin && isTokenValid ? 'none' : 'block', xs: 'block'}
          }} color="primary">
          <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>

            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' }, color: 'white' }}>
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" fontWeight={'bold'} sx={{marginRight: 4}}>
                InfinityPlayground
            </Typography>

           {!isAdmin && <SearchComp />}

          </Toolbar>
        </AppBar>
        
        <Box
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: theme.palette.background.default},
            }}>
            <MainDrawer />
          </Drawer>
          
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: theme.palette.background.default, },
            }}
            open>
              <MainDrawer />
          </Drawer>
        </Box>
      </Box>
    );
  }

  export default MainDrawer;