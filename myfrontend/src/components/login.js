import React, { useState, useContext } from 'react';
import { Button, Container, TextField, Toolbar, Typography, useTheme } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseApiUrl, localStorageData } from '../axiosConfig';
import { AppContext } from '../AppProvider';
import { signInWithGoogle, getFirebaseToken } from "../firebaseConfig";
import GoogleIcon from '@mui/icons-material/Google';

export default function LoginPage() {
    const { setTokenValidCondition, setAdminCondition, AddNotif } = useContext(AppContext);
    const [getUsername, setUsername] = useState("");
    const [getPassword, setPassword] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();

    const login = (data) => {
      localStorage.setItem(`${localStorageData.accessToken}`, data.access);
      localStorage.setItem(`${localStorageData.refreshToken}`, data.refresh);
      setTokenValidCondition(true);
      setAdminCondition(data.is_admin);

      AddNotif("Berhasil Login", true);
      navigate("/");
      window.location.reload();
    }

    const tryLogin = async (username, password) => {
        try {
            const response = await axios.post(`http://${baseApiUrl}api/login/`, {
                'username': username,
                'password': password,
            });

            login(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                switch (error.response?.status) {
                  case 400:
                    AddNotif('Terjadi kesalahan pada input. Silakan periksa kembali.' , false);
                    break;
                  case 401:
                    AddNotif('Login gagal. Periksa username dan password Anda.', false);
                    break;
                  case 500:
                    AddNotif('Terjadi kesalahan pada server. Coba lagi nanti.', false);
                    break;
                  default:
                    AddNotif(`Terjadi kesalahan: ${ error.response?.data || error.message}`, false);
                    break;
                }
              } else {
                AddNotif(`Terjadi kesalahan. Coba lagi nanti. ${error.message}`,false);
              }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        tryLogin(getUsername, getPassword);
    }

    const sendTokenToBackend = async () => {
        const token = await getFirebaseToken();
        if (token) {
          const response = await axios(`http://${baseApiUrl}/api/auth/firebase-login/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });
          const data = await response.data;
          login(data);
        } 
      };
    
    const handleLogin = async () => {
        const loggedInUser = await signInWithGoogle();
        if (loggedInUser) {
            await sendTokenToBackend();
        } 
      };

    return (
        <Container maxWidth="xs">
            <Toolbar />

            <Typography variant='h4' component={"h1"} gutterBottom sx={{mt: 4, textAlign: 'center'}}>
                Login
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    type='text'
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    required
                    value={getUsername}
                    onChange={(e) => {setUsername(e.target.value)}}
                    slotProps={{
                      inputLabel: { style: { color: theme.palette.text.primary } }
                  }}
                />

                <TextField
                    label="Password"
                    type='password'
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    required
                    value={getPassword}
                    onChange={(e) => {setPassword(e.target.value)}}
                    slotProps={{
                      inputLabel: { style: { color: theme.palette.text.primary } }
                  }}
                />

                <Button variant='contained' type='submit' sx={{mt: 2, mb: 1, width: '100%'}}>
                    Login!
                </Button>
            </form>
            <Typography sx={{textAlign: 'center'}}>Atau</Typography>
            <Button
              onClick={handleLogin}
              variant="contained"
              color="default"
              startIcon={<GoogleIcon />} 
              fullWidth
              sx={{
                  textTransform: 'none',
                  backgroundColor: '#4285F4',
                  color: 'white',
                  '&:hover': {
                  backgroundColor: '#357AE8',
                  },
                  mt: 1
              }}
            >
            Login dengan Google
            </Button>
            <Typography variant='body1' sx={{mt: 2}}>Tidak memiliki akun ? <Link to='/signup' style={{ color: 'inherit'}}>Buat sekarang!</Link></Typography>
            <Typography variant='body1' sx={{mt: 2}}>Lupa kata sandi ? <Link to='/forgot-password' style={{ color: 'inherit'}}>Klik disini!</Link></Typography>
        </Container>
    );
}