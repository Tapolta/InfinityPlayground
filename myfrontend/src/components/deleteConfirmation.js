import { DeleteOutline } from "@mui/icons-material";
import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../AppProvider";

const DeleteConfirmation = ({data, callback}) => {
    const {setPopUpContent} = useContext(AppContext);

    const onDelete = (param) => {
        callback(param);
        setPopUpContent(null);
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 6, px: { xs: 2, sm: 0 } }}>
            <Paper
            elevation={6}
            sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 4,
                bgcolor: "background.default3",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
            }}
            >
            <Typography variant="h5" fontWeight={600} color="error.dark" gutterBottom>
                Hapus Data?
            </Typography>
    
            <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                Anda yakin ingin menghapus data berikut? Tindakan ini tidak dapat dikembalikan.
            </Typography>
    
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "background.default",
                    mb: 3,
                    maxHeight: 200,
                    overflowY: "auto",
                }}
            >
                {Object.entries(data).map(([key, value], index) => (
                    <Box key={key}>
                        <Typography variant="body2" color="text.primary">
                            <strong>{key}:</strong>{" "}
                            {typeof value === "boolean" ? (value ? "Ya" : "Tidak") : value}
                        </Typography>
                        {index < Object.entries(data).length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                ))}
            </Paper>
    
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                variant="contained"
                color="error"
                startIcon={<DeleteOutline />}
                sx={{
                    borderRadius: 3,
                    py: 1.2,
                    px: 3,
                    width: "50%",
                    transition: "0.3s",
                    "&:hover": { bgcolor: "error.dark" },
                }}
                  onClick={() => onDelete(data.id)}
                >
                Hapus
                </Button>
    
                <Button
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    py: 1.2,
                    px: 3,
                    width: "50%",
                    transition: "0.3s",
                    "&:hover": { bgcolor: "primary.main" },
                    color: 'text.primary'
                }}
                onClick={() => setPopUpContent(null)}
                >
                Batal
                </Button>
            </Box>
            </Paper>
        </Container>
    )
}

export default DeleteConfirmation;