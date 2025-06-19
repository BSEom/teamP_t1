package com.example.project_backend.domain;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class PagingResponse<T> {

    // 현재 페이지에 보여줄 오라클 자료 : 10줄
    private List<T> list = new ArrayList<>();

    // 아래의 paging.jsp 에서 사용할 변수들
    private Pagination pagination;

    public PagingResponse(List<T> list, Pagination pagination) {
        this.list.addAll(list);
        this.pagination = pagination;
    }

}