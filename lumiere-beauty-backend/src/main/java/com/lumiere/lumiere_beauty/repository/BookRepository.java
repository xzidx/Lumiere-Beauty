package com.lumiere.lumiere_beauty.repository;

import com.lumiere.lumiere_beauty.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {

}