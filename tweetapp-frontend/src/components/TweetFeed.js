import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress, Stack } from "@mui/material";
import { getTweets } from "../api/api";

export default function TweetFeed({ refresh }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTweets()
      .then(res => setTweets(res.data))
      .catch(() => setTweets([]))
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) return <Box sx={{ textAlign: "center", py: 4 }}><CircularProgress /></Box>;
  if (!tweets.length) return <Typography align="center" color="text.secondary">No tweets yet.</Typography>;

  return (
    <Stack spacing={2}>
      {tweets.map((tweet, idx) => (
        <Card key={idx} elevation={2}>
          <CardContent>
            <Typography variant="subtitle2" color="primary">@{tweet.username || tweet.user || "user"}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{tweet.content}</Typography>
            {tweet.createdAt && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {new Date(tweet.createdAt).toLocaleString()}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
