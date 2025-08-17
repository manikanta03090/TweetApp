package com.tweetapp.tweetapp.service;

import com.tweetapp.tweetapp.model.request.TweetRequest;
import com.tweetapp.tweetapp.model.response.TweetResponse;

import java.util.List;

public interface TweetService {
    TweetResponse createTweet(String username, TweetRequest request);
    List<TweetResponse> getAllTweets();
}
