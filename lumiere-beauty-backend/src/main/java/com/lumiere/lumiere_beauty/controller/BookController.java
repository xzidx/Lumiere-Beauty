
package com.lumiere.lumiere_beauty.controller;

import com.lumiere.lumiere_beauty.model.Book;
import com.lumiere.lumiere_beauty.repository.BookRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookRepository bookRepository;

    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @PostMapping
    public Book createBook(@RequestBody Book book) {
        return bookRepository.save(book);


    }

@GetMapping
public List<Book> getAllBooks() {
    return bookRepository.findAll();
}

}


