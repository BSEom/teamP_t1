import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import './Update.css';

const Update = () => {
    const [searchParams] = useSearchParams();
    const boardId = searchParams.get("boardId");
    const nowpage = searchParams.get("nowpage") || 1;
    const navigate = useNavigate();
    

    const [form, setForm] = useState({
        title: "",
        name: "",
        content: "",
    });

    useEffect(() => {
        if (boardId) {
            fetch(`http://localhost:8050/api/board/${boardId}`)
                .then((res) => res.json())
                .then((data) => {
                    setForm({
                        title: data.TITLE || "",
                        name: data.WRITER || "",
                        content: data.CONTENT || "",
                    });
                })
                .catch((err) => {
                    alert("게시글 불러오기 실패");
                    console.error(err);
                });
        }
    }, [boardId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:8050/api/board/${boardId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await res.text();
            if (result === "success") {
                alert("글 수정 완료!");
                navigate(`/?nowpage=${nowpage}`);
            } else {
                alert("수정 실패: " + result);
            }
        } catch (err) {
            alert("수정 중 오류 발생: " + err.message);
        }
    };

    return (
        <div className="update-container">
            <h1 className="text-center">글 수정</h1>
            <br/>
            <form onSubmit={handleSubmit} className="update-form">
                <div className="form-group">
                    <label>제목</label>
                    <input
                        className="form-control"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>작성자</label>
                    <input
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        className="form-control"
                        name="content"
                        rows="10"
                        value={form.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <br/>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" type="submit">
                        수정 완료
                    </button>
                    <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() => navigate(`/view?boardId=${boardId}&nowpage=${nowpage}`)}
                    >
                        취소
                    </button>
                    <br/>
                </div>
            </form>
        </div>
    );
};

export default Update;
