package com.tweetapp.tweetapp.service.Impl;

import com.tweetapp.tweetapp.entity.User;
import com.tweetapp.tweetapp.model.request.SigninRequest;
import com.tweetapp.tweetapp.model.request.SignupRequest;
import com.tweetapp.tweetapp.model.response.AuthResponse;
import com.tweetapp.tweetapp.repository.UserRepository;
import com.tweetapp.tweetapp.security.JwtService;
import com.tweetapp.tweetapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.GlobalOpenTelemetry;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse signup(SignupRequest request) {
        Tracer tracer = GlobalOpenTelemetry.getTracer("com.tweetapp.AuthServiceImpl");
        Span span = tracer.spanBuilder("signup").startSpan();
        try {
            log.info("Signup attempt for username: {}", request.getUsername());
            if (userRepository.existsByUsername(request.getUsername())) {
                log.warn("Signup failed: Username already exists: {}", request.getUsername());
                throw new RuntimeException("Username already exists");
            }

            User user = User.builder()
                    .username(request.getUsername())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .email(request.getEmail())
                    .build();

            userRepository.save(user);
            String token = jwtService.generateToken(user);
            return new AuthResponse(token, user.getUsername());
        } finally {
            span.end();
        }
    }

    @Override
    public AuthResponse signin(SigninRequest request) {
        Tracer tracer = GlobalOpenTelemetry.getTracer("com.tweetapp.AuthServiceImpl");
        Span span = tracer.spanBuilder("signin").startSpan();
        try {
            log.info("Signin attempt for username: {}", request.getUsername());
            try {
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
                );
            } catch (Exception e) {
                log.warn("Signin failed for username: {}: {}", request.getUsername(), e.getMessage());
                throw e;
            }

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtService.generateToken(user);
            log.info("Signin successful for username: {}", request.getUsername());
            return new AuthResponse(token, user.getUsername());
        } finally {
            span.end();
        }
    }
}
