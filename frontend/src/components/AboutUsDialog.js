import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Stack,
  IconButton
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function AboutUsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>About TweetApp</DialogTitle>
      <DialogContent>
        <Typography variant="body1" mb={2}>
          <b>TweetApp</b> is a modern, full-stack Twitter-inspired social platform built with Java 21, Spring Boot, JWT, and React. It demonstrates secure authentication, real-time tweet posting, and a beautiful, responsive UI. TweetApp is designed for developers and tech enthusiasts who want to experience or learn about scalable and secure RESTful architectures with a rich frontend experience.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>Key Features:</Typography>
        <ul>
          <li>JWT-based authentication and authorization</li>
          <li>Modern, Material UI-powered React frontend</li>
          <li>Live tweet feed and composer</li>
          <li>Profile management</li>
          <li>Full integration with Spring Boot backend</li>
        </ul>
        <Box mt={3} mb={1}>
          <Typography variant="subtitle1" fontWeight={600}>Developer Profile</Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Avatar src="/profile.jpg" sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="h6">Manikanta Gunda</Typography>
            <Typography variant="body2" color="text.secondary">Cloud and DevOps Engineer</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton color="inherit" component="a" href="https://github.com/mani1765" target="_blank" rel="noopener">
            <GitHubIcon />
          </IconButton>
          <IconButton color="primary" component="a" href="https://linkedin.com/in/mani1765" target="_blank" rel="noopener">
            <LinkedInIcon />
          </IconButton>
          <IconButton color="error" component="a" href="https://youtube.com/@mani1765" target="_blank" rel="noopener">
            <YouTubeIcon />
          </IconButton>
          <IconButton color="secondary" component="a" href="https://instagram.com/mani1765" target="_blank" rel="noopener">
            <InstagramIcon />
          </IconButton>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
