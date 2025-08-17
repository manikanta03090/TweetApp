package com.tweetapp.tweetapp.model.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TweetResponse {
    private Long id;
    private String username;
    private String content;
    private LocalDateTime createdAt;
}
