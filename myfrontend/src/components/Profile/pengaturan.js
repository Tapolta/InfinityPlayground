import { Box, Button, Collapse, Divider, FormControlLabel, Grid2, IconButton, List, ListItem, ListItemText, Switch, Typography } from "@mui/material";
import { useContext, useState } from "react";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutSystem from "./logout";
import { AppContext } from "../../AppProvider";

const InformasiSensitif = ({data}) => {
    return (
        <Box sx={{width: '100%',  mt: 2}}>
            <Typography variant="h4" sx={{mb:1}}>Informasi Sensitif</Typography>
            <List>
                <ListItem sx={{display: 'flex', justifyContent: 'space-between', ml: {xs: 0, md: 8}}}>
                    <Grid2 container spacing={0} width={'100%'} alignItems={'center'}>
                        <Grid2 size={4} >
                            <Typography>Email: </Typography>
                        </Grid2>
                        <Grid2 size={8}>
                            <Typography>khizgustavolta@gmail.com</Typography>
                        </Grid2>
                    </Grid2>
                </ListItem>
                <Divider />
                <ListItem sx={{display: 'flex', justifyContent: 'space-between', ml: {xs: 0, md: 8}, mt: 2}}>
                    <Grid2 container spacing={0} width={'100%'} alignItems={'center'}>
                        <Grid2 size={4}>
                            <Typography>Nomor Telepon: </Typography>
                        </Grid2>
                        <Grid2 size={8}>
                            <Typography>+62 819 3317 0550</Typography>
                        </Grid2>
                    </Grid2>
                </ListItem>
                <Divider />
            </List>
        </Box>
    )
}

const Keamanan = ({ data }) => {
    const [is2faEnabled, setIs2faEnabled] = useState(false);
    const {setPopUpContent} = useContext(AppContext);

    const popUpResetPassword = () => {
        setPopUpContent([{data:data, content_name: "ResetPassword"}, setPopUpContent])
    }

    const handle2faToggle = () => {
        setIs2faEnabled(!is2faEnabled);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" sx={{mb:1}}>Keamanan</Typography>
            <List>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', ml: {xs: 0, md: 8} }}>
                    <Grid2 container spacing={0} width={'100%'} alignItems={'center'}>
                        <Grid2 size={4}>
                            <Typography>Autentikasi Dua Faktor (2FA): </Typography>
                        </Grid2>
                        <Grid2 size={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={is2faEnabled}
                                        onChange={handle2faToggle}
                                        color="primary"
                                    />
                                }
                                label={is2faEnabled ? "Aktif" : "Nonaktif"}
                            />
                            
                        </Grid2>
                        <Grid2 size={4}>
                            {is2faEnabled && (
                                <Box>
                                    <Button variant="contained" color="primary">
                                        Verifikasi 2FA
                                    </Button>
                                </Box>
                            )}
                        </Grid2>
                    </Grid2>
                </ListItem>
                <Divider />

                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', ml: {xs: 0, md: 8}}}>
                    <Grid2 container spacing={0} width={'100%'} alignItems={'center'}>
                        <Grid2 size={4}>
                            <Typography>Reset Password: </Typography>
                        </Grid2>
                        <Grid2 size={8}>
                            <Box mt={2}>
                                <Button variant="contained" color="secondary" onClick={popUpResetPassword}>
                                    Reset Password
                                </Button>
                            </Box>
                        </Grid2>
                    </Grid2>
                </ListItem>
                <Divider />

                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', ml: {xs: 0, md: 8} }}>
                    <Grid2 container spacing={0} width={'100%'} alignItems={'center'}>
                        <Grid2 size={4}>
                            <Typography>Logout: </Typography>
                        </Grid2>
                        <Grid2 size={8}>
                            <Box mt={2}>
                                <LogoutSystem />
                            </Box>
                        </Grid2>
                    </Grid2>
                </ListItem>
            </List>
        </Box>
    );
}

const Pengaturan = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
        
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <List>
            <ListItem button="true" onClick={handleToggle} sx={{borderBottom: '0.1rem solid black'}}>
                <ListItemText primary="Pengaturan" />
                <IconButton sx={{color: "text.primary"}}>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button="true">
                        <InformasiSensitif />
                    </ListItem>
                    <ListItem button="true">
                        <Keamanan data={data} />
                    </ListItem>
                </List>
            </Collapse>
        </List>
    )
}

export default Pengaturan;