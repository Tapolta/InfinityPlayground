import React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { AppProvider } from "./AppProvider";
import AppContent from "./AppContent";

const theme = createTheme({
  palette: {
      primary: {
          main: '#181C14', 
          two: '#31511E', 
          three: '#859F3D', 
      },
      secondary: {
          main: '#31511E', 
      },
      background: {
          default: '#3C3D37',
          default2: '#464646',
          default3: '#474841',
          secondary: '#697565'
      },
      text: {
          primary: '#ECDFCC',
          light: '#333333',
          dark: '#F6FCDF',
      },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
