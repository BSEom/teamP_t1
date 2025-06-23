import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./View.css";

const View = () => {
    const [searchParams] = useSearchParams();
    const boardId = searchParams.get("boardId");
    const nowpage = searchParams.get("nowpage") || 1;
    const navigate = useNavigate();
    const { username, userid } = useAuth();

    const [post, setPost] = useState({
        title: "",
        name: "",
        content: "",
        hit: "",
        bookmarked: false,
    });

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [updateCommentId, setUpdateCommentId] = useState(null);
    const [updateContent, setUpdateContent] = useState("");

    // 공통 함수: 댓글 목록 불러오기
    const fetchComments = async () => {
        const res = await fetch(`http://localhost:8050/api/board/comments/${boardId}`);
        const data = await res.json();
        setComments(data);
    };

    // 공통 함수: 북마크 상태 동기화
    const syncBookmarkStatus = async () => {
        const res = await fetch(`http://localhost:8050/api/board/bookmark/${boardId}?userName=${username}`);
        const raw = await res.json();

        const isBookmarked = (raw === true || raw === "true");
        setPost(prev => ({ ...prev, bookmarked: isBookmarked }));

        console.log("북마크 상태:", raw);
    };

    useEffect(() => {
        if (!boardId || !username) return;

        // 게시글 데이터 불러오기
        fetch(`http://localhost:8050/api/board/${boardId}`)
            .then(res => res.json())
            .then(data => {
                setPost(prev => ({
                    ...prev,
                    title: data.TITLE,
                    name: data.WRITER,
                    content: data.CONTENT,
                    hit: data.HIT,
                }));
            });

        syncBookmarkStatus();
        fetchComments();
    }, [boardId, username]);

    // 북마크 추가
    const addBookmark = async () => {
        const res = await fetch(`http://localhost:8050/api/board/bookmark/${boardId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userid }),
        });
        const resultText = (await res.text()).trim();

        if (resultText.includes("success")) {
            alert("북마크에 추가되었습니다.");
        } else if (resultText.includes("already bookmarked")) {
            alert("이미 북마크 되어 있습니다.");
        } else {
            alert("북마크 추가 실패: " + resultText);
        }
        await syncBookmarkStatus();
    };

    // 북마크 해제
    const removeBookmark = async () => {
        const res = await fetch(`http://localhost:8050/api/board/bookmark/${boardId}/${userid}`, {
            method: "PUT",
        });
        const resultText = (await res.text()).trim();

        if (resultText.includes("success")) {
            alert("북마크가 해제되었습니다.");
        } else {
            alert("북마크 해제 실패: " + resultText);
        }
        await syncBookmarkStatus();
    };

    // 북마크 토글
    // const toggleBookmark = async () => {
    //     if (post.bookmarked) {
    //         await removeBookmark();
    //     } else {
    //         await addBookmark();
    //     }
    // };
    const toggleBookmark = async () => {
        const wasBookmarked = post.bookmarked;

        // UI 먼저 업데이트
        setPost(prev => ({ ...prev, bookmarked: !wasBookmarked }));

        try {
            if (wasBookmarked) {
                // 기존에 북마크 되어 있었으면 해제
                const res = await fetch(`http://localhost:8050/api/board/bookmark/${boardId}/${userid}`, {
                    method: "PUT",
                });
                const result = (await res.text()).trim();
                console.log(result);
                alert("북마크가 해제되었습니다.");
            } else {
                // 북마크 추가
                const res = await fetch(`http://localhost:8050/api/board/bookmark/${boardId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: userid }),
                });
                const result = (await res.text()).trim();
                console.log(result);
                alert("북마크에 추가되었습니다.");
            }
        } catch (err) {
            alert("북마크 처리 중 오류 발생: " + err.message);
        }

        // 다시 서버 상태 동기화 (안전하게)
        await syncBookmarkStatus();
    };


    // 게시글 수정 버튼
    const handleUpdate = () => {
        if (post.name === username) {
            navigate(`/update?boardId=${boardId}&nowpage=${nowpage}`);
        } else {
            alert("작성자가 아닙니다.");
        }
    };

    // 게시글 삭제 버튼
    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        const res = await fetch(`http://localhost:8050/api/board/${boardId}`, {
            method: "DELETE",
        });

        const resultText = await res.text();

        if (post.name !== username) {
            alert("작성자가 아닙니다.");
        } else if (resultText.includes("comments_exist")) {
            alert("댓글이 존재하여 게시글을 삭제할 수 없습니다.");
        } else if (resultText.includes("success")) {
            alert("삭제되었습니다.");
            navigate(`/board?nowpage=${nowpage}`);
        } else {
            alert("삭제 실패: " + resultText);
        }
    };

    // 댓글 등록
    const handleCommentInsert = async () => {
        if (!comment.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        const res = await fetch(`http://localhost:8050/api/board/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ boardId, name: username, content: comment }),
        });

        if (res.ok) {
            alert("댓글이 등록되었습니다.");
            setComment("");
            await fetchComments();
        } else {
            alert("댓글 등록에 실패했습니다.");
        }
    };

    // 댓글 수정
    const handleCommentUpdate = async (commentId) => {
        const res = await fetch(`http://localhost:8050/api/board/comments/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: username, content: updateContent }),
        });

        const result = await res.text();
        if (result === "success") {
            alert("댓글이 수정되었습니다.");
            setUpdateCommentId(null);
            setUpdateContent("");
            await fetchComments();
        } else {
            alert("수정 실패: " + result);
        }
    };

    // 댓글 삭제
    const handleCommentDelete = async (commentId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        const res = await fetch(`http://localhost:8050/api/board/comments/${commentId}`, {
            method: "DELETE",
        });

        const result = await res.text();
        if (result === "success") {
            alert("댓글 삭제 완료");
            await fetchComments();
        } else {
            alert("삭제 실패: " + result);
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

                    <div className="form-group d-flex align-items-center">
                        <label>조회수</label>
                        <div className="form-control">{post.hit}</div>
                        <button
                            className="bookmark btn btn-link"
                            type="button"
                            onClick={toggleBookmark}
                            style={{ marginLeft: "10px", padding: 0, border: "none", background: "none" }}
                        >
                            {post.bookmarked ? (
                                <img src="/bookon.png" alt="북마크 해제" width={32} height={32} />
                            ) : (
                                <img src="/bookoff.png" alt="북마크 하기" width={32} height={32} />
                            )}
                        </button>
                    </div>

                    <div className="form-group">
                        <label>내용</label>
                        <div className="form-control container mt-4">{post.content}</div>
                    </div>

                    <div className="d-flex justify-content-between mb-4">
                        <div className="d-flex">
                            <button className="btn btn-smaller btn-primary" onClick={handleUpdate}>수정</button>
                            <button className="btn btn-smaller btn-primary" onClick={handleDelete}>삭제</button>
                        </div>
                        <button className="btn btn-smaller btn-outline-primary" onClick={() => navigate(`/board?nowpage=${nowpage}`)}>목록으로</button>
                    </div>

                    {/* 댓글 작성 */}
                    <div className="form-group">
                        <label>댓글 작성</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
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
                                <div className="comment-meta">
                                    <strong>{c.WRITER}</strong>
                                    <span className="comment-time">{c.COMMENT_TIME}</span>
                                </div>
                                {updateCommentId === c.COMMENT_ID ? (
                                    <>
                                        <textarea
                                            className="form-control mb-2"
                                            value={updateContent}
                                            onChange={(e) => setUpdateContent(e.target.value)}
                                        />
                                        <div className="comment-edit-box">
                                            <button className="btn btn-primary btn-smaller" onClick={() => handleCommentUpdate(c.COMMENT_ID)}>저장</button>
                                            <button className="btn btn-secondary btn-smaller" onClick={() => setUpdateCommentId(null)}>취소</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="content-box">{c.CONTENT}</div>
                                        <div className="content-button-box">
                                            <button className="comment-button" onClick={() => handleCommentDelete(c.COMMENT_ID)}>삭제</button>
                                            <button className="comment-button" onClick={() => {
                                                setUpdateCommentId(c.COMMENT_ID);
                                                setUpdateContent(c.CONTENT);
                                            }}>수정</button>
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
