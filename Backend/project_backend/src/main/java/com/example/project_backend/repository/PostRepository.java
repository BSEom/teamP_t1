package com.example.project_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.project_backend.domain.Post;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByPostId(Long postId);
}
