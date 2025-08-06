package com.tweetapp.tweetapp.controller;

import com.tweetapp.tweetapp.model.request.TweetRequest;
import com.tweetapp.tweetapp.model.response.TweetResponse;
import com.tweetapp.tweetapp.service.TweetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tweets")
@RequiredArgsConstructor
public class TweetController {

    private final TweetService tweetService;

    @PostMapping
    public ResponseEntity<TweetResponse> postTweet(@RequestBody TweetRequest request, Authentication auth) {
        String username = auth.getName();
        return ResponseEntity.ok(tweetService.createTweet(username, request));
    }

    @GetMapping
    public ResponseEntity<List<TweetResponse>> getAllTweets() {
        return ResponseEntity.ok(tweetService.getAllTweets());
    }
}
