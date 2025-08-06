package com.tweetapp.tweetapp.service.Impl;

import com.tweetapp.tweetapp.entity.Tweet;
import com.tweetapp.tweetapp.entity.User;
import com.tweetapp.tweetapp.model.request.TweetRequest;
import com.tweetapp.tweetapp.model.response.TweetResponse;
import com.tweetapp.tweetapp.repository.TweetRepository;
import com.tweetapp.tweetapp.repository.UserRepository;
import com.tweetapp.tweetapp.service.TweetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TweetServiceImpl implements TweetService {

    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;

    @Override
    public TweetResponse createTweet(String username, TweetRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Tweet tweet = Tweet.builder()
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        Tweet saved = tweetRepository.save(tweet);
        return new TweetResponse(saved.getId(), user.getUsername(), saved.getContent(), saved.getCreatedAt());
    }

    @Override
    public List<TweetResponse> getAllTweets() {
        return tweetRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(t -> new TweetResponse(t.getId(), t.getUser().getUsername(), t.getContent(), t.getCreatedAt()))
                .toList();
    }
}
