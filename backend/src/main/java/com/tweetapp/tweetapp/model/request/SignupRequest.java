package com.tweetapp.tweetapp.model.request;

import lombok.*;

@Data
public class SignupRequest {
    private String username;
    private String password;
    private String email;
}
