import React, { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, Toolbar, Typography, useTheme } from "@mui/material";
import api from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppProvider";

const DiamondTopUp = () => {
    const theme = useTheme();
    const [diamondData, setDiamondData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {setLoadingCondition} = useContext(AppContext);

    //Get file diamondsBundle
    useEffect(() => {
        const fetchData = async() => {
            try {
                setLoading(true);
                const response = await api.get('api/get-diamonds-bundle/');
                setDiamondData(response.data);
            } catch (err) {
                console.error('Error:', err.response?.data?.detail || err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [navigate]);

    const Buy = async (name, price, quantity) => {
        try{
            setLoadingCondition(true);
            const response = await api.post("payment-gateway/generate-snap-token/", {
                product_name: name,
                gross_amount: price,
                quantity: 1,
                real_quantity: quantity
            });

            setLoadingCondition(false);

            const { snap_token: snapToken, order_id: orderId } = response.data;

            window.snap.pay(snapToken, {
                onSuccess: function (result) {
                console.log("Payment Success:", result);
                alert(`Payment Successful! Order ID: ${orderId}`);
                },
                onPending: function (result) {
                console.log("Payment Pending:", result);
                alert("Payment is pending.");
                },
                onError: function (result) {
                console.log("Payment Error:", result);
                alert("An error occurred during payment.");
                },
                onClose: function () {
                alert("Payment popup closed!");
                },
            });
            } catch (error) {
            console.error("Error generating snap token:", error);
            alert("Failed to generate payment token. Please try again.");
            }
        }

    const DiamondList = () => {
        return (
            <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {xs:"repeat(1, 1fr)", md: "repeat(2, 1fr)"}, 
                gap: 6, 
                paddingBottom: '2rem',
            }}
            >
                {diamondData && diamondData.map((item, index) => (
                    <Box
                        onClick={() => {Buy(item.bundle_name,item.price, item.quantity)}}
                        key={index}
                        sx={{
                            background: "linear-gradient(145deg,rgb(164, 164, 164),rgb(86, 86, 86))",
                            borderRadius: "20px",
                            padding: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "18rem",
                            width: "16rem",
                            boxShadow: "8px 8px 15px rgba(0, 0, 0, 0.1), -8px -8px 15px rgba(0, 0, 0, 0.7)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease", 
                            gap: 2,
                            cursor: "pointer",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "12px 12px 20px rgba(0, 0, 0, 0.15), -12px -12px 20px rgba(0, 0, 0, 0.8)",
                            },
                        }}
                    >
                        <Typography variant="h5" color={theme.palette.text.light} sx={{fontWeight: 'bold'}}>{item.quantity}</Typography>
                        <img 
                            src="diamond.png"
                            width="180rem"
                            height="auto"
                            alt="diamondImage"
                        />
                        <Typography variant="h6" color={theme.palette.text.light} sx={{fontWeight: 'bold'}}>{`Rp.${item.price}`}</Typography>
                    </Box>
                ))} 
            </Box>
        )
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: "100%"}}>
            <Toolbar />

            <Box sx={{paddingTop: "1rem", paddingBottom: "2rem"}}>
                <Typography variant="h5" gutterBottom>
                    Diamond Store
                </Typography>
            </Box>
            
            {loading ? 
                <CircularProgress />:
                <DiamondList />
            }
        </Box>
    );
};

export default DiamondTopUp;