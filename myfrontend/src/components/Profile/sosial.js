import { Avatar, Box, Button, Collapse, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { Fragment, useState } from "react";

const friendsData = [
    { id: 1, name: 'John Doe', avatar: '/path/to/avatar1.jpg' },
    { id: 2, name: 'Jane Smith', avatar: '/path/to/avatar2.jpg' },
    { id: 3232, name: 'Alice Johnson', avatar: '/path/to/avatar3.jpg' },
    { id: 4, name: 'Bob Brown', avatar: '/path/to/avatar4.jpg' },
  ];
  
const Teman = () => {
    return(
      <Box sx={{ width: '100%', position: 'relative', paddingBottom: '50px', mt: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Friend List</Typography>
        <List>
          {friendsData.map((friend) => (
            <Fragment key={friend.id}>
              <ListItem alignItems="center" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemAvatar>
                    <Avatar src={friend.avatar} alt={friend.name} />
                  </ListItemAvatar>
                  <ListItemText primary={friend.name} sx={{ marginLeft: 0.2 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemText primary={`${friend.id}`} sx={{ marginRight: 2 }} />
                  <Button variant="outlined" color="text.primary" sx={{ fontSize: { xs: 8, md: 12 } }}>Show Profile</Button>
                </Box>
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>

        <Box sx={{
          position: 'absolute',
          bottom: '20px',
          left: 0,
          width: '100%',
          height: '80px',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0))',
        }} />

        <Button 
          variant="contained" 
          color="primary" 
          sx={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: 3,
            fontSize: { xs: 8, md: 12 }
          }}
          onClick={() => console.log('Load more friends!')}
        >
          Tampilkan lebih banyak!
        </Button>
      </Box>
    )
}

const  Sosial = () => {
    const [open, setOpen] = useState(false);
        
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <List>
            <ListItem button="true" onClick={handleToggle} sx={{borderBottom: '0.1rem solid black'}}>
                <ListItemText primary="Sosial" />
                <IconButton sx={{color: "text.primary"}}>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button="true">
                        <Teman />
                    </ListItem>
                </List>
            </Collapse>
        </List>
    )
}

export default Sosial;