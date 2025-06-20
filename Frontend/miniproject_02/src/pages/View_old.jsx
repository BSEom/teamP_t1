import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./View.css";

const View = () => {
    const [searchParams] = useSearchParams();
    const boardId = searchParams.get("boardId");
    const nowpage = searchParams.get("nowpage") || 1;
    const navigate = useNavigate();

    const [post, setPost] = useState({ title: "", name: "", content: "", hit: "" });
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [updateCommentId, setUpdateCommentId] = useState(null);
    const [updateContent, setUpdateContent] = useState("");

    useEffect(() => {
        if (!boardId) return;

        fetch(`http://localhost:8050/api/board/${boardId}`)
            .then(res => res.json())
            .then(data => {
                setPost({
                    title: data.TITLE,
                    name: data.WRITER,
                    content: data.CONTENT,
                    hit: data.HIT,
                });
            })
            .catch(err => {
                console.error(err);
                alert("게시글 불러오기 실패");
            });

        fetch(`http://localhost:8050/api/board/comments/${boardId}`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(console.error);
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

    const handleCommentChange = (e) => setComment(e.target.value);

    const handleCommentInsert = async () => {
        if (comment.trim() === "") {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8050/api/board/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ boardId, name: "홍길순", content: comment }),
            });

            if (res.ok) {
                alert("댓글이 등록되었습니다.");
                setComment("");
                fetch(`http://localhost:8050/api/board/comments/${boardId}`)
                    .then(res => res.json())
                    .then(data => setComments(data));
            } else {
                alert("댓글 등록에 실패했습니다.");
            }
        } catch (err) {
            alert("댓글 등록 중 오류 발생: " + err.message);
        }
    };

    const handleCommentUpdateClick = (commentId, currentContent) => {
        setUpdateCommentId(commentId);
        setUpdateContent(currentContent);
    };

    const handleCommentUpdate = async (commentId) => {
        try {
            const res = await fetch(`http://localhost:8050/api/board/comments/${commentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "홍길순", content: updateContent }),
            });

            const result = await res.text();
            if (result === "success") {
                alert("댓글이 수정되었습니다.");
                setUpdateCommentId(null);
                setUpdateContent("");
                fetch(`http://localhost:8050/api/board/comments/${boardId}`)
                    .then(res => res.json())
                    .then(data => setComments(data));
            } else {
                alert("수정 실패: " + result);
            }
        } catch (err) {
            alert("댓글 수정 중 오류 발생: " + err.message);
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`http://localhost:8050/api/board/comments/${commentId}`, {
                method: "DELETE",
            });

            const result = await res.text();
            if (result === "success") {
                alert("댓글 삭제 완료");
                fetch(`http://localhost:8050/api/board/comments/${boardId}`)
                    .then(res => res.json())
                    .then(data => setComments(data));
            } else {
                alert("삭제 실패: " + result);
            }
        } catch (err) {
            alert("댓글 삭제 중 오류 발생: " + err.message);
        }
    };

    return (
        <div className="view-container">
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
                        <label>조회수</label>
                        <div className="form-control">{post.hit}</div>
                    </div>

                    <div className="form-group">
                        <label>내용</label>
                        <div className="form-control container mt-4">
                            {post.content}
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mb-4">
                        <div className="d-flex">
                            <button className="btn btn-smaller btn-primary" onClick={handleUpdate}>수정</button>
                            <button className="btn btn-smaller btn-primary" onClick={handleDelete}>삭제</button>
                        </div>
                        <button className="btn btn-smaller btn-outline-primary" onClick={() => navigate(`/?nowpage=${nowpage}`)}>목록으로</button>
                    </div>
                    {/* 댓글 작성 */}
                    <div className="form-group">
                        <label>댓글 작성</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="댓글을 입력하세요."
                        />
                    </div>
                    <div className="text-right mb-4">
                        <button className="btn btn-smaller btn-success" onClick={handleCommentInsert}>댓글 등록</button>
                    </div>

                    {/* 댓글 목록 */}
                    <div className="comments-section mt-4">
                        <h5>댓글 목록</h5>
                        {comments.length === 0 && <p>등록된 댓글이 없습니다.</p>}
                        {comments.map((c) => (
                            <div key={c.COMMENT_ID} className="comment-item mb-3">
                                <strong>{c.WRITER}</strong>
                                <p>{c.COMMENT_TIME}</p>

                                {updateCommentId === c.COMMENT_ID ? (
                                    <>
                                        <textarea
                                            className="form-control mb-2"
                                            value={updateContent}
                                            onChange={(e) => setUpdateContent(e.target.value)}
                                        />
                                        <div className="d-flex">
                                            <button className="btn btn-primary btn-smaller" onClick={() => handleCommentUpdate(c.COMMENT_ID)}>저장</button>
                                            <button className="btn btn-secondary btn-smaller" onClick={() => setUpdateCommentId(null)}>취소</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p>{c.CONTENT}</p>
                                        <div className="d-flex">
                                            <button className="btn btn-success btn-smaller" onClick={() => handleCommentDelete(c.COMMENT_ID)}>삭제</button>
                                            <button className="btn btn-success btn-smaller" onClick={() => handleCommentUpdateClick(c.COMMENT_ID, c.CONTENT)}>수정</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View;
