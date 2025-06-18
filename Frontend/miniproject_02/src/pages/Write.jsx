import React from "react";
import { useNavigate } from "react-router-dom";
import "./Write.css";

const Write = () => {
    const navigate = useNavigate();
    
    const handleGoWrite = () => {
        navigate("/");
    };
    
    return (
        <>
            <div className="write-wrapper">
                <div className="write-content">
                    <h1 className = "title">게시판 글쓰기</h1>
                    <form id = "Write-content">
                        <div className="form-group">
                            <label htmlFor="title">제목</label>
                            <input type="text" className="form-control" id="title" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">내용</label>
                            <textarea className="form-control" id="content" rows="15" required />
                        </div>
                        <div className="button-container">
    <button type="submit" className="btn-write" onClick={handleGoWrite}>글 작성</button>
    <button type="button" className="btn-cancel" >취소</button>
</div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Write;