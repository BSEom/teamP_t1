package com.example.project_backend.dto;

import com.example.project_backend.domain.Post;

public class PostResponseDto {
    private Long postId;
    private Long userId; // 추후 진짜 ID(string)로 수정
    private String title;
    private String content;

    public PostResponseDto(Post post) {
        this.postId = post.getPost_id();
        this.userId = post.getUser_id();
        this.title = post.getTitle();
        this.content = post.getContent();
    }

    public Long getPostId() {
        return postId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

}
