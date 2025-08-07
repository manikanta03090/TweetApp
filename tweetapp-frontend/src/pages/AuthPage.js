import React, { useState } from "react";
import { Box, Paper, Tabs, Tab, Typography, Snackbar, Alert } from "@mui/material";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

export default function AuthPage() {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleTabChange = (e, newValue) => setTab(newValue);
  const handleShowSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper elevation={6} sx={{ p: 4, minWidth: 350, maxWidth: 400 }}>
        <Typography variant="h4" align="center" fontWeight={700} color="primary" mb={2}>
          TweetApp
        </Typography>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
        {tab === 0 ? (
          <LoginForm onSuccess={() => handleShowSnackbar("Sign in successful!", "success")} onError={msg => handleShowSnackbar(msg, "error")} />
        ) : (
          <SignupForm onSuccess={() => { setTab(0); handleShowSnackbar("Signup successful! Please sign in.", "success"); }} onError={msg => handleShowSnackbar(msg, "error")} />
        )}
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
