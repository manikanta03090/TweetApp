import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Fab, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TweetFeed from "../components/TweetFeed";
import TweetComposer from "../components/TweetComposer";
import AppBarNav from "../components/AppBarNav";

export default function FeedPage() {
  const [openComposer, setOpenComposer] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [refresh, setRefresh] = useState(false);

  const handleShowSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const handleTweetPosted = () => { setRefresh(r => !r); handleShowSnackbar("Tweet posted!", "success"); };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <AppBarNav />
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>Home Feed</Typography>
        <TweetFeed refresh={refresh} />
      </Container>
      <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 32, right: 32 }} onClick={() => setOpenComposer(true)}>
        <AddIcon />
      </Fab>
      <TweetComposer open={openComposer} onClose={() => setOpenComposer(false)} onPosted={handleTweetPosted} />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
