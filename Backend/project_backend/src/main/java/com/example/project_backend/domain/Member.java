package com.example.project_backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq_gen")
    @SequenceGenerator(name = "member_seq_gen", sequenceName = "member_seq", allocationSize = 1)
    @Column(name = "user_id")
    private Long id;

    // @Column(nullable = false, unique = true)
    @Column(name = "user_name", nullable = false, unique = true)
    private String username;

    // @Column(nullable = false)
    @Column(name = "user_passwd", nullable = false)
    private String password;

    @Column(name = "user_address", nullable = false)
    private String address;

    @Column(name = "user_phone", nullable = false)
    private String phonenumber;

    @Column(name = "user_email", nullable = false, unique = true)
    private String email;

    protected Member() {
    }

    public Member(Long id, String username, String password, String address,
            String phonenumber, String email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.address = address;
        this.phonenumber = phonenumber;
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
