package com.tweetapp.tweetapp.service;

import com.tweetapp.tweetapp.model.request.SigninRequest;
import com.tweetapp.tweetapp.model.request.SignupRequest;
import com.tweetapp.tweetapp.model.response.AuthResponse;

public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse signin(SigninRequest request);
}
