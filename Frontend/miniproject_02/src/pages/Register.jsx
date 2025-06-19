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
            <label htmlFor="username">닉네임</label>
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
              type="text"
              id="phone"
              className="form-control"
              placeholder="휴대폰 번호"
              name="entry.phone"
              required
            />
            <label htmlFor="phone">휴대폰 번호</label>
          </div>

          {/* 부산광역시 구 선택 */}
          <div className="form-floating mb-3">
            <select id="busanGu" className="form-control" name="entry.busanGu" required>
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
            <label htmlFor="busanGu">부산광역시 구/군</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              id="detailAddress"
              className="form-control"
              placeholder="상세주소 (예: 00동 123-45)"
              name="entry.detailAddress"
              required
            />
            <label htmlFor="detailAddress">상세주소</label>
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

          <button type="submit" style={{ fontSize: "1.2rem" }}>가입하기</button>
        </form>
      </div>
    </div>
  );
};

export default Register;