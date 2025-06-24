package com.example.project_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.project_backend.domain.Pagination;
import com.example.project_backend.domain.PagingResponse;
import com.example.project_backend.domain.SearchVo;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class BoardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/board")
    public PagingResponse<Map<String, Object>> getBoardList(@ModelAttribute SearchVo searchVo) {
        int total = getBoardCount();
        Pagination pagination = new Pagination(total, searchVo);

        int endRow = searchVo.getPage() * searchVo.getRecordSize();
        int offset = (searchVo.getPage() - 1) * searchVo.getRecordSize();

        String sql = """
                SELECT * FROM (
                    SELECT ROWNUM AS RNUM, BOARD_ID, WRITER, TITLE FROM (
                        SELECT b.BOARD_ID, u.USER_NAME AS WRITER, b.TITLE
                        FROM USER_BOARD b
                        JOIN USERS u ON b.USER_ID = u.USER_ID
                        ORDER BY b.BOARD_ID DESC
                    )
                    WHERE ROWNUM <= ?
                )
                WHERE RNUM > ?
                """;

        List<Map<String, Object>> boardList = jdbcTemplate.queryForList(sql, endRow, offset);

        return new PagingResponse<>(boardList, pagination);
    }

    @GetMapping("/board/count")
    public int getBoardCount() {
        String sql = "SELECT COUNT(*) FROM USER_BOARD";
        // System.out.println("-------------sql:" + sql);
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    @PostMapping("/write")
    public String writePost(@RequestBody Map<String, String> data) {
        System.out.println("받은 데이터: " + data);
        try {
            String title = data.get("title");
            String name = data.get("name");
            String content = data.get("content");

            System.out.println("title: " + title);
            System.out.println("name: " + name);
            System.out.println("content: " + content);

            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            List<Map<String, Object>> userList = jdbcTemplate.queryForList(findUserSql, name);

            if (userList.isEmpty()) {
                System.out.println("사용자 없음: " + name);
                return "fail: user not found";
            }

            int userId = ((Number) userList.get(0).get("USER_ID")).intValue();
            System.out.println("찾은 USER_ID: " + userId);

            String insertSql = "INSERT INTO USER_BOARD (BOARD_ID, USER_ID, TITLE, CONTENT) " +
                    "VALUES (SEQ_BOARD_ID.NEXTVAL, ?, ?, ?)";

            // jdbcTemplate.update(insertSql, userId, title, content);
            int result = jdbcTemplate.update(insertSql, userId, title, content);
            System.out.println("insert 결과: " + result);
            return "success";

        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    @GetMapping("/board/{boardId}")
    public Map<String, Object> getBoardDetail(@PathVariable int boardId) {
        System.out.println("요청된 boardId: " + boardId);
        // String sql = "SELECT b.BOARD_ID, b.TITLE, u.USER_NAME AS WRITER, b.CONTENT,
        // b.HIT " +
        // "FROM USER_BOARD b " +
        // "JOIN USERS u ON b.USER_ID = u.USER_ID " +
        // "WHERE b.BOARD_ID = ?";
        // String sql = "SELECT b.BOARD_ID, b.TITLE, u.USER_NAME AS WRITER, b.CONTENT,
        // b.HIT, b.BOARD_DATE " +
        String sql = "SELECT b.BOARD_ID, b.TITLE, u.USER_NAME AS WRITER, b.CONTENT, b.HIT, TO_CHAR(FROM_TZ(CAST(b.BOARD_DATE AS TIMESTAMP), 'UTC') AT TIME ZONE 'Asia/Seoul','YYYY-MM-DD HH24:MI') AS BOARD_TIME "
                +
                "FROM USER_BOARD b " +
                "JOIN USERS u ON b.USER_ID = u.USER_ID " +
                "WHERE b.BOARD_ID = ?";

        // return jdbcTemplate.queryForMap(sql, boardId);
        try {
            return jdbcTemplate.queryForMap(sql, boardId);
        } catch (Exception e) {
            System.out.println("조회 오류: " + e.getMessage());
            return Map.of();
        }
    }

    @PutMapping("/board/{boardId}")
    public String updateBoard(@PathVariable int boardId, @RequestBody Map<String, String> data) {
        try {
            String title = data.get("title");
            String name = data.get("name");
            String content = data.get("content");

            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            List<Map<String, Object>> userList = jdbcTemplate.queryForList(findUserSql, name);

            if (userList.isEmpty()) {
                System.out.println("사용자 없음: " + name);
                return "fail: user not found";
            }

            int userId = ((Number) userList.get(0).get("USER_ID")).intValue();

            // 게시글 수정
            // String updateSql = "UPDATE USER_BOARD SET USER_ID = ?, TITLE = ?, CONTENT = ?
            // WHERE BOARD_ID = ?";
            // int result = jdbcTemplate.update(updateSql, userId, title, content, boardId);

            // 시간도 같이 바뀜
            String updateSql = "UPDATE USER_BOARD SET USER_ID = ?, TITLE = ?, CONTENT = ?, BOARD_DATE = SYSTIMESTAMP WHERE BOARD_ID = ?";
            int result = jdbcTemplate.update(updateSql, userId, title, content, boardId);

            return result > 0 ? "success" : "fail: no rows updated";

        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    @DeleteMapping("/board/{boardId}")
    public String deleteBoard(@PathVariable int boardId) {
        try {
            String commentCheckSql = "SELECT COUNT(*) FROM BOARD_COMMENT WHERE BOARD_ID = ?";
            Integer commentCount = jdbcTemplate.queryForObject(commentCheckSql, Integer.class, boardId);

            if (commentCount != null && commentCount > 0) {
                return "fail: comments_exist";
            }

            String checkSql = "SELECT COUNT(*) FROM USER_BOARD WHERE BOARD_ID = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, boardId);
            if (count == null || count == 0) {
                return "fail: board not found";
            }

            String deleteSql = "DELETE FROM USER_BOARD WHERE BOARD_ID = ?";
            int result = jdbcTemplate.update(deleteSql, boardId);

            return result > 0 ? "success" : "fail: delete failed";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    // 조회수
    @PutMapping("/board/hit/{boardId}")
    public String increaseHit(@PathVariable int boardId) {
        try {
            String sql = "UPDATE USER_BOARD SET HIT = NVL(HIT, 0) + 1 WHERE BOARD_ID = ?";
            int result = jdbcTemplate.update(sql, boardId);
            return result > 0 ? "success" : "fail: not updated";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

    // 게시글 모으기
    @GetMapping("/board/mypage/board")
    public List<Map<String, Object>> getUserPosts(@RequestParam String userName) {
        try {
            String findUserSql = "SELECT USER_ID FROM USERS WHERE USER_NAME = ?";
            Integer userId = jdbcTemplate.queryForObject(findUserSql, Integer.class, userName);

            String sql = "SELECT B.BOARD_ID, B.TITLE, B.CONTENT, U.USER_NAME AS WRITER, B.HIT " +
                    "FROM USER_BOARD B " +
                    "JOIN USERS U ON B.USER_ID = U.USER_ID " +
                    "WHERE U.USER_ID = ?";

            return jdbcTemplate.queryForList(sql, userId);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

}
