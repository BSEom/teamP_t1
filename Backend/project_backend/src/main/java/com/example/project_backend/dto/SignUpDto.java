package com.example.project_backend.dto;

import jakarta.validation.constraints.Email;

public class SignUpDto {

    private String username;
    private String password;
    private String address;
    private String phonenumber;

    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    public SignUpDto(String username, String password, String address, String phonenumber, String email) {
        this.username = username;
        this.password = password;
        this.address = address;
        this.phonenumber = phonenumber;
        this.email = email;
    }

    public String getUsername() {
        return username;
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
