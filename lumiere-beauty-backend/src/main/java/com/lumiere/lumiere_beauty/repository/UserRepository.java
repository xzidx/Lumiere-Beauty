package com.lumiere.lumiere_beauty.repository;

import com.lumiere.lumiere_beauty.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}