import React from "react";
import { Link } from 'react-router-dom';
import "./Register.css";

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const pw1 = document.querySelector("#password").value;
    const pw2 = document.querySelector("#confirm-password").value;

    if (pw1 !== pw2) {
      alert("비밀번호가 일치하지 않습니다 !");
      return;
    }

    // 폼 제출
    e.target.submit();
  };

  return (
    <div className="body-wrapper">

      <div className="container">
        <h2>회원가입</h2>
        <form
          action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSdh4DDGwKn8XaIrn9J7q8IZxfv0ovJVH3V0NmI-vjTPDwmqCw/formResponse"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="name"
              name="entry.390326524"
              required
            />
            <label htmlFor="username">사용자 이름</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              id="email"
              className="form-control"
              placeholder="name@example.com"
              name="entry.2064063587"
              required
            />
            <label htmlFor="email">이메일</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Password"
              name="entry.1111365674"
              required
            />
            <label htmlFor="password">비밀번호</label>
          </div>

          <div>
            <label htmlFor="confirm-password">비밀번호 확인</label>
            <input type="password" id="confirm-password" required />
          </div>

          <button type="submit" style={{ fontSize: "1.2rem" }}>가입하기</button>
        </form>
      </div>
    </div>
  );
};

export default Register;