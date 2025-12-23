import { Button, Card, CardContent, CircularProgress, Container, TextField, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { baseApiUrl } from "../axiosConfig";
import { AppContext } from "../AppProvider";

const ForgotPassword = () => {
    const { uidb64, token } = useParams();
    const [verifEmail, setVerifEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const {AddNotif} = useContext(AppContext);
    const [terkirim, setTerkirim] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`http://${baseApiUrl}api/forgot-password/`, { "email": verifEmail });
            AddNotif("Email reset password telah dikirim!", true);
            setTerkirim(true);
        } catch (err) {
            AddNotif(err.response?.data?.message || "Terjadi kesalahan.");
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            AddNotif("Konfirmasi password tidak cocok.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`http://${baseApiUrl}api/reset-password/${uidb64}/${token}/`, {
                "password": password,
                "confirm_password": confirmPassword
            });
            AddNotif(response.data.message, true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            if (err.response?.status === 400) {
                AddNotif("Token tidak valid atau kedaluwarsa. Silakan minta reset password lagi.");
            } else {
                AddNotif(err.response?.data?.message || "Terjadi kesalahan.");
            }
        }
        setLoading(false);
    };
    
    if (loading) {
        return(
            <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.default2' }}>
                    <CardContent sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <CircularProgress sx={{color: 'text.primary'}} />
                    </CardContent>
                </Card>
            </Container>
        )
    }

    return (
        <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.default2' }}>
                <CardContent>
                    {uidb64 && token ? (
                        <>
                            <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
                                Reset Password
                            </Typography>
                            <Typography variant="body2" align="center" gutterBottom>
                                Masukkan password baru Anda.
                            </Typography>
                            <form onSubmit={handleResetPassword}>
                                <TextField
                                    label="Password Baru"
                                    type="password"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    slotProps={{
                                        inputLabel: { style: { color: theme.palette.text.primary } }
                                    }}
                                />
                                <TextField
                                    label="Konfirmasi Password"
                                    type="password"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    slotProps={{
                                        inputLabel: { style: { color: theme.palette.text.primary } }
                                    }}
                                />
                                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                                    Ubah Password
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                        {!terkirim ? <>
                            <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
                                Verifikasi Email
                            </Typography>
                            <Typography variant="body2" align="center" gutterBottom>
                                Pemberitahuan akan dikirim melalui email! Harap memasukkan email yang telah terdaftar.
                            </Typography>
                            <form onSubmit={handleSendEmail}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    required
                                    value={verifEmail}
                                    onChange={(e) => setVerifEmail(e.target.value)}
                                    slotProps={{
                                        inputLabel: { style: { color: theme.palette.text.primary } }
                                    }}
                                />
                                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                                    Kirim Verifikasi
                                </Button>
                            </form>
                        </> : <>
                        <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
                            Verifikasi berhasil Terkirim!
                        </Typography>
                        <Typography variant="body2" align="center" gutterBottom>
                            Periksa email <span style={{fontWeight: 'bold'}}>{verifEmail}</span> untuk melanjutkan.
                        </Typography>
                        </>}
                        </>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ForgotPassword;
