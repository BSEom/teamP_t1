package com.pknu.mini_project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board/comments")
public class CommentController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public String addComment(@RequestBody Map<String, String> data) {
        try {
            int boardId = Integer.parseInt(data.get("boardId"));
            String writerName = data.get("name");
            String content = data.get("content");

            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            List<Map<String, Object>> users = jdbcTemplate.queryForList(findUserSql, writerName);
            if (users.isEmpty())
                return "fail: user not found";

            int userId = ((Number) users.get(0).get("USER_ID")).intValue();

            String insertSql = "INSERT INTO BOARD_COMMENT (COMMENT_ID, BOARD_ID, USER_ID, CONTENT) VALUES (SEQ_COMMENT_ID.NEXTVAL, ?, ?, ?)";
            jdbcTemplate.update(insertSql, boardId, userId, content);

            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    @GetMapping("/{boardId}")
    public List<Map<String, Object>> getCommentsByBoard(@PathVariable int boardId) {
        String sql = """
                    SELECT c.COMMENT_ID, u.USER_NAME AS WRITER, c.CONTENT, TO_CHAR(FROM_TZ(CAST(c.COMMENT_DATE AS TIMESTAMP), 'UTC') AT TIME ZONE 'Asia/Seoul','HH24:MI') AS COMMENT_TIME
                    FROM BOARD_COMMENT c
                    JOIN USERS u ON c.USER_ID = u.USER_ID
                    WHERE c.BOARD_ID = ?
                    ORDER BY c.COMMENT_DATE ASC
                """;
        // System.out.println("댓글sql: " + sql);
        return jdbcTemplate.queryForList(sql, boardId);
    }

    @PutMapping("/{commentId}")
    public String updateComment(@PathVariable int commentId, @RequestBody Map<String, String> data) {
        try {
            String name = data.get("name");
            String content = data.get("content");

            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            List<Map<String, Object>> userList = jdbcTemplate.queryForList(findUserSql, name);

            if (userList.isEmpty()) {
                System.out.println("사용자 없음: " + name);
                return "fail: user not found";
            }

            int userId = ((Number) userList.get(0).get("USER_ID")).intValue();

            // 댓글 수정 (작성자도 확인하려면 조건에 user_id 추가 가능)
            String updateSql = "UPDATE BOARD_COMMENT SET CONTENT = ? WHERE COMMENT_ID = ?";
            int result = jdbcTemplate.update(updateSql, content, commentId);

            return result > 0 ? "success" : "fail: no rows updated";

        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    @DeleteMapping("/{commentId}")
    public String deleteComment(@PathVariable int commentId) {
        String sql = "DELETE FROM BOARD_COMMENT WHERE COMMENT_ID = ?";
        int result = jdbcTemplate.update(sql, commentId);
        return result > 0 ? "success" : "fail: comment not found or not deleted";
    }
}
