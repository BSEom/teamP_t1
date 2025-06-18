import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Board.css";

const Board = () => {
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return Number(params.get("nowpage")) || 1;
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("title"); // title, writer, content

    useEffect(() => {
        fetchBoardList();
    }, [page]);

    const fetchBoardList = (keyword = "", type = "title") => {
        let url = `http://localhost:8050/api/board?page=${page}&recordSize=10`;
        if (keyword.trim()) {
            url += `&searchType=${type}&keyword=${encodeURIComponent(keyword)}`;
        }

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setBoardList(data.list);
                setPagination(data.pagination);
            })
            .catch((err) => console.error("게시글 불러오기 실패:", err));
    };

    const handleSearch = () => {
        setPage(1); // 검색 시 첫 페이지로 이동
        fetchBoardList(searchKeyword, searchType);
    };

    const handleSearchReset = () => {
        setSearchKeyword("");
        setSearchType("title");
        setPage(1);
        fetchBoardList(); // 전체 목록 다시 불러오기
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleGoWrite = () => {
        navigate("/write");
    };

    const handleGoView = (boardId) => {
        navigate(`/view?boardId=${boardId}`);
    };

    return (
        <div className="board-main-layout">
            <section className="board-section">
                <div className="board-header">
                        <h2 style={{ margin: 0 }}>게시판</h2>
                        <div className="board-search-box">
                            <select 
                                value={searchType} 
                                onChange={(e) => setSearchType(e.target.value)}
                                className="board-search-select"
                            >
                                <option value="title">제목</option>
                                <option value="writer">작성자</option>
                                <option value="content">내용</option>
                            </select>
                            <input
                                type="text"
                                placeholder="검색어를 입력하세요"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="board-search-input"
                            />
                            <button onClick={handleSearch} className="board-search-btn">
                                검색
                            </button>
                        </div>
                </div>
                
                <div className="board-table-wrapper">
                    <table className="board-table">
                        <thead>
                            <tr>
                                <th className="table-num">No</th>
                                <th className="table-title">제목</th>
                                <th className="table-name">작성자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boardList.length > 0 ? (
                                boardList.map((board) => (
                                    <tr key={board.BOARD_ID}>
                                        <td className="table-num">{board.BOARD_ID}</td>
                                        <td className="table-title">
                                            <a 
                                                href="#" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleGoView(board.BOARD_ID);
                                                }}
                                            >
                                                {board.TITLE}
                                            </a>
                                        </td>
                                        <td className="table-name">{board.WRITER}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                        게시글이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                    {pagination && (
                        <div className="pagination">
                            {pagination.existPrevPage && (
                                <button onClick={() => setPage(page - 1)} className="pagination-btn">이전</button>
                            )}
                            {[...Array(pagination.endPage - pagination.startPage + 1)].map((_, i) => {
                                const pageNum = pagination.startPage + i;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            {pagination.existNextPage && (
                                <button onClick={() => setPage(page + 1)} className="pagination-btn">다음</button>
                            )}
                        </div>
                    )}
                </div>

                <div className="board-footer">
                    <button onClick={handleSearchReset} className="btn btn-all">
                        전체
                    </button>
                    <button className="btn btn-outline-primary" onClick={handleGoWrite}>
                        글쓰기
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Board;