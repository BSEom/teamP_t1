package com.example.project_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.project_backend.domain.Member;
import com.example.project_backend.dto.LoginDto;
import com.example.project_backend.dto.ResultDto;
import com.example.project_backend.dto.SignUpDto;
import com.example.project_backend.repository.MemberRepository;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public boolean login(LoginDto dto) {
        return memberRepository.findByUsername(dto.getUsername())
                .map(member -> member.getPassword().equals(dto.getPassword()))
                .orElse(false);
    }

    public ResultDto signup(SignUpDto dto) {

        Member member = new Member(null, dto.getUsername(), dto.getPassword(), dto.getAddress(), dto.getPhonenumber(),
                dto.getEmail());

        try {
            memberRepository.save(member);
        } catch (Exception e) {
            return new ResultDto(false, "회원가입 실패");
        }

        return new ResultDto(true, "회원가입 성공");
    }

    public boolean nameck(String name) {
        System.out.println(name + name.length());
        return memberRepository.findByUsername(name).isPresent();
    }

    public boolean emailck(String email) {
        return memberRepository.findByEmail(email).isPresent();
    }
}
