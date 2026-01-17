package com.cloud7.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cloud7.repository.UserRepository;
import com.cloud7.entity.User;
import com.cloud7.security.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository users;

    public AuthController(UserRepository users) {
        this.users = users;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) throws Exception {
        if (user.firstName == null || user.firstName.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("First name is required");
        }

        if (user.lastName == null || user.lastName.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("Last name is required");
        }

        if (user.email == null || user.email.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("Email is required");
        }

        if (user.password == null || user.password.length() < 6) {
            return ResponseEntity
                    .badRequest()
                    .body("Password must be at least 6 characters");
        }

        if (users.findByEmail(user.email).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }

        user.usedStorageBytes = 0L;
        user.storageQuotaBytes = (long) 1024 * 1024 * 1024; // 1 GB default
        users.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Signup successful");
    }

    @PostMapping("/login")
    public String login(@RequestBody User request) {
        User user = users.findByEmail(request.email)
                .orElseThrow(() -> new RuntimeException("Invalid Email"));

        if(!user.password.equals(request.password)){
            throw new RuntimeException("Invalid Password");
        }
        return JwtUtil.generate(user);
    }
}