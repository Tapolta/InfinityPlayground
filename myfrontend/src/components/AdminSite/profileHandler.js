import { useCallback, useContext, useEffect, useState } from "react";
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, CircularProgress, Toolbar } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Edit, Delete } from "@mui/icons-material";
import api from "../../axiosConfig";
import { AppContext } from "../../AppProvider";
import React from "react";

const ProfileHandler = () => {
    const [profileDatas, setProfileDatas] = useState([]);
    const [localLoading, setLocalLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProfile, setfilteredProfile] = useState([]);
    const { AddNotif, setPopUpContent } = useContext(AppContext);

    const GetProfileDatas = useCallback(async () => {
        setLocalLoading(true);
        try {
            const response = await api.get('api/base/profile/');
            setProfileDatas(response.data);
            setfilteredProfile(response.data);
        } catch (error) {
            AddNotif(`Gagal mengambil profileDatas: ${error}`);
        }
        setLocalLoading(false);
    }, [AddNotif]);

    useEffect(() => {
        GetProfileDatas();
    }, [GetProfileDatas]);

    const OpenEditProfile = (content, data) => {
        data['is_admin'] = true;
        setPopUpContent([{content_name:content, data:data},GetProfileDatas])
    }

    const DeleteProfile = (content, data) => {
        setPopUpContent([{content_name:content, data:data}, handleDelete])
    }

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
    
        const filteredData = profileDatas.filter((profile) => {
            const profileId = String(profile.profile_id).toLowerCase();
            const username = profile.username?.toLowerCase() || '';
    
            return (
                profileId.includes(query) || 
                username.includes(query)
            );
        });
    
        setfilteredProfile(filteredData);
    };

    const handleDelete = async (param) => {
        setLocalLoading(true);
        try {
            await api.delete(`api/base/profile/${param}`);
            AddNotif('Berhasil menghapus profile!', true);
            GetProfileDatas();
        } catch (error) {
            AddNotif(`Failed to delete profile: ${error}`);
        }
        setLocalLoading(false);
    };

    const handleRefresh = () => {
        GetProfileDatas();
    }

    return (
        <Container maxWidth="lg" sx={{ mt: '2rem'}}>
            <Toolbar sx={{display: {xs: 'block', md: 'none'}}}/>
            <Typography variant="h4" gutterBottom>Admin Panel - Profile Management</Typography>

            <TableContainer component={Paper} sx={{bgcolor: 'background.default'}}>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton sx={{color: 'text.dark'}} onClick={handleRefresh}><RefreshIcon /></IconButton>
                    <TextField 
                        size="small" 
                        placeholder="Cari Berdasarkan Username" 
                        value={searchQuery}
                        onChange={handleSearch}
                        sx={{
                            '& .MuiInputBase-root': { 
                                borderRadius: 50, 
                                backgroundColor: 'background.default', 
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
                                pr: 2 
                        }}}
                    />
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">id</TableCell>
                            <TableCell align="center">pofile_id</TableCell>
                            <TableCell align="center">user_realtion</TableCell>
                            <TableCell align="center">Avatar</TableCell>
                            <TableCell align="center">Username</TableCell>
                            <TableCell align="center">Bio</TableCell>
                            <TableCell align="center">Diamond</TableCell>
                            <TableCell align="center">Is_public</TableCell>
                            <TableCell align="center">created_at</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProfile.map((profile) => (
                            <TableRow key={profile.profile_id}>
                               <TableCell align="center">{profile.id}</TableCell>
                               <TableCell align="center">{profile.user}</TableCell>
                               <TableCell align="center">{profile.profile_id}</TableCell>
                               <TableCell align="center">
                                    <img src={profile.avatar} alt={profile.username} style={{ width: 50, height: 50, borderRadius: '50%' }} />
                                </TableCell>
                                <TableCell align="center">{profile.username}</TableCell>
                                <TableCell align="center">{profile.bio}</TableCell>
                                <TableCell align="center">{profile.diamond}</TableCell>
                                <TableCell align="center">{profile.is_public ? 'true':'false'}</TableCell>
                                <TableCell align="center">{profile.created_at}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => OpenEditProfile("EditProfile", profile)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => DeleteProfile("DeleteConfirm", profile)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {localLoading && <Box sx={{width: '100%',textAlign:'center', overflow: 'hidden', mt:6}}><CircularProgress /></Box>}
            </TableContainer>
        </Container>
    );
}

export default ProfileHandler;
