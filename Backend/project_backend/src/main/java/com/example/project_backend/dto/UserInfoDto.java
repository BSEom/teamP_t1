package com.example.project_backend.dto;

public class UserInfoDto {

    private Long id;
    private String username;
    private String address;
    private String phonenumber;
    private String email;

    public UserInfoDto(Long id, String username, String address, String phonenumber, String email) {
        this.id = id;
        this.username = username;
        this.address = address;
        this.phonenumber = phonenumber;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getAddress() {
        return address;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public String getEmail() {
        return email;
    }

}
