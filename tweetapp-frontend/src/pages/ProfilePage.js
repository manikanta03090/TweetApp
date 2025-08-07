import React from "react";
import { Box, Container, Typography } from "@mui/material";
import AppBarNav from "../components/AppBarNav";

export default function ProfilePage() {
  const username = localStorage.getItem("username");
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <AppBarNav />
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>Profile</Typography>
        <Typography variant="subtitle1">Username: {username}</Typography>
        {/* You can add more profile info or user tweets here */}
      </Container>
    </Box>
  );
}
