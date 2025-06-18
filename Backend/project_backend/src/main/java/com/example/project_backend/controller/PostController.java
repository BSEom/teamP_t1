package com.example.project_backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.project_backend.domain.Post;
import com.example.project_backend.dto.CreatePostDto;
import com.example.project_backend.dto.PostResponseDto;
import com.example.project_backend.dto.ResultDto;
import com.example.project_backend.dto.ResultGenericDto;
import com.example.project_backend.service.PostService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping // 게시글 로드
    public ResponseEntity<List<PostResponseDto>> getAllPost() {

        List<PostResponseDto> posts = postService.findAllPost();

        return ResponseEntity.ok(posts);
    }

    @PostMapping // 게시글 등록
    public ResponseEntity<String> createPost(@RequestBody CreatePostDto dto) {

        ResultDto result = postService.createpost(dto);

        if (result.isSuccess()) {
            return ResponseEntity.ok(result.getMessage());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getMessage());
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPost(@PathVariable Long id) {

        ResultGenericDto<List<Post>> result = postService.findPost(id);
        if (result.isSuccess()) {
            return ResponseEntity.ok(result.getData());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        ResultDto result = postService.deletePost(id);

        if (result.isSuccess()) {
            return ResponseEntity.ok(result.getMessage());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getMessage());
        }
    }

}
