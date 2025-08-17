package com.tweetapp.tweetapp.repository;

import com.tweetapp.tweetapp.entity.Tweet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TweetRepository extends JpaRepository<Tweet, Long> {
    List<Tweet> findAllByOrderByCreatedAtDesc();
}
