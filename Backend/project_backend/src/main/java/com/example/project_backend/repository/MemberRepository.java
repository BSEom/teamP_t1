package com.example.project_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.project_backend.domain.Member;
import com.example.project_backend.dto.UserInfoDto;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByUsername(String username);

    Optional<Member> findByEmail(String Email);

    @Query("SELECT new com.example.project_backend.dto.UserInfoDto(m.id, m.username, m.address, m.phonenumber, m.email) FROM Member m WHERE m.username = :username")
    Optional<UserInfoDto> findInfoByUsername(@Param("username") String username);

}
