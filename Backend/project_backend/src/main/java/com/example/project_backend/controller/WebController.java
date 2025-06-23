package com.example.project_backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {
    @GetMapping("/")
    public String index() {
        return "index.html"; // static/index.html 불러옴
    }

    @RequestMapping("/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }

}
