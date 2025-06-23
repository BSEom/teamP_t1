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
            @RequestParam String item,
            @RequestParam int year,
            @RequestParam int month) {

        String sql = """
                    SELECT area, min_price, max_price, price_diff, diff_ratio
                    FROM market_prices
                    WHERE item = ? AND year = ? AND month = ?
                """;

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, item, year, month);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/map")
    public ResponseEntity<List<String>> getMinPrice(@RequestParam String area) {

        String sql = """
                    SELECT ITEM
                    FROM (
                      SELECT ITEM, AREA, MIN_PRICE,
                             RANK() OVER (PARTITION BY ITEM ORDER BY MIN_PRICE ASC) AS rnk
                      FROM RECENT_PRICES
                    ) ranked
                    WHERE rnk = 1
                      AND AREA = ?
                """;

        List<String> result = jdbcTemplate.queryForList(sql, String.class, area);
        System.out.println(result);

        return ResponseEntity.ok(result);
    }

}
