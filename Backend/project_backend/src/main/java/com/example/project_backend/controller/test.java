package com.example.project_backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class test {

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from Spring Boot!";
    }

    @GetMapping("/json")
    public Response helloJson() {
        return new Response("Hello", "This is a JSON response");
    }

    static class Response {
        private String title;
        private String message;

        public Response(String title, String message) {
            this.title = title;
            this.message = message;
        }

        public String getTitle() {
            return title;
        }

        public String getMessage() {
            return message;
        }
    }
}