package com.example.project_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board")
public class BookmarkController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 북마크 확인
    @GetMapping("/bookmark/{boardId}")
    public boolean isBookmarked(@PathVariable int boardId, @RequestParam String userName) {
        String sql = "SELECT COUNT(*) FROM USER_BOOKMARK WHERE BOARD_ID = ? AND USER_ID = (SELECT USER_ID FROM USERS WHERE USER_NAME = ?)";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, boardId, userName);
        return count != null && count > 0;
    }

    // 북마크 추가
    @PostMapping("/bookmark/{boardId}")
    public String addBookmark(@PathVariable int boardId,
            @RequestBody Map<String, String> data) {
        try {
            String userName = data.get("userId"); // 실제로는 userName
            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            List<Map<String, Object>> users = jdbcTemplate.queryForList(findUserSql, userName);
            if (users.isEmpty())
                return "fail: user not found";
            int userId = ((Number) users.get(0).get("USER_ID")).intValue();

            String checkSql = "SELECT COUNT(*) FROM USER_BOOKMARK WHERE BOARD_ID = ? AND USER_ID = ?";
            Integer exists = jdbcTemplate.queryForObject(checkSql, Integer.class, boardId, userId);
            if (exists != null && exists > 0)
                return "fail: already bookmarked";

            String insertSql = "INSERT INTO USER_BOOKMARK (BOOKMARK_NO, BOARD_ID, USER_ID, IS_BOOKMARKED) VALUES (SEQ_BOOKMARK_NO.NEXTVAL, ?, ?, 1)";
            jdbcTemplate.update(insertSql, boardId, userId);

            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    // 북마크 삭제
    @PutMapping("/bookmark/{boardId}/{userId}")
    public String toggleBookmark(@PathVariable int boardId, @PathVariable int userId) {
        try {

            String updateSql = "UPDATE USER_BOOKMARK " +
                    "SET IS_BOOKMARKED = CASE WHEN IS_BOOKMARKED = 1 THEN 0 ELSE 1 END " +
                    "WHERE BOARD_ID = ? AND USER_ID = ?";

            int result = jdbcTemplate.update(updateSql, boardId, userId);
            if (result > 0) {
                String stateSql = "SELECT IS_BOOKMARKED FROM USER_BOOKMARK WHERE BOARD_ID = ? AND USER_ID = ?";
                Integer state = jdbcTemplate.queryForObject(stateSql, Integer.class, boardId, userId);
                if (state != null && state == 1) {
                    return "success: bookmarked";
                } else {
                    return "success: unbookmarked";
                }
            } else {
                return "fail: not found or not updated";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

}