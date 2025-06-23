import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./View.css";

const View = () => {
    const [searchParams] = useSearchParams();
    const boardId = searchParams.get("boardId");
    const nowpage = searchParams.get("nowpage") || 1;
    const navigate = useNavigate();
    const { isLoggedIn, username, userid } = useAuth();

    // post 상태에 bookmarked 추가 (boolean)
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

    useEffect(() => {
        if (!boardId) return;

        fetch(`http://localhost:8050/api/board/${boardId}`)
            .then((res) => res.json())
            .then((data) => {
                setPost({
                    title: data.TITLE,
                    name: data.WRITER,
                    content: data.CONTENT,
                    hit: data.HIT,
                    bookmarked: data.BOOKMARKED === 1 || data.BOOKMARKED === true,
                });
            })
            .catch((err) => {
                console.error(err);
                alert("게시글 불러오기 실패");
            });

        // 댓글 데이터 받아오기
        fetch(`http://localhost:8050/api/board/comments/${boardId}`)
            .then((res) => res.json())
            .then((data) => setComments(data))
            .catch(console.error);
    }, [boardId]);

    // 북마크 토글 함수
    // const toggleBookmark = async () => {
    //     try {
    //         const newBookmarkStatus = !post.bookmarked;
    //         const userName = "홍길순"; // ************로그인 연동필요

    //         let url = `http://localhost:8050/api/board/bookmark/${boardId}`;
    //         let options = {
    //             method: newBookmarkStatus ? "POST" : "PUT",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ userId: userName }), // userId 라는 이름에 사용자 이름을 넣음
    //         };

    //         if (!newBookmarkStatus) {
    //             const findUserId = 2; // ************로그인 연동필요
    //             url = `http://localhost:8050/api/board/bookmark/${boardId}/${findUserId}`;
    //             delete options.body;
    //         }

    //         const res = await fetch(url, options);

    //         if (res.ok) {
    //             const resultText = await res.text();

    //             if (resultText.includes("bookmarked")) {
    //                 alert("북마크에 추가되었습니다.");
    //                 setPost((prev) => ({ ...prev, bookmarked: true }));
    //             } else if (resultText.includes("unbookmarked")) {
    //                 alert("북마크가 해제되었습니다.");
    //                 setPost((prev) => ({ ...prev, bookmarked: false }));
    //             } else {
    //                 const stateRes = await fetch(`http://localhost:8050/api/board/${boardId}`);
    //                 const data = await stateRes.json();
    //                 setPost((prev) => ({
    //                     ...prev,
    //                     bookmarked: data.BOOKMARKED === 1 || data.BOOKMARKED === true,
    //                 }));
    //             }
    //         } else {
    //             alert("북마크 처리 실패");
    //         }
    //     } catch (err) {
    //         alert("북마크 처리 중 오류 발생: " + err.message);
    //     }
    // };

    const toggleBookmark = async () => {
        try {
            const isCurrentlyBookmarked = post.bookmarked;
            const userName = username; // ************************로그인 연동 필요
            let url, options;

            if (isCurrentlyBookmarked) {
                const findUserId = userid;
                url = `http://localhost:8050/api/board/bookmark/${boardId}/${findUserId}`;
                options = { method: "PUT" };
            } else {
                url = `http://localhost:8050/api/board/bookmark/${boardId}`;
                options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: userName })
                };
            }

            const res = await fetch(url, options);
            const resultText = (await res.text()).trim();
            console.log("서버 응답:", resultText);

            if (resultText === "success: bookmarked" || resultText === "fail: already bookmarked") {
                alert("북마크에 추가되었습니다.");
                setPost((prev) => ({ ...prev, bookmarked: true }));
            } else if (resultText === "success: unbookmarked") {
                alert("북마크가 해제되었습니다.");
                setPost((prev) => ({ ...prev, bookmarked: false }));
            } else {
                alert("북마크 처리 결과: " + resultText);
                // fallback
                const stateRes = await fetch(`http://localhost:8050/api/board/${boardId}`);
                const data = await stateRes.json();
                setPost((prev) => ({
                    ...prev,
                    bookmarked: data.BOOKMARKED === 1 || data.BOOKMARKED === true,
                }));
            }
        } catch (err) {
            alert("북마크 처리 중 오류 발생: " + err.message);
        }
    };






    const handleUpdate = () => {
        if (post.name === username) {
            navigate(`/update?boardId=${boardId}&nowpage=${nowpage}`);
        } else {
            alert("작성자가 아닙니다.");
        }
    };

    const handleDelete = async () => {

        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        const response = await fetch(`http://localhost:8050/api/board/${boardId}`, {
            method: "DELETE",
        });

        const resultText = await response.text();

        if (post.name !== username) {
            alert("작성자가 아닙니다.")
        } else if (resultText.includes("comments_exist")) {
            alert("댓글이 존재하여 게시글을 삭제할 수 없습니다.");
        } else if (resultText.includes("success")) {
            alert("삭제되었습니다.");
            navigate("/board?nowpage=" + nowpage);
        } else {
            alert("삭제 실패: " + resultText);
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
                body: JSON.stringify({ boardId, name: username, content: comment }),
            });

            if (res.ok) {
                alert("댓글이 등록되었습니다.");
                setComment("");
                fetch(`http://localhost:8050/api/board/comments/${boardId}`)
                    .then((res) => res.json())
                    .then((data) => setComments(data));
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
            const res = await fetch(
                `http://localhost:8050/api/board/comments/${commentId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: username, content: updateContent }),
                }
            );

            const result = await res.text();
            if (result === "success") {
                alert("댓글이 수정되었습니다.");
                setUpdateCommentId(null);
                setUpdateContent("");
                fetch(`http://localhost:8050/api/board/comments/${boardId}`)
                    .then((res) => res.json())
                    .then((data) => setComments(data));
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
            const res = await fetch(
                `http://localhost:8050/api/board/comments/${commentId}`,
                {
                    method: "DELETE",
                }
            );

            const result = await res.text();
            if (result === "success") {
                alert("댓글 삭제 완료");
                fetch(`http://localhost:8050/api/board/comments/${boardId}`)
                    .then((res) => res.json())
                    .then((data) => setComments(data));
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

                    <div className="publish-area">
                            <button className="publish edit" onClick={handleUpdate}>
                                수정
                            </button>
                            <button className="publish delete" onClick={handleDelete}>
                                삭제
                            </button>
                        <button className="btn btn-smaller btn-outline-primary" onClick={() => navigate(`/board?nowpage=${nowpage}`)}>
                            목록으로
                        </button>
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
                        <button className="add_comment" onClick={handleCommentInsert}>
                            댓글 등록
                        </button>
                    </div>

                    {/* 댓글 목록 */}
                    <div className="comments-section mt-4">
                        <h5>댓글 목록</h5>
                        {comments.length === 0 && <p>등록된 댓글이 없습니다.</p>}
                        {comments.map((c) => (
                            <div key={c.COMMENT_ID} className="comment-item mb-3">
                            <div className = "comment-meta">
                                <strong>{c.WRITER}</strong>
                                <span className ="comment-time">{c.COMMENT_TIME}</span>
                            </div>

                                {updateCommentId === c.COMMENT_ID ? (
                                    <>
                                        <textarea
                                            className="form-control mb-2"
                                            value={updateContent}
                                            onChange={(e) => setUpdateContent(e.target.value)}
                                        />
                                        <div className="comment-edit-box">
                                            <button
                                                className="btn btn-primary btn-smaller"
                                                onClick={() => handleCommentUpdate(c.COMMENT_ID)}
                                            >
                                                저장
                                            </button>
                                            <button className="btn btn-secondary btn-smaller" onClick={() => setUpdateCommentId(null)}>
                                                취소
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="content-box">{c.CONTENT}</div>
                                        <div className="content-button-box">
                                            <button className="comment-button" onClick={() => handleCommentDelete(c.COMMENT_ID)}>
                                                삭제
                                            </button>
                                            <button
                                                className="comment-button"
                                                onClick={() => handleCommentUpdateClick(c.COMMENT_ID, c.CONTENT)}
                                            >
                                                수정
                                            </button>
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
