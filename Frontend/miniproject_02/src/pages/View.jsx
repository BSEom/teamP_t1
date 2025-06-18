import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./View.css";

const View = () => {
    const [searchParams] = useSearchParams();
    const boardId = searchParams.get("boardId");
    const nowpage = searchParams.get("nowpage") || 1;
    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: "",
        name: "",
        content: "",
    });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:8050/api/board/${boardId}`);
    //             const data = await response.json();
    //             console.log("받은 데이터:", data);
    //             setPost({
    //                 title: data.TITLE,
    //                 name: data.WRITER,
    //                 content: data.CONTENT,
    //             });
    //         } catch (err) {
    //             console.error("게시글 불러오기 실패:", err);
    //             alert("게시글 정보를 불러오는 데 실패했습니다.");
    //         }
    //     };

    //     fetchData();
    //     if (boardId) fetchData();
    // }, [boardId]);
    useEffect(() => {
        if (boardId) {
            fetch(`http://localhost:8050/api/board/${boardId}`)
                .then(res => res.json())
                .then(data => {
                    console.log("받은 데이터:", data);
                    setPost({
                        title: data.TITLE,
                        name: data.WRITER,
                        content: data.CONTENT,
                    });
                    console.log("post state 변경 후:", {
                        title: data.TITLE,
                        name: data.WRITER,
                        content: data.CONTENT,
                    });
                })
                .catch(err => {
                    console.error(err);
                    alert("게시글 불러오기 실패");
                });
        }
    }, [boardId]);


    const handleUpdate = () => {
        navigate(`/update?boardId=${boardId}&nowpage=${nowpage}`);
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`http://localhost:8050/api/board/${boardId}`, {
                method: "DELETE",
            });

            const result = await res.text();
            if (result === "success") {
                alert("삭제 완료");
                navigate("/?nowpage=" + nowpage);
            } else {
                alert("삭제 실패: " + result);
            }
        } catch (err) {
            alert("삭제 중 오류 발생: " + err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">게시글 보기</h1>

            <div className="row mt-4">
                <div className="col-md-8 offset-md-2">
                    <div className="form-group">
                        <label>제목</label>
                        <div className="form-control">{post.title}</div>
                    </div>

                    <div className="form-group">
                        <label>작성자</label>
                        <div className="form-control">{post.name}</div>
                    </div>

                    <div className="form-group">
                        <label>내용</label>
                        <div className="form-control" style={{ height: "240px", overflowY: "auto" }}>
                            {post.content}
                        </div>
                    </div>

                    <div className="d-flex justify-content-between">
                        <div>
                            <button className="btn btn-primary" onClick={handleUpdate}>수정</button>
                            <button className="btn btn-primary ml-2" onClick={handleDelete}>삭제</button>
                        </div>
                        <button className="btn btn-outline-primary btn-smaller" onClick={() => navigate(`/?nowpage=${nowpage}`)}>목록으로</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View;
