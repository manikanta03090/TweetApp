package com.tweetapp.tweetapp.model.response;

import lombok.*;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
}
