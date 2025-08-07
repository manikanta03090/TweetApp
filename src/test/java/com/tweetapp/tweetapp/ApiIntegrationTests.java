package com.tweetapp.tweetapp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tweetapp.tweetapp.model.request.SignupRequest;
import com.tweetapp.tweetapp.model.request.SigninRequest;
import com.tweetapp.tweetapp.model.request.TweetRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTests {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Signup, Signin, Tweet flow")
    void testAuthAndTweetFlow() throws Exception {
        // 1. Signup
        SignupRequest signup = new SignupRequest();
        signup.setUsername("testuser1");
        signup.setPassword("testpass123");
        signup.setEmail("testuser1@example.com");
        MvcResult signupResult = mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();
        String signupToken = objectMapper.readTree(signupResult.getResponse().getContentAsString()).get("token").asText();

        // 2. Signin
        SigninRequest signin = new SigninRequest();
        signin.setUsername("testuser1");
        signin.setPassword("testpass123");
        MvcResult signinResult = mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();
        String signinToken = objectMapper.readTree(signinResult.getResponse().getContentAsString()).get("token").asText();
        assertThat(signinToken).isNotBlank();

        // 3. Post a tweet
        TweetRequest tweetReq = new TweetRequest();
        tweetReq.setContent("Hello from test!");
        mockMvc.perform(post("/api/tweets")
                .header("Authorization", "Bearer " + signinToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tweetReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Hello from test!"));

        // 4. Get tweets
        mockMvc.perform(get("/api/tweets")
                .header("Authorization", "Bearer " + signinToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value("Hello from test!"));
    }

    @Test
    @DisplayName("Access denied without token")
    void testProtectedEndpointsRequireToken() throws Exception {
        mockMvc.perform(get("/api/tweets"))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/tweets")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"content\":\"test\"}"))
                .andExpect(status().isForbidden());
    }
}
