package com.example.project_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.project_backend.domain.Post;
import com.example.project_backend.dto.CreatePostDto;
import com.example.project_backend.dto.PostResponseDto;
import com.example.project_backend.dto.ResultDto;
import com.example.project_backend.dto.ResultGenericDto;
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

    public ResultGenericDto<List<Post>> findPost(Long post_id) {
        List<Post> post = postRepository.findByPostId(post_id);
        if (post.isEmpty()) {
            return new ResultGenericDto<>(false, "게시글을 찾을 수 없습니다.");
        }
        System.out.println(post);
        return new ResultGenericDto<>(true, post);
    }

    public ResultDto deletePost(Long post_id) {

        if (!postRepository.existsById(post_id)) {
            return new ResultDto(false, "삭제할 게시글을 찾을 수 없습니다.");
        }
        postRepository.deleteById(post_id);

        return new ResultDto(true, "게시글 삭제 성공");

    }
}
