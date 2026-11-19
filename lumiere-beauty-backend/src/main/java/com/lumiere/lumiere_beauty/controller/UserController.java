package com.lumiere.lumiere_beauty.controller;

import com.lumiere.lumiere_beauty.model.User;
import com.lumiere.lumiere_beauty.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:5173")@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create User
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Get All Users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    // Login User
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {

        User user = userService.login(
                loginData.get("email"),
                loginData.get("password")
        );

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return response;
    }
 }