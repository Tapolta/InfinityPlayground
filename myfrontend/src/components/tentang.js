import React from "react";
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

const Tentang = () => {
  return (
    <Box>
      <Toolbar />
      {/* About Content */}
      <Box sx={{ p: 4}}>
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold" }}>
          Tentang Platform Kami
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          Kami adalah platform permainan daring yang dirancang untuk memberikan pengalaman bermain terbaik kepada Anda.
          Di sini, Anda dapat menjelajahi berbagai permainan seru, mencatat kemajuan Anda, dan bersaing dengan teman-teman
          Anda. Nikmati integrasi yang mulus, data yang aman, dan kesempatan untuk menjadi pemain terbaik!
        </Typography>
      </Box>

      {/* Highlights Section */}
      <Box sx={{ backgroundColor: "primary.two", padding: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 4, textAlign: "center", fontWeight: "bold" }}>
          Mengapa Memilih Kami?
        </Typography>
        <Grid container spacing={3}>
          {[
            { title: "Pilihan Permainan Luas", desc: "Jelajahi berbagai permainan dari berbagai genre." },
            { title: "Progres Tersimpan", desc: "Data permainan Anda akan aman dan selalu tersimpan." },
            { title: "Komunitas Aktif", desc: "Bergabunglah dengan komunitas pemain dari seluruh dunia." },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  padding: 2,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  bgcolor: 'primary.three'
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">{feature.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* About me */}
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 4, textAlign: "center", fontWeight: "bold" }}>
          Tentang Saya
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
          }}
        >
          <CardMedia
            component="img"
            alt="Profil Saya"
            height="180"
            image="Polisi.jpeg"
            sx={{
              width: "180px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Gustavolta Khizqi
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
              Halo, nama saya Gustavolta Khizqi, dan saya adalah pencipta dari website ini. Sebagai pengembang game independen, saya
              memiliki passion untuk menciptakan pengalaman bermain yang seru dan menyenangkan. Website ini dirancang untuk
              memungkinkan pemain bermain berbagai game, melacak progress mereka, dan menikmati pengalaman yang terintegrasi
              dengan baik.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Dengan latar belakang dalam [desain game/pemrograman/UX], saya ingin memberikan platform yang user-friendly dan
              aman untuk para pemain di seluruh dunia. Terima kasih telah mendukung karya saya!
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Call-to-Action */}
      <Box sx={{ textAlign: "center", padding: 4, backgroundColor: "primary.main", color: "#fff" }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Siap Bermain?
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            paddingX: 4,
            fontSize: "16px",
          }}
          component={Link} to={"/"}
        >
          JELAJAHI SEKARANG!
        </Button>
      </Box>
    </Box>
  );
};

export default Tentang;
