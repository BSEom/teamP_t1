package com.example.project_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/chart")
public class ChartController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/select")
    public ResponseEntity<List<Map<String, Object>>> getPriceStats(
            @RequestParam String area,
            @RequestParam int year,
            @RequestParam int month) {

        String sql = """
                    SELECT item as item, min_price as min_price, max_price as max_price, price_diff as price_diff, diff_ratio as diff_ratio
                    FROM market_prices
                    WHERE area = ? AND year = ? AND month = ?
                """;

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, area, year, month);
        return ResponseEntity.ok(result);
    }
}
