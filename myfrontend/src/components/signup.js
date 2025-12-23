import React, { useContext, useState } from "react";
import { TextField, Button, Box, Typography, Container, CardContent, Card } from "@mui/material";
import { Link} from "react-router-dom";
import { baseApiUrl } from "../axiosConfig";
import { AppContext } from "../AppProvider";
import axios from "axios";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("")
  const {AddNotif} = useContext(AppContext);
  const [kirimOtp, setKirimOtp] = useState(false);
  const [created, setCreated] = useState(false);
  const {setLoadingCondition} = useContext(AppContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitReqOtp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      AddNotif("Password dan confirm password tidak sama!");
      return;
    }

    setLoadingCondition(true);
    try {
      const response = await axios.post(`http://${baseApiUrl}api/signup/`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 400) {
        AddNotif("Gagal membuat akun.");
      }

      AddNotif(response.data.message, true);
      setKirimOtp(true);
    } catch (error) {
      console.log(error);
    }
    setLoadingCondition(false);
  };

  const handleSubmitVerifOtp = async (e) => {
    e.preventDefault();
    setLoadingCondition(true);
    try {
      await axios.post(`http://${baseApiUrl}api/verify-otp/`,{email:formData.email ,otp:otp})
      AddNotif("Akun berhasil dibuat!", true);
      setCreated(true);
    } catch (error) {
      AddNotif("token tidak berhasil terikirim");
    }
    setLoadingCondition(false);
  }

  const otpPage = (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.default2', textAlign: 'center' }}>
        <CardContent>
          <Typography>Masukkan kode OTP!</Typography>
          <Typography>Kode OTP dikirimkan ke email {formData.email}</Typography>
          <form style={{display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10}} onSubmit={handleSubmitVerifOtp}>
            <TextField 
              label='masukkan kode otp'
              name="otp"
              onChange={(e) => setOtp(e.target.value)}
              value = {otp}
              slotProps={{
                inputLabel: {style: {color: 'white'}}
              }}
            />
            <Button variant="contained" type="submit">
              Kirim
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );

  const formPage = (
    <Container maxWidth="xs">
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 4,
        padding: 3,
        boxShadow: 3,
        borderRadius: 1,
      }}
    >

      <Typography variant="h5" gutterBottom>
         Buat Akun
      </Typography>

      <Box>
          <form onSubmit={handleSubmitReqOtp} style={{ width: "100%" }}>
              <TextField
              required
              label="Username"
              variant="outlined"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: {style: {color: 'white'}}
              }}
              />
              <TextField
              required
              label="Email"
              type="email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: {style: {color: 'white'}}
              }}
              />
              <TextField
              required
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: {style: {color: 'white'}}
              }}
              />
              <TextField
              required
              label="Confirm Password"
              variant="outlined"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: {style: {color: 'white'}}
              }}
              />
  
              <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              >
              Sign Up
              </Button>
          </form>
        </Box>
    </Box>
    <Typography sx={{mt:2}}>Sudah memiliki akun ? <Link to='/login' style={{ color: 'inherit'}}>Login sekarang!</Link></Typography>
  </Container>
  )

  const createdPage = (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.default2', textAlign: 'center' }}>
        <CardContent>
          <Typography variant="body1">Akun berhasil diuat!</Typography>
          <Button variant="contained" sx={{mt: 5}} component={Link} to={"/login"}>Login Sekarang!</Button>
        </CardContent>
      </Card>
    </Container>
  )

  if (created) {
    return(
      <>
        {createdPage}
      </>
    )
  }

  if (kirimOtp) {
    return (
      <>
        {otpPage}
      </>
    )
  } else {
    return(
      <>
        {formPage}
      </>
    )
  }
};

export default SignUpForm;
