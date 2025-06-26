import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./Mypage.css";

function Mypage() {
    const [selectedMenu, setSelectedMenu] = useState('info');
    const [activeTab, setActiveTab] = useState('posts');
    const [userInfo, setUserInfo] = useState(null);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [BoardPosts, setBoardPosts] = useState([]);
    const [CommentPosts, setCommentPosts] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/user/me", {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setUserInfo(data);
            } else {
                console.warn("로그인 정보 없음");
            }
        };

        fetchUser();
    }, []);

    // useEffect(() => {
    //     if (userInfo?.id) {
    //         // fetch(`http://localhost:8050/api/board/bookmarked?userId=${userInfo.id}`)

    //             .then(res => res.json())
    //             .then(data => setBookmarkedPosts(data))
    //             .catch(err => console.error("북마크 목록 가져오기 실패", err));
    //         console.log("-------------------", data);
    //         setBookmarkedPosts(data);
    //     }
    // }, [userInfo]);

    useEffect(() => {
        if (userInfo?.username) {
            fetch(`/api/board/mypage/bookmarks?userName=${userInfo.username}`)
                .then(res => res.json())
                .then(data => {
                    console.log("북마크 목록 데이터:", data);
                    setBookmarkedPosts(data);
                })
                .catch(err => console.error("북마크 목록 가져오기 실패", err));
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo?.username) {
            fetch(`/api/board/mypage/board?userName=${userInfo.username}`)
                .then(res => res.json())
                .then(data => {
                    console.log("게시글 목록 데이터:", data);
                    setBoardPosts(data);
                })
                .catch(err => console.error("게시글 목록 가져오기 실패", err));
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo?.username) {
            fetch(`/api/board/comments/mypage?userName=${userInfo.username}`)
                .then(res => res.json())
                .then(data => {
                    console.log("댓글 목록 데이터:", data);
                    setCommentPosts(data);
                })
                .catch(err => console.error("게시글 목록 가져오기 실패", err));
        }
    }, [userInfo]);



    const renderTabContent = () => {
        if (activeTab === 'posts') {
            return (
                <>
                    {BoardPosts.length === 0 ? (
                        <div className="stylish-empty-list">
                            <span>게시글이 없습니다.</span>
                        </div>
                    ) : (
                        <div className="bookmark-posts">
                            {BoardPosts.map((post) => (
                                <div key={`board-${post.BOARD_ID}`} className="bookmark-card">
                                    <Link to={`/view?boardId=${post.BOARD_ID}`}>
                                        <h4 className="bookmark-title">{post.TITLE}</h4>
                                        <p className="bookmark-content">
                                            {post.CONTENT?.length > 100 ? post.CONTENT.substring(0, 100) + '...' : post.CONTENT}
                                        </p>
                                        <div className="bookmark-meta">
                                            <span>작성자: {post.WRITER}</span><br />
                                            <span>조회수: {post.HIT}</span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}


                </>
            );
        } else if (activeTab === 'comments') {
            return (
                <>
                    {/* <div className="stylish-empty-list">
                        <span>댓글이 없습니다.</span>
                    </div> */}
                    {CommentPosts.length === 0 ? (
                        <div className="stylish-empty-list">
                            <span>댓글이 없습니다.</span>
                        </div>
                    ) : (
                        <div className="bookmark-posts">
                            {CommentPosts.map((post, index) => (
                                <div key={`comment-${post.BOARD_ID}-${index}`} className="bookmark-card">
                                    <Link to={`/view?boardId=${post.BOARD_ID}`}>
                                        {/* <h4 className="bookmark-title">{post.TITLE}</h4>
                                        <p className="bookmark-content">
                                            {post.CONTENT?.length > 100 ? post.CONTENT.substring(0, 100) + '...' : post.CONTENT}
                                        </p> */}
                                        <h4 className="bookmark-title"> 제목 : {post.TITLE}</h4>
                                        <p className="bookmark-content">
                                            내 댓글: {post.CONTENT?.length > 100 ? post.CONTENT.substring(0, 100) + '...' : post.CONTENT}
                                        </p>
                                        <div className="bookmark-meta">
                                            {/* <span>작성자: {post.WRITER}</span><br /> */}
                                            {/* <span>조회수: {post.HIT}</span> */}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        } else if (activeTab === 'bookmarks') {
            return (
                <>
                    {bookmarkedPosts.length === 0 ? (
                        <div className="stylish-empty-list">
                            <span>북마크한 게시글이 없습니다.</span>
                        </div>
                    ) : (
                        <div className="bookmark-posts">
                            {bookmarkedPosts.map((post) => (
                                <div key={`bookmark-${post.BOARD_ID}`} className="bookmark-card">
                                    <Link to={`/view?boardId=${post.BOARD_ID}`}>
                                        <h4 className="bookmark-title">{post.TITLE}</h4>
                                        <p className="bookmark-content">
                                            {post.CONTENT?.length > 100 ? post.CONTENT.substring(0, 100) + '...' : post.CONTENT}
                                        </p>
                                        <div className="bookmark-meta">
                                            <span>작성자: {post.WRITER}</span><br />
                                            <span>조회수: {post.HIT}</span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                    )}
                </>
            );
        }
    };

    return (
        <div className="mypage-container">
            <section className="mypage-section">
                <h2 className="Mypage-title">마이페이지</h2>
                <div className="mypage-layout">
                    <aside className="mypage-menu">
                        <div className="mypage-profile">
                            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt=" " className="mypage-profile-img" />
                            <div className="mypage-profile-id">{userInfo?.username || 'user123'}</div>
                        </div>
                        <button onClick={() => setSelectedMenu('info')}>회원 정보</button>
                        <button onClick={() => {
                            setSelectedMenu('posts');
                            setActiveTab('posts');
                        }}>나의 글</button>
                        {/* 여기 밑에 배너 탭 조건부로 표시!! */}
                        {selectedMenu === 'posts' && (
                            <div className="sub-tab-banner-left">
                                <span
                                    className={`sub-tab fake-button ${activeTab === 'posts' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('posts')}
                                >
                                    게시글
                                </span>
                                <span
                                    className={`sub-tab fake-button ${activeTab === 'comments' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('comments')}
                                >
                                    댓글
                                </span>
                                <span
                                    className={`sub-tab fake-button ${activeTab === 'bookmarks' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('bookmarks')}
                                >
                                    북마크
                                </span>
                            </div>
                        )}
                    </aside>
                    <div className="mypage-content">
                        {selectedMenu === 'info' ? (
                            <div className="mypage-edit-box">
                                <h3 className="mypage-edit-title">회원 정보 수정</h3>
                                <form className="mypage-edit-form-simple">
                                    <label>회원 ID<input type="text" /></label>
                                    <label>닉네임<input type="text" /></label>
                                    <label>이메일
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input type="text" style={{ flex: 1 }} placeholder="이메일 아이디" />
                                            <span>@</span>
                                            <select style={{ flex: 1 }}>
                                                <option value="gmail.com">gmail.com</option>
                                                <option value="naver.com">naver.com</option>
                                                <option value="daum.net">daum.net</option>
                                                <option value="hanmail.net">hanmail.net</option>
                                                <option value="nate.com">nate.com</option>
                                                <option value="hotmail.com">hotmail.com</option>
                                                <option value="kakao.com">kakao.com</option>
                                                <option value="직접입력">직접입력</option>
                                            </select>
                                        </div>
                                    </label>
                                    <label>전화번호<input type="text" /></label>
                                    <label>부산광역시 구/군
                                        <select>
                                            <option value="">구/군 선택</option>
                                            <option value="중구">중구</option>
                                            <option value="서구">서구</option>
                                            <option value="동구">동구</option>
                                            <option value="영도구">영도구</option>
                                            <option value="부산진구">부산진구</option>
                                            <option value="동래구">동래구</option>
                                            <option value="남구">남구</option>
                                            <option value="북구">북구</option>
                                            <option value="해운대구">해운대구</option>
                                            <option value="사하구">사하구</option>
                                            <option value="금정구">금정구</option>
                                            <option value="강서구">강서구</option>
                                            <option value="연제구">연제구</option>
                                            <option value="수영구">수영구</option>
                                            <option value="사상구">사상구</option>
                                            <option value="기장군">기장군</option>
                                        </select>
                                    </label>
                                    <label>상세주소<input type="text" placeholder="상세주소 (예: 00동 123-45)" /></label>
                                    <label>새 비밀번호<input type="password" placeholder="새 비밀번호" /></label>
                                    <label>새 비밀번호 확인<input type="password" placeholder="새 비밀번호 확인" /></label>
                                    <div className="mypage-edit-btns">
                                        <button type="submit" className="btn-save">저장</button>
                                        <button type="button" className="btn-cancel">취소</button>
                                    </div>
                                </form>
                            </div>
                        ) : selectedMenu === 'posts' ? ( 
                            <div className="mypage-board-manage stylish-board">
                                <h3 className="mypage-board-title stylish-title">게시물 관리</h3>
                                
                                {/* 👉 하위 배너 스타일 탭 바 */}
                                {/*<div className="sub-tab-banner">
                                    <button
                                        className={`sub-tab ${activeTab === 'posts' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('posts')}
                                    >
                                        게시글 ({BoardPosts.length})
                                    </button>
                                    <button
                                        className={`sub-tab ${activeTab === 'comments' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('comments')}
                                    >
                                        댓글 ({CommentPosts.length})
                                    </button>
                                    <button
                                        className={`sub-tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('bookmarks')}
                                    >
                                        북마크 ({bookmarkedPosts.length})
                                    </button>
                                </div>

                                 선택된 탭 콘텐츠 
                                {renderTabContent()} */}
                                {renderTabContent()}
                            </div>
                        ) : (
                            <p>메뉴를 선택하세요.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Mypage;