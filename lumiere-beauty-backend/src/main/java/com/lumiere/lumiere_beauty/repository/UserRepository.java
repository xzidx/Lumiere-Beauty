package com.lumiere.lumiere_beauty.repository;

import com.lumiere.lumiere_beauty.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
     Optional<User> findByEmail(String email);
}