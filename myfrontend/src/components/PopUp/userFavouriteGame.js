import React from 'react';
import { Container, Typography, Divider, Grid2, Card, CardContent, Box, Chip, Button } from '@mui/material';
import { Info, TrendingUp } from '@mui/icons-material';

const UserFavouriteGames = ({data, callback}) => {
return (
    <Container maxWidth="sm">
        <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3, bgcolor: 'background.default' }}>
        <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TrendingUp size={28} color="#1976d2" />
            <Typography variant="h4" fontWeight={600} color="text.primary">
                {data.game_name} Stats
            </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid2 container spacing={2}>
            {data.game_data && Object.entries(data.game_data).map(([key, value]) => (
                key !== 'error' && (
                <Grid2 key={key} size={12} display="flex" justifyContent="space-between" alignItems="center" bgcolor="background.default2" p={2} borderRadius={2} boxShadow={1}>
                    <Typography variant="subtitle1" fontWeight={500} color="text.primary">
                    {key}
                    </Typography>
                    <Chip label={value} color="text.primary" variant="outlined" sx={{ fontWeight: 600 }} />
                </Grid2>
                )
            ))}

            {data.game_data?.error && (
                <Box display="flex" alignItems="center" mt={2} gap={1} color="error.main">
                <Info size={20} />
                <Typography variant="body2">{data.game_data.error}</Typography>
                </Box>
            )}
            </Grid2>
            <Button variant='contained'  sx={{width: '100%', mt: 6}} onClick={() => callback(null)}>Tutup</Button>
        </CardContent>
        </Card>
    </Container>
    );
};

export default UserFavouriteGames;