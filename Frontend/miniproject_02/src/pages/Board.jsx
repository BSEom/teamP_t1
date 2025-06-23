import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Board.css";

const Board = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [boardList, setBoardList] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [page, setPage] = useState(() => {
        const params = new URLSearchParams(location.search);
        return Number(params.get("nowpage")) || 1;
    });

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("title"); // title, writer, content

    useEffect(() => {
        navigate(`?nowpage=${page}`, { replace: true });
    }, [page, navigate]);

    useEffect(() => {
        fetch(`http://localhost:8050/api/board?page=${page}&recordSize=10`)
            .then((res) => res.json())
            .then((data) => {
                setBoardList(data.list);
                setPagination(data.pagination);
            })
            .catch((err) => console.error("게시글 불러오기 실패:", err));
    }, [page]);

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

    const handleGoView = async (boardId) => {
        try {
            await fetch(`http://localhost:8050/api/board/hit/${boardId}`, {
                method: "PUT",
            });
        } catch (err) {
            console.error("조회수 증가 실패:", err);
        }

        navigate(`/view?boardId=${boardId}&nowpage=${page}`);
    };

    return (
        <div className="board-main-layout">
            <div className="board-section">
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

                    <button className="btn btn-outline-primary" onClick={handleGoWrite}>
                        글 작성
                    </button>
                </div>

                <div className="board-table-wrapper">
                    <table className="board-table">
                        <thead>
                            <tr>
                                <th className="table-num">No</th>
                                <th className="table-name">작성자</th>
                                <th className="table-title">제목</th>

                            </tr>
                        </thead>
                        <tbody>
                            {boardList.map((board) => (
                                <tr key={board.BOARD_ID}>
                                    <td>{board.BOARD_ID}</td>
                                    <td>{board.WRITER}</td>
                                    <td className="table-title">
                                        <a onClick={() => handleGoView(board.BOARD_ID)} style={{ cursor: "pointer" }}>
                                            {board.TITLE}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pagination && (
                    <div className="pagination">
                        {pagination.existPrevPage && (
                            <button className="pagination-btn" onClick={() => setPage(page - 1)}>이전</button>
                        )}
                        {[...Array(pagination.endPage - pagination.startPage + 1)].map((_, i) => {
                            const pageNum = pagination.startPage + i;
                            return (
                                <button
                                    key={pageNum}
                                    className={`pagination-btn ${page === pageNum ? "active" : ""}`}
                                    onClick={() => setPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {pagination.existNextPage && (
                            <button className="pagination-btn" onClick={() => setPage(page + 1)}>다음</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Board;
