import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Box, Typography } from "@mui/material";

const Notification = forwardRef((_, ref) => {
  const [value, setValue] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [key, setKey] = useState(Date.now());

  const triggerNotification = (message, success = false) => {
    setValue(message);
    setIsSuccess(success);
    setKey(Date.now());
  };

  useImperativeHandle(ref, () => ({
    triggerNotification,
  }));

  if (!value) {
    return null;
  }

  return (
    <Box
      key={key} 
      sx={{
        display: "block",
        position: "fixed",
        p: 1,
        bgcolor: isSuccess ? "green" : "red",
        zIndex: 9999,
        top: "2%",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "8px",
        boxShadow: 3,
        color: "white",
        animation: "slideDown 0.4s ease, fadeOut 2s 2s forwards",
        "@keyframes slideDown": {
          "0%": {
            transform: "translateX(-50%) translateY(-30px)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(-50%) translateY(0)",
            opacity: 1,
          },
        },
        "@keyframes fadeOut": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
      }}
    >
      <Typography>{value}</Typography>
    </Box>
  );
});

export default Notification;
