import React from "react";
import { Link } from 'react-router-dom';
import "./Mypage.css";

function Mypage({ userInfo }) {
    const [selectedMenu, setSelectedMenu] = React.useState('info');
    const [activeTab, setActiveTab] = React.useState('posts');

    // 게시글/댓글 탭 클릭 시 각각의 내용 렌더링
    const renderTabContent = () => {
        if (activeTab === 'posts') {
            return (
                <>
                    <div className="mypage-board-search stylish-search">
                        <select className="mypage-board-select stylish-select">
                            <option>제목</option>
                            <option>내용</option>
                        </select>
                    </div>
                    <div className="mypage-board-searchbox stylish-searchbox" style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <input type="text" placeholder="검색어를 입력하세요" className="stylish-input" />
                    </div>
                    <button className="mypage-board-searchbtn stylish-searchbtn" style={{ minWidth: '100px', alignSelf: 'flex-end' }}>검색</button>
                    <div className="stylish-empty-list">
                        <span>게시글이 없습니다.</span>
                    </div>
                </>
            );
        } else if (activeTab === 'comments') {
            return (
                <>
                    <div className="mypage-board-search stylish-search">
                        <select className="mypage-board-select stylish-select">
                            <option>제목</option>
                            <option>내용</option>
                        </select>
                    </div>
                    <div className="mypage-board-searchbox stylish-searchbox" style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <input type="text" placeholder="검색어를 입력하세요" className="stylish-input" />
                    </div>
                    <button className="mypage-board-searchbtn stylish-searchbtn" style={{ minWidth: '100px', alignSelf: 'flex-end' }}>검색</button>
                    <div className="stylish-empty-list">
                        <span>댓글이 없습니다.</span>
                    </div>
                </>
            );
        }
    };

    return (
        <div className="mypage-container">
            <section className="mypage-section">
                <h2>마이페이지</h2>
                <div className="mypage-layout">
                    <aside className="mypage-menu">
                        <div className="mypage-profile">
                            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt=" " className="mypage-profile-img" />
                            <div className="mypage-profile-id">아이디: {userInfo?.username || 'user123'}</div>
                        </div>
                        <button onClick={() => setSelectedMenu('info')}>회원 정보</button>
                        <button onClick={() => setSelectedMenu('posts')}>나의 글</button>
                    </aside>
                    <div className="mypage-content">
                        {selectedMenu === 'info' ? (
                            <div className="mypage-edit-box">
                                <h3 className="mypage-edit-title">회원 정보 수정</h3>
                                <form className="mypage-edit-form-simple">
                                    <label>회원 ID
                                        <input type="text" />
                                    </label>
                                    <label>닉네임
                                        <input type="text" />
                                    </label>
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
                                    <label>전화번호
                                        <input type="text" />
                                    </label>
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
                                    <label>상세주소
                                        <input type="text" placeholder="상세주소 (예: 00동 123-45)" />
                                    </label>
                                    <label>새 비밀번호
                                        <input type="password" placeholder="새 비밀번호" />
                                    </label>
                                    <label>새 비밀번호 확인
                                        <input type="password" placeholder="새 비밀번호 확인" />
                                    </label>
                                    <div className="mypage-edit-btns">
                                        <button type="submit" className="btn-save">저장</button>
                                        <button type="button" className="btn-cancel">취소</button>
                                    </div>
                                </form>
                            </div>
                        ) : selectedMenu === 'posts' ? (
                            <div className="mypage-board-manage stylish-board">
                                <h3 className="mypage-board-title stylish-title">게시물관리</h3>
                                <div className="mypage-board-tabs stylish-tabs">
                                    <button
                                        className={`stylish-tab${activeTab === 'posts' ? ' active' : ''}`}
                                        onClick={() => setActiveTab('posts')}
                                    >
                                        게시글 (0)
                                    </button>
                                    <button
                                        className={`stylish-tab${activeTab === 'comments' ? ' active' : ''}`}
                                        onClick={() => setActiveTab('comments')}
                                    >
                                        댓글 (0)
                                    </button>
                                </div>
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