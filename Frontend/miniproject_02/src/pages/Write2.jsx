// import React from "react";

// const Write = () => {
//     return (
//         <>
//             <h1>글쓰기 입니다.</h1>
//         </>
//     )
// }

// export default Write

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Write.css";

const Write = () => {
    const navigate = useNavigate();

    const handleGoWrite = () => {
        navigate("/");
    };



    return (
        <div className="container mt-5">
            <h1 className="text-center">자유게시판 글쓰기</h1>

            <div className="row mt-4">
                <div className="col-md-8 offset-md-2">
                    <form action="/" method="post">
                        <input type="hidden" name="user_id" value="${user_id}" />
                        {/* <input type="hidden" name="nowpage" value="${nowpage}" /> */}

                        <div className="form-group">
                            <label htmlFor="title">제목</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">작성자</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="content">내용</label>
                            <textarea
                                className="form-control"
                                id="content"
                                name="content"
                                rows="15"
                                wrap="soft"
                                style={{ resize: "none" }}
                                required
                            ></textarea>
                        </div>

                        <div style={{ textAlign: "center" }}>
                            {/* <button type="submit" className="btn btn-primary">글 작성</button>
                            <a
                                href={`/BoardPaging/FreeList?comu_id=COMU02&nowpage=${nowpage}`}
                                className="btn btn-primary"
                            >
                                목록으로
                            </a> */}
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Write;
