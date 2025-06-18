import React from "react";
import { Link } from 'react-router-dom';
import "./Mypage.css";

function Mypage() {
    const [selectedMenu, setSelectedMenu] = React.useState(null);

    return (
        <div className="mypage-container">
            <section className="mypage-section">
                <h2>마이페이지</h2>
                <div className="mypage-layout">
                    <aside className="mypage-menu">
                        <div className="mypage-profile">
                            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt=" " className="mypage-profile-img" />
                            <div className="mypage-profile-id">아이디: user123</div>
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
                                        <input type="text" value=" " disabled className="readonly" />
                                    </label>
                                    <label>이름
                                        <input type="text" value=" " />
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
                            <div className="mypage-board-manage">
                                <h3 className="mypage-board-title">게시물관리</h3>
                                <div className="mypage-board-tabs">
                                    <button className="active">게시글 (0)</button>
                                    <button className="inactive" disabled>댓글 (0)</button>
                                </div>
                                <div className="mypage-board-search">
                                    <select className="mypage-board-select">
                                        <option>제목</option>
                                    </select>
                                    <div className="mypage-board-searchbox">
                                        <input type="text" placeholder="" />
                                        <button className="mypage-board-searchbtn">검색</button>
                                    </div>
                                </div>
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