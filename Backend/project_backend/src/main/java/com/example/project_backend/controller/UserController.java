package com.example.project_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.project_backend.dto.LoginDto;
import com.example.project_backend.dto.ResultDto;
import com.example.project_backend.dto.SignUpDto;
import com.example.project_backend.service.MemberService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private MemberService memberService;

    @Operation(summary = "로그인")
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginFn(@RequestBody LoginDto dto, HttpSession session) {

        Optional<String> result = memberService.login(dto);

        System.out.println(result);

        if (result.isPresent()) { // DB에서 로그인 정보 대조할 부분
            session.setAttribute("user", result.get());
            return ResponseEntity.ok(Map.of("message", "로그인 성공!", "username", result.get()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 실패")); // code: 401
        }
    }

    @Operation(summary = "회원가입")
    @PostMapping("/sign-up")
    public ResponseEntity<Map<String, String>> signupFn(@RequestBody SignUpDto dto) {
        ResultDto result = memberService.signup(dto);

        if (result.isSuccess()) {

            return ResponseEntity.ok(Map.of("message", result.getMessage()));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", result.getMessage())); // code: 409
        }

    }

    @Operation(summary = "업데이트 (구현X)")
    @PostMapping("/update")
    public ResponseEntity<Map<String, String>> updateFn(@RequestBody SignUpDto dto) {
        ResultDto result = memberService.signup(dto);

        if (result.isSuccess()) {

            return ResponseEntity.ok(Map.of("message", result.getMessage()));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", result.getMessage())); // code: 409
        }

    }

    @Operation(summary = "닉네임 중복 체크")
    @PostMapping("/sign-up/name-check")
    public ResponseEntity<Map<String, String>> nameCheck(@RequestBody String username) {

        boolean result = memberService.nameck(username);
        System.out.println(username);
        if (result) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "이미 존재하는 이름"));
        } else {
            return ResponseEntity.ok(Map.of("message", "사용가능한 이름"));
        }

    }

    @Operation(summary = "이메일 중복 체크")
    @PostMapping("/sign-up/email-check")
    public ResponseEntity<Map<String, String>> emailCheck(@Valid @RequestBody String email) {

        boolean result = memberService.emailck(email);

        if (result) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "이미 존재하는 메일"));
        } else {
            return ResponseEntity.ok(Map.of("message", "사용가능한 메일"));
        }

    }

    @Operation(summary = "로그인 상태 확인")
    @GetMapping("/me")
    public ResponseEntity<?> getSession(HttpSession session) {

        Object user = session.getAttribute("user");
        Object uid = memberService.getuid(user);
        memberService.getuid(user);

        if (user != null) {
            return ResponseEntity.ok(Map.of("username", user, "uid", uid));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok(Map.of("message", "로그아웃 완료"));
    }

}
