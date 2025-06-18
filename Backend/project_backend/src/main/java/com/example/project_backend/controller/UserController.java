package com.example.project_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.project_backend.dto.LoginDto;
import com.example.project_backend.dto.ResultDto;
import com.example.project_backend.dto.SignUpDto;
import com.example.project_backend.service.MemberService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private MemberService memberService;

    @PostMapping("/login")
    public ResponseEntity<String> loginFn(@RequestBody LoginDto dto, HttpSession session) {

        boolean result = memberService.login(dto);

        System.out.println(result);

        if (result) { // DB에서 로그인 정보 대조할 부분
            session.setAttribute("user", dto.getUsername());
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패"); // code: 401
        }
    }

    @PostMapping("/sign-up")
    public ResponseEntity<String> signupFn(@RequestBody SignUpDto dto) {
        ResultDto result = memberService.signup(dto);

        if (result.isSuccess()) {

            return ResponseEntity.ok(result.getMessage());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(result.getMessage()); // code: 409
        }

    }

}
