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

    // @GetMapping("/board")
    // public List<Map<String, Object>> getBoardList() {

    // String sql = "SELECT b.BOARD_ID, u.USER_NAME AS WRITER, b.TITLE FROM
    // USER_BOARD b JOIN USERS u ON b.USER_ID = u.USER_ID ORDER BY b.BOARD_ID DESC";
    // return jdbcTemplate.queryForList(sql);
    // }
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
        System.out.println("-------------sql:" + sql);
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
        String sql = "SELECT b.BOARD_ID, b.TITLE, u.USER_NAME AS WRITER, b.CONTENT " +
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
            String updateSql = "UPDATE USER_BOARD SET USER_ID = ?, TITLE = ?, CONTENT = ? WHERE BOARD_ID = ?";
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
            String checkSql = "SELECT COUNT(*) FROM USER_BOARD WHERE BOARD_ID = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, boardId);
            if (count == null || count == 0) {
                return "fail: board not found";
            }

            String deleteSql = "DELETE FROM USER_BOARD WHERE BOARD_ID = ?";
            int result = jdbcTemplate.update(deleteSql, boardId);

            if (result > 0) {
                return "success";
            } else {
                return "fail: delete failed";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "fail: " + e.getMessage();
        }
    }

}
