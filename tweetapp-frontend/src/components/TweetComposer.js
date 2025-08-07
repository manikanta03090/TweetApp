import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from "@mui/material";
import { postTweet } from "../api/api";

export default function TweetComposer({ open, onClose, onPosted }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await postTweet({ content });
      setContent("");
      onPosted();
      onClose();
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setContent("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Compose Tweet</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: 8 }}>
  <span style={{ color: '#222', fontWeight: 600, fontSize: 16 }}>What's happening?</span>
</div>
<TextField
  autoFocus
  multiline
  minRows={3}
  maxRows={6}
  fullWidth
  placeholder="What's happening?"
  inputProps={{ style: { fontSize: 16 } }}
  value={content}
  onChange={e => setContent(e.target.value)}
  disabled={loading}
/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button onClick={handlePost} variant="contained" disabled={loading || !content.trim()}>
          {loading ? <CircularProgress size={20} /> : "Tweet"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
