package com.cloud7.security;

import com.cloud7.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

public class JwtUtil {

    private static final String SECRET =
            "cloud7-super-secret-key-32-bytes-minimum!";

    private static final Key KEY =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public static String generate(User user) {
        return Jwts.builder()
                .setSubject(user.email)
                .setIssuedAt(new Date())
                .claim("userId", user.id)
                .claim("firstName", user.firstName)
                .claim("lastName", user.lastName)
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SignatureAlgorithm.HS256, KEY)
                .compact();
    }

    public static Long validate(String token) {
        return Long.parseLong(
                Jwts.parser().setSigningKey(SECRET)
                        .parseClaimsJws(token)
                        .getBody()
                        .getSubject()
        );
    }
}