import { Container, Toolbar, Typography, Grid2, Card, CardMedia, CardContent, Chip, Skeleton, Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { baseApiUrl } from "../axiosConfig";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://${baseApiUrl}api/search`, {
          params: { q: query },
        });
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) getData();
  }, [query]);

  return (
    <Container sx={{ py: 4 }}>
      <Toolbar />
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Hasil Pencarian untuk: "{query}"
      </Typography>

      {loading ? (
        <Grid2 container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid2 size={{xs: 12, sm:6, md: 4}} key={index}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton width="60%" sx={{ mt: 1 }} />
              <Skeleton width="40%" />
            </Grid2>
          ))}
        </Grid2>
      ) : data.length > 0 ? (
        <Grid2 container spacing={3}>
          {data.map((game, index) => (
            <Grid2 size={{xs: 12, sm:6, md: 4}} key={index}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, transition: "0.3s", '&:hover': { boxShadow: 6, transform: 'translateY(-5px)' } }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={game.game_picture || "https://via.placeholder.com/300x200"}
                  alt={game.game_name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {game.game_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Versi: {game.game_version}
                  </Typography>
                  <Box sx={{ my: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {(Array.isArray(game.genres) ? game.genres : []).map((genre, idx) => (
                    <Chip key={idx} label={genre} size="small" color="primary" variant="outlined" />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {game.game_description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography variant="body1" color="text.secondary" textAlign="center" mt={4}>
          Tidak ada hasil ditemukan untuk "{query}".
        </Typography>
      )}
    </Container>
  );
};

export default SearchPage;
