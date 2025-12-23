import { Container } from "@mui/system";
import { useState } from "react";

const ResetPassword = () => {
    const [data, setData] = useState({
        newPassword: '',
        verifNewPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== oldPassword) {

        }

    }

    return (
        <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.default2' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
                        Reset Password
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Masukkan password lama"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            slotProps={{
                                inputLabel: {style: {color: theme.palette.text.primary}}
                            }}
                        />
                        <TextField
                            label="Masukkan password baru"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            slotProps={{
                                inputLabel: {style: {color: theme.palette.text.primary}}
                            }}
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                            Kirim Verifikasi
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    )
}

export default ResetPassword;