package com.example.project_backend.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board/comments")
public class CommentController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Operation(summary = "댓글 작성")
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

    @Operation(summary = "댓글 조회")
    @GetMapping("/{boardId}")
    public List<Map<String, Object>> getCommentsByBoard(@PathVariable int boardId) {
        String sql = """
                    SELECT c.COMMENT_ID, u.USER_NAME AS WRITER, c.CONTENT, TO_CHAR(FROM_TZ(CAST(c.COMMENT_DATE AS TIMESTAMP), 'UTC') AT TIME ZONE 'Asia/Seoul','YYYY-MM-DD HH24:MI') AS COMMENT_TIME
                    FROM BOARD_COMMENT c
                    JOIN USERS u ON c.USER_ID = u.USER_ID
                    WHERE c.BOARD_ID = ?
                    ORDER BY c.COMMENT_DATE ASC
                """;
        // System.out.println("댓글sql: " + sql);
        return jdbcTemplate.queryForList(sql, boardId);
    }

    @Operation(summary = "댓글 수정")
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
            // String updateSql = "UPDATE BOARD_COMMENT SET CONTENT = ? WHERE COMMENT_ID =
            // ?";
            // int result = jdbcTemplate.update(updateSql, content, commentId);
            String updateSql = "UPDATE BOARD_COMMENT SET CONTENT = ?, COMMENT_DATE = SYSTIMESTAMP WHERE COMMENT_ID = ?";
            int result = jdbcTemplate.update(updateSql, content, commentId);

            return result > 0 ? "success" : "fail: no rows updated";

        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    @Operation(summary = "댓글 삭제")
    @DeleteMapping("/{commentId}")
    public String deleteComment(@PathVariable int commentId) {
        String sql = "DELETE FROM BOARD_COMMENT WHERE COMMENT_ID = ?";
        int result = jdbcTemplate.update(sql, commentId);
        return result > 0 ? "success" : "fail: comment not found or not deleted";
    }

    // 댓글 모으기
    @Operation(summary = "댓글 모으기")
    @GetMapping("/mypage")
    public List<Map<String, Object>> getUserPosts(@RequestParam String userName) {
        try {
            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            Integer userId = jdbcTemplate.queryForObject(findUserSql, Integer.class, userName);

            // String sql = "SELECT B.BOARD_ID, B.TITLE, B.CONTENT, U.USER_NAME AS WRITER,
            // B.HIT, BC.CONTENT " +
            // "FROM USER_BOARD B " +
            // "JOIN USERS U ON B.USER_ID = U.USER_ID " +
            // "JOIN BOARD_COMMENT BC ON B.USER_ID = BC.USER_ID " +
            // "WHERE U.USER_ID = ?";

            // String sql = "SELECT B.BOARD_ID, B.TITLE, B.CONTENT AS BOARD_CONTENT,
            // U.USER_NAME AS WRITER, B.HIT, LISTAGG(BC.CONTENT, '||') WITHIN GROUP (ORDER
            // BY BC.COMMENT_DATE) AS ALL_COMMENTS "
            // +
            // "FROM USER_BOARD B " +
            // "JOIN USERS U ON B.USER_ID = U.USER_ID " +
            // "JOIN BOARD_COMMENT BC ON B.USER_ID = BC.USER_ID " +
            // "WHERE U.USER_ID = ? " +
            // "GROUP BY B.BOARD_ID, B.TITLE, B.CONTENT, U.USER_NAME, B.HIT " +
            // "ORDER BY B.BOARD_ID ";

            // String sql = "SELECT * FROM BOARD_COMMENT WHERE USER_ID = ? ";

            String sql = "SELECT UB.BOARD_ID,UB.TITLE,BC.CONTENT,BC.COMMENT_ID, BC.COMMENT_DATE " +
                    "FROM BOARD_COMMENT BC " +
                    "JOIN USER_BOARD UB ON BC.BOARD_ID = UB.BOARD_ID " +
                    "WHERE BC.USER_ID = ? ";
                    
            return jdbcTemplate.queryForList(sql, userId);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

}