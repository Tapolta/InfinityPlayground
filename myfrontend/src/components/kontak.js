import React from 'react';
import { Box, Typography, TextField, Button, Grid, Link, Card, Stack, Toolbar } from '@mui/material';
import { LocationOn, Email, Phone, Facebook, Twitter, Instagram } from '@mui/icons-material';

const Kontak = () => {
    return (
        <Box sx={{ width: '100%', py: 6 }}>
            <Toolbar />
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
                <Grid container spacing={4}>
                    {/* Left Side: Contact Information */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={4} sx={{ borderRadius: 4, p: 4, bgcolor: 'primary.three', color: 'text.dark' }}>
                            <Typography variant="h5" sx={{ mb: 3 }}>
                                Informasi Kontak
                            </Typography>
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Phone color="primary" sx={{ fontSize: 32 }} />
                                    <Typography variant="body1">+62 813 2833 1258</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Email color="secondary" sx={{ fontSize: 32 }} />
                                    <Typography variant="body1">kontak@domain.com</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <LocationOn color="success" sx={{ fontSize: 32 }} />
                                    <Typography variant="body1">
                                        Jl. Kupang Gunung Barat IX / No. 18, Surabaya, Indonesia
                                    </Typography>
                                </Box>
                            </Stack>
                            <Typography variant="h6" sx={{ mt: 4 }}>
                                Temukan Kami di Media Sosial
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Link
                                    href="https://facebook.com"
                                    target="_blank"
                                    sx={{
                                        color: '#4267B2',
                                        '&:hover': { color: '#3b5998', transform: 'scale(1.1)' },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <Facebook sx={{ fontSize: 40 }} />
                                </Link>
                                <Link
                                    href="https://twitter.com"
                                    target="_blank"
                                    sx={{
                                        color: '#1DA1F2',
                                        '&:hover': { color: '#0d95e8', transform: 'scale(1.1)' },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <Twitter sx={{ fontSize: 40 }} />
                                </Link>
                                <Link
                                    href="https://instagram.com"
                                    target="_blank"
                                    sx={{
                                        color: '#E1306C',
                                        '&:hover': { color: '#bc2a8d', transform: 'scale(1.1)' },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <Instagram sx={{ fontSize: 40 }} />
                                </Link>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Right Side: Contact Form */}
                    <Grid item xs={12} md={6}>
                        <Card
                            elevation={4}
                            sx={{
                                borderRadius: 4,
                                p: 4,
                                bgcolor: 'primary.three',
                                color: 'text.dark',
                            }}
                        >
                            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                                Kirim Pesan
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Nama Anda"
                                        variant="outlined"  
                                        size="small"
                                        slotProps={{
                                            inputLabel:{ style: { color: '#ffffff' } },
                                            htmlInput: { style: { color: '#ffffff' } },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email Anda"
                                        variant="outlined"
                                        size="small"
                                        slotProps={{
                                            inputLabel:{ style: { color: '#ffffff' } },
                                            htmlInput: { style: { color: '#ffffff' } }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Subjek"
                                        variant="outlined"
                                        size="small"
                                        slotProps={{
                                            inputLabel:{ style: { color: '#ffffff' } },
                                            htmlInput: { style: { color: '#ffffff' } }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Pesan"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        size="small"
                                        slotProps={{
                                            inputLabel:{ style: { color: '#ffffff' } },
                                            htmlInput: { style: { color: '#ffffff' } }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: 'text.dark',
                                            borderRadius: 3,
                                            '&:hover': {
                                                bgcolor: 'primary.two',
                                            },
                                        }}
                                    >
                                        Kirim
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Kontak;
