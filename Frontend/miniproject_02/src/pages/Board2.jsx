import React from "react";
import { useNavigate } from "react-router-dom";
import "./Board.css";


const Board = () => {
    const navigate = useNavigate();
    // 예시 데이터
    const boardList = [
        { board_id: 1, writer: "홍길동", title: "첫 번째 글입니다." },
        { board_id: 2, writer: "이몽룡", title: "두 번째 글입니다." },
    ];


    // 글쓰기 버튼
    const handleGoWrite = () => {
        navigate("/write");
    };


    return (
        <main className="main-layout">
            <aside>
                <nav>
                    <div className="list-group">
                        <a
                            href="/"
                            className="list-group-item list-group-item-action"
                        >
                            지역별 가격비교
                        </a>
                        <a
                            href="/"
                            className="list-group-item list-group-item-action"
                        >
                            최저/최고가
                        </a>
                    </div>
                </nav>
            </aside>

            <section>
                <article>
                    <h2>게시판</h2>
                    <hr />
                    <div className="info-box">
                        <table className="write-table">
                            <thead>
                                <tr>
                                    <td className="table-num">no.</td>
                                    <td className="table-name">글쓴이</td>
                                    <td className="table-title">제목</td>
                                </tr>
                            </thead>
                            <tbody>
                                {boardList.map((board) => (
                                    <tr key={board.board_id}>
                                        <td className="table-num">{board.board_id}</td>
                                        <td className="table-name">{board.writer}</td>
                                        <td className="table-title">
                                            <a href={`/BoardPaging/RView?rno=${board.board_id}&nowpage=1`}>
                                                {board.title}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                        <div className="button-container">
                            <input
                                type="button"
                                className="btn btn-outline-primary"
                                value="글 작성"
                                id="goWrite"
                                onClick={handleGoWrite}
                            />
                        </div>
                    </div>
                </article>
            </section>
        </main>
    );
};

export default Board;
