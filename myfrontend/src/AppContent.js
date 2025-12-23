import { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import api, { localStorageData } from "./axiosConfig";
import { Box } from "@mui/material";
import MainDrawer from "./components/mainDrawer";
import DashboardPage from "./components/dashboard";
import GamePage from "./components/gamePage";
import Profile from "./components/Profile/profile";
import DiamondTopUp from "./components/DiamondTopUp/topUp";
import AdminDashboard from "./components/AdminSite/admin";
import LoginPage from "./components/login";
import Signup from "./components/signup";
import { AppContext } from "./AppProvider";
import CreateProfile from "./components/Profile/createProfile";
import DiamondHandle from "./components/AdminSite/diamondHandle";
import Kontak from "./components/kontak";
import Tentang from "./components/tentang";
import Notification from "./components/notification";
import ProfileHandler from "./components/AdminSite/profileHandler";
import GamesHandle from "./components/AdminSite/gamsHandle";
import ForgotPassword from "./components/forgot";
import MainLoading from "./components/loading";
import PopUpContent from "./popUpContent";
import SearchPage from "./components/searchPage";

export default function AppContent() {
  const { 
    isAdmin, setAdminCondition,
    isTokenValid, setTokenValidCondition,
    setLoadingCondition,
    notificationRef
  } = useContext(AppContext);
  const [isWebReady, setWebReadyCondition] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem(localStorageData.accessToken);
      setLoadingCondition(true);

      if (token) {
        try {
          await api.post("/api/token/verify/", { token });
          setTokenValidCondition(true);

          const response = await api.get("api/check-role/");
          setAdminCondition(response.data.role === "admin");
        } catch (err) {
          setTokenValidCondition(false);
          setAdminCondition(false);
        }
      } else {
        setTokenValidCondition(false);
        setAdminCondition(false);
      }
      
      setLoadingCondition(false);
      setWebReadyCondition(true);
    };

    checkUserStatus();
  }, [setTokenValidCondition, setAdminCondition, setLoadingCondition]);

  if (!isWebReady) {
    return (
      <MainLoading />
    )
  }

  return (
    <Box sx={{ display: "flex", overflowX: "auto" }}>
      <Notification ref={notificationRef} />
      <MainLoading />
      <PopUpContent />
      <Routes>
        {/* If not logged in */}
        {!isTokenValid ? (
          <>
            <Route path="/" element={<><MainDrawer /><DashboardPage /></>} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password/:uidb64/:token" element={<ForgotPassword />} />
            <Route path="/kontak" element={<><MainDrawer /><Kontak /></>} />
            <Route path="/tentang" element={<><MainDrawer /><Tentang /></>} />
            <Route path="/search" element={<><MainDrawer /><SearchPage /></>} />
          </>
        ) : (
          <>
            {/* If logged in and admin */}
            {isAdmin ? (
              <>
                <Route path="/" element={<><MainDrawer /><AdminDashboard /></>} />
                <Route path="/home" element={<Navigate to="/" />} />
                <Route path="diamond" element={<><MainDrawer /> <DiamondHandle /></>} />
                <Route path="/profil" element={<><MainDrawer /><ProfileHandler /></>} />
                <Route path="/permainan" element={<><MainDrawer /><GamesHandle/></>} />
              </>
            ) : (
              <>
                {/* If logged in and user */}
                <Route path="/" element={<><MainDrawer /><DashboardPage /></>} />
                <Route path="/home" element={<Navigate to="/" />} />
                <Route path="/testGame" element={<><MainDrawer /><GamePage /></>} />
                <Route path="/profil" element={<><MainDrawer /><Profile /></>} />
                <Route path="/diamond" element={<><MainDrawer /><DiamondTopUp /></>} />
                <Route path="/create-profile" element={<><MainDrawer /><CreateProfile /></>} />
                <Route path="/kontak" element={<><MainDrawer /><Kontak /></>} />
                <Route path="/tentang" element={<><MainDrawer /><Tentang /></>} />
                <Route path="/search" element={<><MainDrawer /><SearchPage /></>} />
              </>
            )}
          </>
        )}
      </Routes>
    </Box>
  );
}
