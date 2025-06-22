import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Write.css";

const Write = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        name: "",
        content: "",
    });

    useEffect(() => {   // 로그인 연동
        const fetchUser = async () => {
            const res = await fetch("http://localhost:8050/user/me", {
                credentials: "include",
            });
        
            if (res.ok) {
                const data = await res.json();
                setForm((preFrom) => ({
                    ...preFrom, 
                    name: data.username
                }))
            } else {
                alert("로그인이 필요합니다.");
                setTimeout(() => navigate("/login"), 100);
            }
        
        };

        fetchUser();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8050/api/write", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await response.text();
            if (result === "success") {
                alert("글 작성 완료!");
                navigate("/Board");
            } else {
                alert("글 작성 실패: " + result);
            }
        } catch (err) {
            alert("글 작성 중 오류 발생: " + err.message);
        }
    };

    const handleCancel = () => {
        if (window.confirm("작성을 취소하시겠습니까?")) {
            navigate("/");
        }
    };

    return (
        <div className="write-wrapper">
            <div className="write-content">
                <h2 className="title">글쓰기</h2>
                <form id="Write-content" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">제목</label>
                        <input
                            id="title"
                            className="form-control"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">작성자</label>
                        <input
                            id="name"
                            className="form-control"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">내용</label>
                        <textarea
                            id="content"
                            className="form-control"
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="button-container">
                        <button type="button" className="btn-cancel" onClick={handleCancel}>
                            취소
                        </button>
                        <button type="submit" className="btn-write">
                            작성
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Write;
