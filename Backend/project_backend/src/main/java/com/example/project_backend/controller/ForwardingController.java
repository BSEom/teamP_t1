package com.example.project_backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardingController {

    // 최상위 경로
    @GetMapping("/{path:^(?!api|static|error).*$}")
    public String redirectRoot() {
        return "forward:/";
    }

    // 하위 경로 (확장자 없는 모든 경로 포함)
    @GetMapping("/**/{path:[^\\.]*}")
    public String redirectSubPath() {
        return "forward:/";
    }
}