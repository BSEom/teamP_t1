package com.example.project_backend.dto;

public class ResultGenericDto<T> {
    private boolean success;
    private T data;
    private String message;

    public ResultGenericDto(boolean success, T data) {
        this.success = success;
        this.data = data;
    }

    public ResultGenericDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
