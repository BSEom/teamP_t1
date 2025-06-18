package com.example.project_backend.dto;

public class LoginDto {
    private String username;
    private String password;
    private String address;
    private String phonenumber;

    public LoginDto(String username, String password, String address, String phonenumber) {
        this.username = username;
        this.password = password;
        this.address = address;
        this.phonenumber = phonenumber;
    }

    // public LoginDto(String username, String password) {
    // this.username = username;
    // this.password = password;
    // }

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

}
