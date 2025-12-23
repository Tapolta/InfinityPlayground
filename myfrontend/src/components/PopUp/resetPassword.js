import { Container, Typography, TextField, Button, Box, Stack, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { LockReset } from "@mui/icons-material";
import { AppContext } from "../../AppProvider";
import api from "../../axiosConfig";

const ResetPassword = ({ data, callback }) => {
    const {AddNotif} = useContext(AppContext);
    const [passwordLama, setPasswordLama] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const theme = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === passwordLama) {
            AddNotif("Masukkan password baru!!");
            return;
        }

        if (password !== confirmPassword) {
            AddNotif("Password tidak cocok!");
            return;
        }

        try {
            await api.post('api/base/user-api/reset-password/', {old_password: passwordLama, new_password: password});
            AddNotif("Berhasil merubah password", true);
            setPassword('');
            setConfirmPassword('');
            setPasswordLama('');
            callback(null);
        } catch (error) {
            AddNotif(`Gagal mengubah password: ${error.response.data.detail}`);
            console.log(error.response.data.detail);
        }
    };

    const close = () => {
        callback(null);
    }

    return (
        <Container maxWidth="xs" sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 4, bgcolor: "background.default" }}>
            <Stack direction="column" spacing={2} alignItems="center">
                <LockReset sx={{ fontSize: 50, color: "text.primary" }} />
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                    Reset Password
                </Typography>
            </Stack>

            <Box component="form" onSubmit={handleSubmit} mt={3}>
                <TextField
                    label="Password Lama"
                    type="password"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={passwordLama}
                    onChange={(e) => setPasswordLama(e.target.value)}
                    required
                    slotProps={{
                        inputLabel: {style: {color: theme.palette.text.primary}}
                    }}
                />
                <TextField
                    label="Password Baru"
                    type="password"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    slotProps={{
                        inputLabel: {style: {color: theme.palette.text.primary}}
                    }}
                />

                <TextField
                    label="Konfirmasi Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    slotProps={{
                        inputLabel: {style: {color: theme.palette.text.primary}}
                    }}
                />

                <Box sx={{mt:1}}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        color="success"
                        sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
                    >
                        Simpan Password Baru
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={close}
                        sx={{ mt: 2, py: 1.5, fontWeight: "bold"}}
                    >
                        Kembali
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ResetPassword;
