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

    const fetchComments = async () => {
        if (!boardId) return;
        const res = await fetch(`/api/board/comments/${boardId}`);
        if (res.ok) {
            const data = await res.json();
            setComments(data);
        }
    };

    const syncBookmarkStatus = async () => {
        if (!username || !boardId) return;
        const res = await fetch(`/api/board/bookmark/${boardId}?userName=${username}`);
        if (res.ok) {
            const raw = await res.json();
            const isBookmarked = (raw === true || raw === "true");
            setPost(prev => ({ ...prev, bookmarked: isBookmarked }));
        }
    };

    useEffect(() => {
        if (!boardId) return;
        fetch(`/api/board/${boardId}`)
            .then(res => res.json())
            .then(data => {
                setPost(prev => ({
                    ...prev,
                    title: data.TITLE,
                    name: data.WRITER,
                    content: data.CONTENT,
                    hit: data.HIT,
                    boardDate: data.BOARD_TIME,
                }));
            });

        fetchComments();
        if (username) {
            syncBookmarkStatus();
        }
    }, [boardId, username]);

    const toggleBookmark = async () => {
        if (!userid || !boardId) {
            console.log(userid);
            console.log(username);
            alert("로그인이 필요합니다.");
            return;
        }
        const wasBookmarked = post.bookmarked;
        setPost(prev => ({ ...prev, bookmarked: !wasBookmarked }));

        try {
            if (wasBookmarked) {
                const res = await fetch(`/api/board/bookmark/${boardId}/${userid}`, {
                    method: "PUT",
                });
                alert("북마크가 해제되었습니다.");
            } else {
                const res = await fetch(`/api/board/bookmark/${boardId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: userid }),
                });
                alert("북마크에 추가되었습니다.");
            }
        } catch (err) {
            alert("북마크 처리 중 오류 발생: " + err.message);
        }
        await syncBookmarkStatus();
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

        const res = await fetch(`/api/board/${boardId}`, {
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

    const handleCommentInsert = async () => {
        if (!comment.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        const res = await fetch(`/api/board/comments`, {
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

    const handleCommentUpdate = async (commentId) => {
        const res = await fetch(`/api/board/comments/${commentId}`, {
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

    const handleCommentDelete = async (commentId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        const res = await fetch(`/api/board/comments/${commentId}`, {
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

    // return (
    //     <div className="view-container">
    //         <h1 className="text-center">게시글</h1>
    //         <div className="row mt-4">
    //             <div className="col-md-8 offset-md-2">
    //                 <div className="form-group"><label>제목</label><div className="form-control">{post.title}</div></div>
    //                 <div className="form-group"><label>작성자</label><div className="form-control">{post.name}</div></div>
    //                 <div className="form-group"><label>날짜</label><div className="form-control">{post.boardDate}</div></div>
    //                 <div className="form-group">
    //                     <label>조회수</label>
    //                     <div className="form-control hit">{post.hit}</div>
    //                     {username && (
    //                         <button className="bookmark btn btn-link" type="button" onClick={toggleBookmark} style={{ marginLeft: "10px", padding: 0, border: "none", background: "none" }}>
    //                             <img src={post.bookmarked ? "/bookon.png" : "/bookoff.png"} alt="북마크 상태" width={32} height={32} />
    //                         </button>
    //                     )}
    //                 </div>
    //                 <div className="form-group"><label>내용</label><div className="form-control container mt-4">{post.content}</div></div>

    //                 <div className="publish-area">
    //                     <button className="publish edit" onClick={handleUpdate}>수정</button>
    //                     <button className="publish delete" onClick={handleDelete}>삭제</button>
    //                     <button className="back-list" onClick={() => navigate(`/board?nowpage=${nowpage}`)}>목록으로</button>
    //                 </div>

    //                 {username ? (
    //                     <>
    //                         <div className="form-group">
    //                             <label>댓글 작성</label>
    //                             <textarea className="form-control" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="댓글을 입력하세요." />
    //                         </div>
    //                         <div className="text-right mb-4">
    //                             <button className="add_comment" onClick={handleCommentInsert}>댓글 등록</button>
    //                         </div>
    //                     </>
    //                 ) : (
    //                     <p className="text-muted">🤚로그인 후 댓글을 작성할 수 있습니다.</p>
    //                 )}

    //                 <div className="comments-section mt-4">
    //                     <h5>댓글 목록</h5>
    //                     {comments.map((c) => (
    //                         <div key={c.COMMENT_ID} className="comment-item mb-3">
    //                             <div className="comment-meta">
    //                                 <strong>{c.WRITER}</strong>
    //                                 <span className="comment-time">{c.COMMENT_TIME}</span>
    //                             </div>
    //                             {updateCommentId === c.COMMENT_ID ? (
    //                                 <>
    //                                     <textarea className="form-control mb-2" value={updateContent} onChange={(e) => setUpdateContent(e.target.value)} />
    //                                     <div className="comment-edit-box">
    //                                         <button className="btn btn-primary btn-smaller" onClick={() => handleCommentUpdate(c.COMMENT_ID)}>저장</button>
    //                                         <button className="btn btn-secondary btn-smaller" onClick={() => setUpdateCommentId(null)}>취소</button>
    //                                     </div>
    //                                 </>
    //                             ) : (
    //                                 <>
    //                                     <div className="content-box">{c.CONTENT}</div>
    //                                     {c.WRITER === username && (
    //                                         <div className="content-button-box">
    //                                             <button className="comment-button" onClick={() => handleCommentDelete(c.COMMENT_ID)}>삭제</button>
    //                                             <button className="comment-button" onClick={() => {
    //                                                 setUpdateCommentId(c.COMMENT_ID);
    //                                                 setUpdateContent(c.CONTENT);
    //                                             }}>수정</button>
    //                                         </div>
    //                                     )}
    //                                 </>
    //                             )}
    //                         </div>
    //                     ))}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
    return (
        <div className="view-container">
            <h1 className="text-center">게시글</h1>

            <div className="row mt-4">
                <div className="col-md-8 offset-md-2">
                    {/* 메타 정보 그룹 */}
                    <div className="meta-group">
                        {/* 제목 */}
                        <div className="meta-title-row">
                            <label>제목</label>
                            <div className="meta-title">{post.title}</div>
                        </div>

                        {/* 작성자, 날짜, 조회수 */}
                        <div className="meta-bottom-row">
                            <div className="meta-writer">
                                <label>작성자</label>
                                <div className="meta-writer-name">{post.name}</div>
                            </div>
                            <div className="meta-day">
                                <label>날짜</label>
                                <div className="meta-write-day">{post.boardDate}</div>
                            </div>
                            <div className="meta-hit">
                                <label>조회수</label>
                                <div className="meta-hit-count">{post.hit}</div>
                                {username && (
                                    <button className="bookmark" type="button" onClick={toggleBookmark}>
                                        <img src={post.bookmarked ? "/bookon.png" : "/bookoff.png"} alt="북마크 상태" width={32} height={32} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 내용 */}
                    <div className="form-group">
                        <label>내용</label>
                        <div className="form-control container mt-4">{post.content}</div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="publish-area">
                        <button className="publish edit" onClick={handleUpdate}>수정</button>
                        <button className="publish delete" onClick={handleDelete}>삭제</button>
                        <button className="back-list" onClick={() => navigate(`/board?nowpage=${nowpage}`)}>목록으로</button>
                    </div>

                    {/* 댓글 작성 */}
                    {username ? (
                        <>
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
                            <div className="add-comment-area mb-4">
                                <button className="add-comment" onClick={handleCommentInsert}>댓글 등록</button>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted">🤚로그인 후 댓글을 작성할 수 있습니다.</p>
                    )}

                    {/* 댓글 목록 */}
                    <div className="comments-section mt-4">
                        <h5 className="comment-list-title">댓글 목록</h5>
                        {comments.map((c) => (
                            <div key={c.COMMENT_ID} className="comment-item mb-3">
                                <div className="comment-meta">
                                    <div>{c.WRITER}</div>
                                    <div className="comment-time">{c.COMMENT_TIME}</div>
                                </div>

                                {updateCommentId === c.COMMENT_ID ? (
                                    <div style={{ flex: 1 }}>
                                        <textarea
                                            className="form-control mb-2"
                                            value={updateContent}
                                            onChange={(e) => setUpdateContent(e.target.value)}
                                        />
                                        <div className="comment-edit-box">
                                            <button className="btn btn-primary btn-smaller" onClick={() => handleCommentUpdate(c.COMMENT_ID)}>저장</button>
                                            <button className="btn btn-secondary btn-smaller" onClick={() => setUpdateCommentId(null)}>취소</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="content-box">{c.CONTENT}</div>
                                        {c.WRITER === username && (
                                            <div className="content-button-box">
                                                <button className="comment-button" onClick={() => handleCommentDelete(c.COMMENT_ID)}>삭제</button>
                                                <button className="comment-button" onClick={() => {
                                                    setUpdateCommentId(c.COMMENT_ID);
                                                    setUpdateContent(c.CONTENT);
                                                }}>수정</button>
                                            </div>
                                        )}
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
