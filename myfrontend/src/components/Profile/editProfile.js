import { AccountCircle, Upload } from "@mui/icons-material";
import { Box, Button, Checkbox, Container, Paper, TextField, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import BadgeIcon from '@mui/icons-material/Badge';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AppContext } from "../../AppProvider";
import api from "../../axiosConfig";

const EditProfile = ({data, callback}) => {
    const theme = useTheme()
    const {AddNotif, setPopUpContent} = useContext(AppContext)
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        bio: '',
        avatar:'',
        is_public:false,
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    const handleChangeImage = (e) => {
        setFormData({
            ...formData, avatar: e.target.files[0]
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        const dataToSend = formData.avatar instanceof File ? formData : {...formData, avatar: null};

        try {
            await api.put("api/update-profile-data/", dataToSend);
            AddNotif(`Username updated: ${formData.username}`, true);
            callback();
        } catch (error) {
            AddNotif(`gagal mengubah profile: ${error}`);
        }

        handleClose();
    };

    const handleClose = () => {
        setPopUpContent(null);
    }

    useEffect(() => {
        const defaultdata = data;
        setFormData({
            id: data.id,
            username: defaultdata.username,
            bio: defaultdata.bio,
            avatar: defaultdata.avatar,
            is_public: data.is_public,
        })
    }, [data])

    return (
        <Container maxWidth="sm" sx={{ mt: 4, px: { xs: 2, sm: 0 } }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: "background.default2" }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Edit Profil
                </Typography>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexDirection: { xs: "column", sm: "row" }, bgcolor: "transparent", borderRadius: 2, px: 2, mb: 2 }}>
                        <BadgeIcon color="text.primary" sx={{ fontSize: 40 }} />
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            variant="standard"
                            slotProps={{
                                inputLabel: {style: {color: theme.palette.text.primary}}
                            }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexDirection: { xs: "column", sm: "row" }, bgcolor: "transparent", borderRadius: 2, px: 2, mb: 2 }}>
                        <DescriptionIcon color="text.primary" sx={{ fontSize: 40 }} />
                        <TextField
                            fullWidth
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            variant="standard"
                            slotProps={{
                                inputLabel: {style: {color: theme.palette.text.primary}}
                            }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexDirection: { xs: "column", sm: "row" }, bgcolor: "transparent", borderRadius: 2, px: 2 }}>
                        <AccountCircle color="text.primary" sx={{ fontSize: 40 }} />
                        <input
                            id="game-picture"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleChangeImage}
                        />
                        <label htmlFor="game-picture">
                            <Button variant="contained" color="primary" component="span" sx={{ textTransform: "none" }} startIcon={<Upload />}>
                                <Typography>Kirim Avatar</Typography>
                            </Button>
                        </label>
                        <Typography variant="body1" sx={{ textAlign: { xs: "center", sm: "left" } }}>
                            {formData.avatar instanceof File ? formData.avatar.name : formData.avatar}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexDirection: { xs: "column", sm: "row" }, bgcolor: "transparent", borderRadius: 2, px: 2 }}>
                        <VisibilityIcon color="text.primary" sx={{ fontSize: 40 }} />
                        <Checkbox name="is_public" checked={formData.is_public} onChange={handleChange}/>
                        <Typography>{formData.is_public ? "Profile akan terlihat oleh orang lain":"Profile disembunyikan"}</Typography>
                    </Box>
                    <Box sx={{width: '100%', justifyContent: 'center', gap: 2, display: 'flex'}}>
                        <Button type="submit" variant="contained" sx={{ borderRadius: 2, py: 1.2, mt: 2, width: '40%' }} color='success'>
                            Simpan Perubahan
                        </Button>
                        <Button variant="contained" sx={{ borderRadius: 2, py: 1.2, mt: 2, width: '40%' }} onClick={handleClose}>
                            Kembali
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    )
}

export default EditProfile;