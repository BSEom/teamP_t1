package com.example.project_backend.domain;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class Pagination {

    private int totalRecordCount; // 검색된 전체 데이터 수 : menu_id 에 해당하는 + 검색된
    private int totalPageCount; // 전체 페이지 수
    private int startPage; // 첫 페이지 번호
    private int endPage; // 끝 페이지 번호
    private int limitStart; // LIMIT 시작 위치
    private boolean existPrevPage; // 이전 페이지 존재 여부
    private boolean existNextPage; // 다음 페이지 존재 여부

    public Pagination(int totalRecordCount, SearchVo searchVo) {
        if (totalRecordCount > 0) {
            this.totalRecordCount = totalRecordCount;
            calculation(searchVo);
        }
    }

    private void calculation(SearchVo searchVo) {

        // 전체 페이지 수 계산
        totalPageCount = ((totalRecordCount - 1) / searchVo.getRecordSize()) + 1;

        // 현재 페이지 번호가 전체 페이지 수보다 큰 경우, 현재 페이지 번호에 전체 페이지 수 저장
        if (searchVo.getPage() > totalPageCount) {
            searchVo.setPage(totalPageCount);
        }

        // 첫 페이지 번호 계산
        startPage = ((searchVo.getPage() - 1) / searchVo.getPageSize()) * searchVo.getPageSize() + 1;

        // 끝 페이지 번호 계산
        endPage = startPage + searchVo.getPageSize() - 1;

        // 끝 페이지가 전체 페이지 수보다 큰 경우, 끝 페이지 전체 페이지 수 저장
        if (endPage > totalPageCount) {
            endPage = totalPageCount;
        }

        // LIMIT 시작 위치 계산
        limitStart = (searchVo.getPage() - 1) * searchVo.getRecordSize();

        // 이전 페이지 존재 여부 확인
        existPrevPage = startPage != 1;

        // 다음 페이지 존재 여부 확인
        existNextPage = (endPage * searchVo.getRecordSize()) < totalRecordCount;
    }

}
