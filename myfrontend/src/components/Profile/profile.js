import { Box, Container, Toolbar, Typography, Divider, useTheme, Button,  CircularProgress, Avatar } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCallback, useContext, useEffect, useState } from "react";
import api, { baseApiUrl }  from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import DiamondIcon from '@mui/icons-material/Diamond';
import { AppContext } from "../../AppProvider";
import StatistikDanAktivitas from "./statistikDanAktivitas";
import Sosial from "./sosial";
import Pengaturan from "./pengaturan";
import PersonIcon from '@mui/icons-material/Person';

const initialData = {
    id: '',
    username: '',
    bio: '',
    avatar: '',
    profile_id: '',
    is_public: true,
    diamond: 0,
};

const Profile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {setPopUpContent} = useContext(AppContext)
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const fetchProfileData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('api/get-profile-data/');
            setData(response.data);
        } catch (err) {
            if (err.response?.status === 400) {
                navigate('/create-profile');
            } else {
                setErr(err.response?.data?.detail || 'Terjadi kesalahan.');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const OnEdit = () => {
        setPopUpContent([{content_name:"EditProfile", data:data}, fetchProfileData])
    }

    const SectionOne = () => (
        <section>
            <Toolbar />
            <Box sx={{ mt: 2, mb: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                {data.avatar ? (
                <img
                    src={`http://${baseApiUrl}${data.avatar}`}
                    alt="fotoProfile"
                    width={80}
                    height={80}
                    style={{ borderRadius: '100%' }}
                />
            ) : (
                <Avatar sx={{ width: 80, height: 80 }}>
                    <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                )}
                <Box>
                    <Typography variant="h6" fontWeight={'bold'}>{data.username}</Typography>
                    <Typography variant="body2">{data.bio !== "" ? data.bi : "Tidak ada bio"}</Typography>

                    <Box display={'flex'} alignItems={'center'} gap={1}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                            <DiamondIcon sx={{fontSize: "0.95rem"}} />
                            <Typography fontSize={'0.9rem'}>
                                {data.diamond}
                            </Typography>
                        </Box>
                        <Typography>||</Typography>
                        <Typography variant="body2" fontStyle={'italic'}>Id: {data.profile_id}</Typography>
                        <Button variant="contained" sx={{ height: '1rem', width: '2rem', fontSize: '0.7rem' }}>
                            <ContentCopyIcon sx={{ fontSize: '0.7rem', mr: 0.4 }} />
                            CopyId
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Button variant="contained" sx={{ height: 36, fontSize: { md: 10 }, width: 100 }} onClick={OnEdit}>
                        <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                        Edit Profile
                    </Button>
                </Box>
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', gap: 10, marginBottom: 2 }}>
                <Button variant="contained" sx={{ height: 30, fontSize: { xs: 12 }, width: 148 }} onClick={OnEdit}>
                    <EditIcon sx={{ mr: 1, fontSize: 16 }} />
                    Edit Profile
                </Button>
            </Box>

            <Divider sx={{ backgroundColor: theme.palette.text.dark, height: '0.05rem' }} />
        </section>
    );

    const LoadingPage = () => {
        if (loading) {
            return (<CircularProgress />);
        }

        if (err) {
            return (<Typography variant="body1">{err}</Typography>);
        }

        return null;
    }

    return (
        <Container maxWidth="md" sx={{ userSelect: 'none' }}>
            {loading || err ?<> <Toolbar /> <LoadingPage /></> : <>
                <SectionOne />
                <StatistikDanAktivitas />
                <Sosial />
                <Pengaturan />
            </>}
        </Container>
    );
}

export default Profile;
