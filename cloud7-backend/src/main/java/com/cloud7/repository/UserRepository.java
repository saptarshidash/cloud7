package com.cloud7.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cloud7.entity.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}