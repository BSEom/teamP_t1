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

// @CrossOrigin(origins = "http://localhost:5173")
// @RestController
// @RequestMapping("/api/board/comments")
// public class CommentController {

//     @Autowired
//     private JdbcTemplate jdbcTemplate;

//     @Operation(summary = "댓글 작성")
//     @PostMapping
//     public String addComment(@RequestBody Map<String, String> data) {
//         try {
//             int boardId = Integer.parseInt(data.get("boardId"));
//             String writerName = data.get("name");
//             String content = data.get("content");

//             String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
//             List<Map<String, Object>> users = jdbcTemplate.queryForList(findUserSql, writerName);
//             if (users.isEmpty())
//                 return "fail: user not found";

//             int userId = ((Number) users.get(0).get("USER_ID")).intValue();

//             String insertSql = "INSERT INTO BOARD_COMMENT (COMMENT_ID, BOARD_ID, USER_ID, CONTENT) VALUES (SEQ_COMMENT_ID.NEXTVAL, ?, ?, ?)";
//             jdbcTemplate.update(insertSql, boardId, userId, content);

//             return "success";
//         } catch (Exception e) {
//             e.printStackTrace();
//             return "fail: " + e.getMessage();
//         }
//     }

//     @Operation(summary = "댓글 조회")
//     @GetMapping("/{boardId}")
//     public List<Map<String, Object>> getCommentsByBoard(@PathVariable int boardId) {
//         String sql = """
//                     SELECT c.COMMENT_ID, u.USER_NAME AS WRITER, c.CONTENT, TO_CHAR(FROM_TZ(CAST(c.COMMENT_DATE AS TIMESTAMP), 'UTC') AT TIME ZONE 'Asia/Seoul','YYYY-MM-DD HH24:MI') AS COMMENT_TIME
//                     FROM BOARD_COMMENT c
//                     JOIN USERS u ON c.USER_ID = u.USER_ID
//                     WHERE c.BOARD_ID = ?
//                     ORDER BY c.COMMENT_DATE ASC
//                 """;
//         return jdbcTemplate.queryForList(sql, boardId);
//     }

//     @Operation(summary = "댓글 수정")
//     @PutMapping("/{commentId}")
//     public String updateComment(@PathVariable int commentId, @RequestBody Map<String, String> data) {
//         try {
//             String name = data.get("name");
//             String content = data.get("content");

//             String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
//             List<Map<String, Object>> userList = jdbcTemplate.queryForList(findUserSql, name);

//             if (userList.isEmpty()) {
//                 System.out.println("사용자 없음: " + name);
//                 return "fail: user not found";
//             }

//             int userId = ((Number) userList.get(0).get("USER_ID")).intValue();

//             String updateSql = "UPDATE BOARD_COMMENT SET CONTENT = ?, COMMENT_DATE = SYSTIMESTAMP WHERE COMMENT_ID = ?";
//             int result = jdbcTemplate.update(updateSql, content, commentId);

//             return result > 0 ? "success" : "fail: no rows updated";

//         } catch (Exception e) {
//             e.printStackTrace();
//             return "fail: " + e.getMessage();
//         }
//     }

//     @Operation(summary = "댓글 삭제")
//     @DeleteMapping("/{commentId}")
//     public String deleteComment(@PathVariable int commentId) {
//         String sql = "DELETE FROM BOARD_COMMENT WHERE COMMENT_ID = ?";
//         int result = jdbcTemplate.update(sql, commentId);
//         return result > 0 ? "success" : "fail: comment not found or not deleted";
//     }

//     // 댓글 모으기
//     @Operation(summary = "댓글 모으기")
//     @GetMapping("/mypage")
//     public List<Map<String, Object>> getUserPosts(@RequestParam String userName) {
//         try {
//             String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
//             Integer userId = jdbcTemplate.queryForObject(findUserSql, Integer.class, userName);

//             String sql = "SELECT UB.BOARD_ID,UB.TITLE,BC.CONTENT,BC.COMMENT_ID, BC.COMMENT_DATE " +
//                     "FROM BOARD_COMMENT BC " +
//                     "JOIN USER_BOARD UB ON BC.BOARD_ID = UB.BOARD_ID " +
//                     "WHERE BC.USER_ID = ? ";
                    
//             return jdbcTemplate.queryForList(sql, userId);
//         } catch (Exception e) {
//             e.printStackTrace();
//             return List.of();
//         }
//     }

// }
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board/comments")
public class CommentController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Operation(summary = "댓글 작성 및 답글 작성")
    @PostMapping
    public String addComment(@RequestBody Map<String, Object> data) {
        try {
            int boardId = Integer.parseInt(data.get("boardId").toString());
            String writerName = (String) data.get("name");
            String content = (String) data.get("content");
            Integer parentCommentId = null;
            if (data.get("parentCommentId") != null) {
                parentCommentId = Integer.parseInt(data.get("parentCommentId").toString());
            }

            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            List<Map<String, Object>> users = jdbcTemplate.queryForList(findUserSql, writerName);
            if (users.isEmpty())
                return "fail: user not found";

            int userId = ((Number) users.get(0).get("USER_ID")).intValue();

            String insertSql = "INSERT INTO BOARD_COMMENT (COMMENT_ID, BOARD_ID, USER_ID, CONTENT, PARENT_COMMENT_ID) VALUES (SEQ_COMMENT_ID.NEXTVAL, ?, ?, ?, ?)";
            jdbcTemplate.update(insertSql, boardId, userId, content, parentCommentId);

            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    @Operation(summary = "댓글 및 답글 조회")
    @GetMapping("/{boardId}")
    public List<Map<String, Object>> getCommentsByBoard(@PathVariable int boardId) {
        String sql = """
            SELECT c.COMMENT_ID, u.USER_NAME AS WRITER, c.CONTENT, c.PARENT_COMMENT_ID,
                   TO_CHAR(FROM_TZ(CAST(c.COMMENT_DATE AS TIMESTAMP), 'UTC') AT TIME ZONE 'Asia/Seoul','YYYY-MM-DD HH24:MI') AS COMMENT_TIME
            FROM BOARD_COMMENT c
            JOIN USERS u ON c.USER_ID = u.USER_ID
            WHERE c.BOARD_ID = ?
            ORDER BY c.COMMENT_DATE ASC
        """;
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

            // 작성자 검증을 원한다면 아래 조건 추가 가능
            // String checkAuthorSql = "SELECT COUNT(*) FROM BOARD_COMMENT WHERE COMMENT_ID = ? AND USER_ID = ?";
            // Integer count = jdbcTemplate.queryForObject(checkAuthorSql, Integer.class, commentId, userId);
            // if (count == null || count == 0) return "fail: not authorized";

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

    @Operation(summary = "사용자 댓글 모으기")
    @GetMapping("/mypage")
    public List<Map<String, Object>> getUserPosts(@RequestParam String userName) {
        try {
            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            Integer userId = jdbcTemplate.queryForObject(findUserSql, Integer.class, userName);

            String sql = "SELECT UB.BOARD_ID, UB.TITLE, BC.CONTENT, BC.COMMENT_ID, BC.COMMENT_DATE " +
                         "FROM BOARD_COMMENT BC " +
                         "JOIN USER_BOARD UB ON BC.BOARD_ID = UB.BOARD_ID " +
                         "WHERE BC.USER_ID = ?";

            return jdbcTemplate.queryForList(sql, userId);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

}