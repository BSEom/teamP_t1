import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./View.css";
import Swal from "sweetalert2";

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
  const [replyContent, setReplyContent] = useState({});
  const [replyBoxOpen, setReplyBoxOpen] = useState({});

  const buildCommentTree = (flatComments) => {
    const map = {};
    const roots = [];
    flatComments.forEach(c => {
      c.children = [];
      map[c.COMMENT_ID] = c;
    });
    flatComments.forEach(c => {
      if (c.PARENT_COMMENT_ID) {
        const parent = map[c.PARENT_COMMENT_ID];
        if (parent) parent.children.push(c);
        else roots.push(c);
      } else {
        roots.push(c);
      }
    });
    return roots;
  };

  const fetchComments = async () => {
    if (!boardId) return;
    const res = await fetch(`/api/board/comments/${boardId}`);
    if (res.ok) {
      const data = await res.json();
      const tree = buildCommentTree(data);
      setComments(tree);
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
    if (username) syncBookmarkStatus();
  }, [boardId, username]);

  const toggleBookmark = async () => {
    if (!userid || !boardId) {
      // alert("로그인이 필요합니다.");
      Swal.fire({
        title: '알림',
        text: "로그인이 필요합니다.",
        icon: 'info',
        confirmButtonText: '확인'
      })
      return;
    }
    const wasBookmarked = post.bookmarked;
    setPost(prev => ({ ...prev, bookmarked: !wasBookmarked }));

    try {
      if (wasBookmarked) {
        await fetch(`/api/board/bookmark/${boardId}/${userid}`, { method: "PUT" });
        // alert("북마크가 해제되었습니다.");
        Swal.fire({
          title: '알림',
          text: "북마크가 해제되었습니다.",
          icon: 'info',
          confirmButtonText: '확인'
        })
      } else {
        await fetch(`/api/board/bookmark/${boardId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userid }),
        });
        // alert("북마크에 추가되었습니다.");
        Swal.fire({
          title: '알림',
          text: "북마크에 추가되었습니다.",
          icon: 'info',
          confirmButtonText: '확인'
        })
      }
    } catch (err) {
      alert("북마크 처리 중 오류 발생: " + err.message);
      Swal.fire({
        title: '알림',
        text: "북마크 처리 중 오류 발생: " + err.message,
        icon: 'info',
        confirmButtonText: '확인'
      })
    }
    await syncBookmarkStatus();
  };

  const handleUpdate = () => {
    if (post.name === username) {
      navigate(`/update?boardId=${boardId}&nowpage=${nowpage}`);
    } else {
      // alert("작성자가 아닙니다.");
      Swal.fire({
        title: '알림',
        text: "작성자가 아닙니다.",
        icon: 'info',
        confirmButtonText: '확인'
      })
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/board/${boardId}`, { method: "DELETE" });
    const resultText = await res.text();

    if (post.name !== username) {
      // alert("작성자가 아닙니다.");
      Swal.fire({
        title: '알림',
        text: "작성자가 아닙니다.",
        icon: 'info',
        confirmButtonText: '확인'
      })
    } else if (resultText.includes("comments_exist")) {
      // alert("댓글이 존재하여 게시글을 삭제할 수 없습니다.");
      Swal.fire({
        title: '알림',
        text: "댓글이 존재하여 게시글을 삭제할 수 없습니다.",
        icon: 'info',
        confirmButtonText: '확인'
      })
    } else if (resultText.includes("success")) {
      // alert("삭제되었습니다.");
      // navigate(`/board?nowpage=${nowpage}`);
      Swal.fire({
        title: '알림',
        text: "삭제되었습니다.",
        icon: 'info',
        confirmButtonText: '확인'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/board?nowpage=${nowpage}`);
        }
      });
    } else {
      // alert("삭제 실패: " + resultText);
      Swal.fire({
        title: '알림',
        text: "삭제 실패: " + resultText,
        icon: 'info',
        confirmButtonText: '확인'
      })
    }
  };

  const handleCommentInsert = async () => {
    if (!comment.trim()) {
      // alert("댓글 내용을 입력해주세요.");
      Swal.fire({
        title: '알림',
        text: "댓글 내용을 입력해주세요.",
        icon: 'info',
        confirmButtonText: '확인'
      })
      return;
    }
    const res = await fetch(`/api/board/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId, name: username, content: comment }),
    });

    if (res.ok) {
      // alert("댓글이 등록되었습니다.");
      Swal.fire({
        title: '알림',
        text: "댓글이 등록되었습니다.",
        icon: 'info',
        confirmButtonText: '확인'
      })
      
      setComment("");
      await fetchComments();
    } else {
      // alert("댓글 등록에 실패했습니다.");
      Swal.fire({
        title: '알림',
        text: "댓글 등록에 실패했습니다.",
        icon: 'info',
        confirmButtonText: '확인'
      })
    }
  };

  const handleReplyInsert = async (parentCommentId) => {
    const content = replyContent[parentCommentId];
    if (!content || !content.trim()) {
      // alert("답글 내용을 입력해주세요.");
      Swal.fire({
        title: '알림',
        text: "답글 내용을 입력해주세요.",
        icon: 'info',
        confirmButtonText: '확인'
      })
      return;
    }
    const res = await fetch(`/api/board/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId, name: username, content, parentCommentId }),
    });

    if (res.ok) {
      // alert("답글이 등록되었습니다.");
      Swal.fire({
        title: '알림',
        text: "답글이 등록되었습니다.",
        icon: 'info',
        confirmButtonText: '확인'
      })
      setReplyContent(prev => ({ ...prev, [parentCommentId]: "" }));
      setReplyBoxOpen(prev => ({ ...prev, [parentCommentId]: false }));
      await fetchComments();
    } else {
      // alert("답글 등록에 실패했습니다.");
      Swal.fire({
        title: '알림',
        text: "답글 등록에 실패했습니다.",
        icon: 'info',
        confirmButtonText: '확인'
      })
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
      // alert("댓글이 수정되었습니다.");
      Swal.fire({
        title: '알림',
        text: "댓글이 수정되었습니다.",
        icon: 'info',
        confirmButtonText: '확인'
      })
      setUpdateCommentId(null);
      setUpdateContent("");
      await fetchComments();
    } else {
      // alert("수정 실패: " + result);
      Swal.fire({
        title: '알림',
        text: "수정 실패: " + result,
        icon: 'info',
        confirmButtonText: '확인'
      })
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/board/comments/${commentId}`, { method: "DELETE" });
    const result = await res.text();
    if (result === "success") {
      // alert("댓글 삭제 완료");
      Swal.fire({
        title: '알림',
        text: "댓글 삭제 완료",
        icon: 'info',
        confirmButtonText: '확인'
      })
      await fetchComments();
    } else {
      // alert("삭제 실패: " + result);
      Swal.fire({
        title: '알림',
        text: "삭제 실패: " + result,
        icon: 'info',
        confirmButtonText: '확인'
      })
    }
  };

  const toggleReplyBox = (commentId) => {
    setReplyBoxOpen(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

const renderComments = (commentList, level = 0) => {
  return commentList.map(c => (
    <div
      key={c.COMMENT_ID}
      // className={`comment-item ${level > 0 ? "reply" : ""} ${level > 1 ? "reply-level2" : ""}`}
      // style={{ marginLeft: level * 12 }}
      // className={`comment-item level-${Math.min(level, 2)}`}
      className={`comment-item ${c.PARENT_COMMENT_ID ? "reply" : ""}`}
    >
      {/* 상단 작성자 + 시간 + 버튼 영역 */}
      <div className="comment-header">
        {/* <div className="comment-writer">{c.WRITER}</div> */}
        <div className="comment-writer">
          {c.PARENT_COMMENT_ID ? `⤷ ${c.WRITER}` : c.WRITER}
        </div>
        <div className="comment-time">{c.COMMENT_TIME}</div>
        <div className="comment-actions">
          {/* {username && (
            <button className="comment-button" onClick={() => toggleReplyBox(c.COMMENT_ID)}>
              {replyBoxOpen[c.COMMENT_ID] ? "답글 취소" : "답글"}
            </button>
          )} */}
          {username && !c.PARENT_COMMENT_ID && (
  <button className="comment-button" onClick={() => toggleReplyBox(c.COMMENT_ID)}>
    {replyBoxOpen[c.COMMENT_ID] ? "답글 취소" : "답글"}
  </button>
)}

          {c.WRITER === username && (
            <>
              <button className="comment-button" onClick={() => handleCommentDelete(c.COMMENT_ID)}>삭제</button>
              <button
                className="comment-button"
                onClick={() => {
                  setUpdateCommentId(c.COMMENT_ID);
                  setUpdateContent(c.CONTENT);
                }}
              >
                수정
              </button>
            </>
          )}
        </div>
      </div>

      {/* 댓글 내용 or 수정 중 textarea */}
      <div className="comment-content">
        {updateCommentId === c.COMMENT_ID ? (
          <>
            <textarea
              className="form-control mb-2"
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
            />
            <div className="comment-edit-box">
              <button className="comment-update" onClick={() => handleCommentUpdate(c.COMMENT_ID)}>저장</button>
              <button className="comment-update-cancel" onClick={() => setUpdateCommentId(null)}>취소</button>
            </div>
          </>
        ) : (
          c.CONTENT
        )}
      </div>

      {/* 답글 입력 영역 */}
      {replyBoxOpen[c.COMMENT_ID] && (
        <div style={{ marginTop: 8 }}>
          <textarea
            className="form-control mb-2"
            rows={3}
            value={replyContent[c.COMMENT_ID] || ""}
            onChange={(e) =>
              setReplyContent(prev => ({ ...prev, [c.COMMENT_ID]: e.target.value }))
            }
            placeholder="답글을 입력하세요."
          />
          <div className="comment-edit-box">
            <button className="comment-update" onClick={() => handleReplyInsert(c.COMMENT_ID)}>답글 등록</button>
          </div>
        </div>
      )}

      {/* 재귀호출 */}
      {c.children && c.children.length > 0 && renderComments(c.children, level + 1)}
      
    </div>
  ));
};


  return (
    <div className="view-container">
      <h1 className="text-center">게시글</h1>
      <div className="row mt-4">
        <div className="col-md-8 offset-md-2">
          <div className="meta-group">
            <div className="meta-title-row">
              <label>제목</label>
              <div className="meta-title">{post.title}</div>
            </div>
            <div className="meta-bottom-row">
              <div className="meta-writer">
                <label>작성자</label>
                <div className="meta-writer-name">{post.name}</div>
              </div>
              <div className="meta-day">
                <label>작성일</label>
                <div className="meta-write-day">{post.boardDate}</div>
              </div>
              <div className="meta-hit">
                <label>조회수</label>
                <div className="meta-hit-count">{post.hit}</div>
                {username && (
                  <button className="bookmark" onClick={toggleBookmark}>
                    <img
                      src={post.bookmarked ? "/bookon.png" : "/bookoff.png"}
                      alt="북마크 상태"
                      width={32}
                      height={32}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>내용</label>
            <div className="form-control container mt-4">{post.content}</div>
          </div>

          <div className="publish-area">
            <button className="publish edit" onClick={handleUpdate}>수정</button>
            <button className="publish delete" onClick={handleDelete}>삭제</button>
            <button className="back-list" onClick={() => navigate(`/board?nowpage=${nowpage}`)}>목록으로</button>
          </div>

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

          <div className="comments-section mt-4">
            <h5 className="comment-list-title">댓글 목록</h5>
            {renderComments(comments)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
