package com.example.project_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.project_backend.domain.Post;
import com.example.project_backend.dto.CreatePostDto;
import com.example.project_backend.dto.PostResponseDto;
import com.example.project_backend.dto.ResultDto;
import com.example.project_backend.repository.PostRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public ResultDto createpost(CreatePostDto dto) {

        Post post = new Post(null, dto.getUserId(), dto.getTitle(), dto.getContent());

        try {
            postRepository.save(post);
        } catch (Exception e) {
            return new ResultDto(false, "게시글 작성 실패");
        }

        return new ResultDto(true, "게시글 작성 성공");
    }

    public List<PostResponseDto> findAllPost() {
        return postRepository.findAll()
                .stream()
                .map(post -> new PostResponseDto(post))
                .collect(Collectors.toList());
    }
}
