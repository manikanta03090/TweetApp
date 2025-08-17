import React, { useState, useContext } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AboutUsDialog from "./AboutUsDialog";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeModeContext } from "../index";

export default function AppBarNav() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.replace("/"); // force reload to clear state
  };
  const [aboutOpen, setAboutOpen] = useState(false);
  const { toggleTheme, mode } = useContext(ThemeModeContext);
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/feed")}>TweetApp</Typography>
          <Button color="inherit" onClick={() => navigate("/profile")}>Profile</Button>
          <Button color="inherit" onClick={() => setAboutOpen(true)}>About Us</Button>
          <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <AboutUsDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
