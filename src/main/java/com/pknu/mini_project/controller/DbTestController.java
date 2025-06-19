package com.pknu.mini_project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DbTestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/test")
    public String test() {
        try {
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM USERS", Integer.class);
            return "USERS 테이블 행 수: " + count;
        } catch (Exception e) {
            return "DB 연결 실패: " + e.getMessage();
        }
    }
}