
package com.lumiere.lumiere_beauty.service;

import com.lumiere.lumiere_beauty.model.User;
import com.lumiere.lumiere_beauty.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create User
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Default role for normal registration
        user.setRole("CUSTOMER");

        return userRepository.save(user);
    }

    // Login User
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    // Get All Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update User Profile
    public User updateUser(Long id, Map<String, String> data) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setFullName(data.get("fullName"));
        user.setEmail(data.get("email"));
        user.setPhone(data.get("phone"));

        return userRepository.save(user);
    }
}
