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

import io.swagger.v3.oas.annotations.Operation;

// @CrossOrigin(origins = "http://localhost:5173")
// @RestController
// @RequestMapping("/api/board")
// public class BookmarkController {

//     @Autowired
//     private JdbcTemplate jdbcTemplate;

//     @Operation(summary = "북마크 여부 확인")
//     @GetMapping("/bookmark/{boardId}")
//     public boolean isBookmarked(@PathVariable int boardId, @RequestParam String userName) {
//         try {
//             String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
//             List<Integer> userIds = jdbcTemplate.query(findUserSql, (rs, rowNum) -> rs.getInt("USER_ID"), userName);

//             if (userIds.isEmpty()) {
//                 System.out.println("사용자 없음: " + userName);
//                 return false;
//             }

//             int userId = userIds.get(0);

//             String sql = "SELECT IS_BOOKMARKED FROM USER_BOOKMARK WHERE BOARD_ID = ? AND USER_ID = ?";
//             List<Integer> bookmarks = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getInt("IS_BOOKMARKED"), boardId,
//                     userId);

//             return !bookmarks.isEmpty() && bookmarks.get(0) == 1;

//         } catch (Exception e) {
//             e.printStackTrace();
//             return false;
//         }
//     }

//     @Operation(summary = "북마크 추가")
//     @PostMapping("/bookmark/{boardId}")
//     public String addBookmark(@PathVariable int boardId,
//             @RequestBody Map<String, String> data) {
//         try {
//             int userId = Integer.parseInt(data.get("userId"));

//             String checkSql = "SELECT COUNT(*) FROM USER_BOOKMARK WHERE BOARD_ID = ? AND USER_ID = ?";
//             Integer exists = jdbcTemplate.queryForObject(checkSql, Integer.class, boardId, userId);

//             if (exists != null && exists > 0) {

//                 String updateSql = "UPDATE USER_BOOKMARK SET IS_BOOKMARKED = 1 WHERE BOARD_ID = ? AND USER_ID = ?";
//                 jdbcTemplate.update(updateSql, boardId, userId);
//                 return "success: bookmarked (reactivated)";
//             }

//             String insertSql = "INSERT INTO USER_BOOKMARK (BOOKMARK_NO, BOARD_ID, USER_ID, IS_BOOKMARKED) VALUES (SEQ_BOOKMARK_NO.NEXTVAL, ?, ?, 1)";
//             jdbcTemplate.update(insertSql, boardId, userId);

//             return "success: bookmarked (inserted)";
//         } catch (Exception e) {
//             e.printStackTrace();
//             return "fail: " + e.getMessage();
//         }
//     }

//     // 북마크 삭제
//     @Operation(summary = "북마크 삭제")
//     @PutMapping("/bookmark/{boardId}/{userId}")
//     public String toggleBookmark(@PathVariable int boardId, @PathVariable int userId) {
//         try {
//             String checkSql = "SELECT COUNT(*) FROM USER_BOOKMARK WHERE BOARD_ID = ? AND USER_ID = ?";
//             Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, boardId, userId);

//             if (count == null || count == 0) {
//                 String insertSql = "INSERT INTO USER_BOOKMARK (BOOKMARK_NO, BOARD_ID, USER_ID, IS_BOOKMARKED) VALUES (SEQ_BOOKMARK_NO.NEXTVAL, ?, ?, 1)";
//                 jdbcTemplate.update(insertSql, boardId, userId);
//                 return "success: bookmarked (inserted)";
//             }

//             String updateSql = "UPDATE USER_BOOKMARK " +
//                     "SET IS_BOOKMARKED = CASE WHEN IS_BOOKMARKED = 1 THEN 0 ELSE 1 END " +
//                     "WHERE BOARD_ID = ? AND USER_ID = ?";

//             int result = jdbcTemplate.update(updateSql, boardId, userId);

//             if (result > 0) {
//                 String stateSql = "SELECT IS_BOOKMARKED FROM USER_BOOKMARK WHERE BOARD_ID = ? AND USER_ID = ?";
//                 Integer state = jdbcTemplate.queryForObject(stateSql, Integer.class, boardId, userId);
//                 if (state != null && state == 1) {
//                     return "success: bookmarked";
//                 } else {
//                     return "success: unbookmarked";
//                 }
//             } else {
//                 return "fail: not updated";
//             }

//         } catch (Exception e) {
//             e.printStackTrace();
//             return "fail: " + e.getMessage();
//         }
//     }

//     // 북마크된 게시글만 모으기
//     @Operation(summary = "북마크한 게시글 모으기")
//     @GetMapping("/mypage/bookmarks")
//     public List<Map<String, Object>> getBookmarkedPosts(@RequestParam String userName) {
//         try {
//             String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
//             Integer userId = jdbcTemplate.queryForObject(findUserSql, Integer.class, userName);

//             String sql = "SELECT B.BOARD_ID, B.TITLE, B.CONTENT, U.USER_NAME AS WRITER, B.HIT " +
//                     "FROM USER_BOARD B " +
//                     "JOIN USER_BOOKMARK UB ON B.BOARD_ID = UB.BOARD_ID " +
//                     "JOIN USERS U ON B.USER_ID = U.USER_ID " +
//                     "WHERE UB.USER_ID = ? AND UB.IS_BOOKMARKED = 1 ";

//             return jdbcTemplate.queryForList(sql, userId);
//         } catch (Exception e) {
//             e.printStackTrace();
//             return List.of(); // 빈 리스트 반환
//         }
//     }

// }
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board")
public class BookmarkController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // @GetMapping("/bookmark/{boardId}")
    // public boolean isBookmarked(@PathVariable int boardId, @RequestParam String
    // userName) {
    // try {

    // String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
    // Integer userId = jdbcTemplate.queryForObject(findUserSql, Integer.class,
    // userName);

    // String sql = "SELECT IS_BOOKMARKED FROM USER_BOOKMARK WHERE BOARD_ID = ? AND
    // USER_ID = ?";
    // Integer isBookmarked = jdbcTemplate.queryForObject(sql, Integer.class,
    // boardId, userId);

    // return isBookmarked != null && isBookmarked == 1;
    // } catch (Exception e) {
    // e.printStackTrace();
    // return false;
    // }
    // }
    @GetMapping("/bookmark/{boardId}")
    public boolean isBookmarked(@PathVariable int boardId, @RequestParam String userName) {
        try {
            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            List<Integer> userIds = jdbcTemplate.query(findUserSql, (rs, rowNum) -> rs.getInt("USER_ID"), userName);

            if (userIds.isEmpty()) {
                System.out.println("사용자 없음: " + userName);
                return false;
            }

            int userId = userIds.get(0);

            String sql = "SELECT IS_BOOKMARKED FROM USER_BOOKMARK WHERE BOARD_ID = ? AND USER_ID = ?";
            List<Integer> bookmarks = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getInt("IS_BOOKMARKED"), boardId,
                    userId);

            return !bookmarks.isEmpty() && bookmarks.get(0) == 1;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @PostMapping("/bookmark/{boardId}")
    public String addBookmark(@PathVariable int boardId,
            @RequestBody Map<String, String> data) {
        try {
            int userId = Integer.parseInt(data.get("userId"));

            String checkSql = "SELECT COUNT(*) FROM USER_BOOKMARK WHERE BOARD_ID = ? AND USER_ID = ?";
            Integer exists = jdbcTemplate.queryForObject(checkSql, Integer.class, boardId, userId);

            if (exists != null && exists > 0) {

                String updateSql = "UPDATE USER_BOOKMARK SET IS_BOOKMARKED = 1 WHERE BOARD_ID = ? AND USER_ID = ?";
                jdbcTemplate.update(updateSql, boardId, userId);
                return "success: bookmarked (reactivated)";
            }

            String insertSql = "INSERT INTO USER_BOOKMARK (BOOKMARK_NO, BOARD_ID, USER_ID, IS_BOOKMARKED) VALUES (SEQ_BOOKMARK_NO.NEXTVAL, ?, ?, 1)";
            jdbcTemplate.update(insertSql, boardId, userId);

            return "success: bookmarked (inserted)";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    // 북마크 삭제
    @PutMapping("/bookmark/{boardId}/{userId}")
    public String toggleBookmark(@PathVariable int boardId, @PathVariable int userId) {
        try {
            String checkSql = "SELECT COUNT(*) FROM USER_BOOKMARK WHERE BOARD_ID = ? AND USER_ID = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, boardId, userId);

            if (count == null || count == 0) {
                String insertSql = "INSERT INTO USER_BOOKMARK (BOOKMARK_NO, BOARD_ID, USER_ID, IS_BOOKMARKED) VALUES (SEQ_BOOKMARK_NO.NEXTVAL, ?, ?, 1)";
                jdbcTemplate.update(insertSql, boardId, userId);
                return "success: bookmarked (inserted)";
            }

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
                return "fail: not updated";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    // 북마크된 게시글만 모으기
    @GetMapping("/mypage/bookmarks")
    public List<Map<String, Object>> getBookmarkedPosts(@RequestParam String userName) {
        try {
            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            Integer userId = jdbcTemplate.queryForObject(findUserSql, Integer.class, userName);

            String sql = "SELECT B.BOARD_ID, B.TITLE, B.CONTENT, U.USER_NAME AS WRITER, B.HIT " +
                    "FROM USER_BOARD B " +
                    "JOIN USER_BOOKMARK UB ON B.BOARD_ID = UB.BOARD_ID " +
                    "JOIN USERS U ON B.USER_ID = U.USER_ID " +
                    "WHERE UB.USER_ID = ? AND UB.IS_BOOKMARKED = 1 ";

            return jdbcTemplate.queryForList(sql, userId);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of(); // 빈 리스트 반환
        }
    }

}
