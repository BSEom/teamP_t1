import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [ name, setName ] = useState();
  const [ email, setEmail ] = useState();
  const [ ckm, setCkm ] = useState(false); 
  const [ ckn, setCkn ] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const pw1 = document.querySelector("#password").value;
    // const pw2 = document.querySelector("#confirm-password").value;

    // if (pw1 !== pw2) {
    //   alert("비밀번호가 일치하지 않습니다 !");
    //   return;
    // }

    // form값을 JOSN으로 변환
    const form = e.target;
    const formData = new FormData(form);
    const json = {};

    formData.forEach((value, key) => {
      json[key] = value;
    });

    // 폼 제출
    // e.target.submit();
    
    // JSON으로 제출
    const response = await fetch("http://localhost:8050/user/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });

    // 응답
    if (response.ok) {
      const result = await response.json();
      alert(JSON.stringify(result.message));
      setTimeout(() => navigate("/"), 100); 
    } else {
      const result = await response.json();
      alert(JSON.stringify(result.message))
    }

  };

  const checkName = async () => {
    const res = await fetch("http://localhost:8050/user/sign-up/name-check", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: name,
    });


    if (res.ok) {
      const result = await res.json();
      alert(JSON.stringify(result.message));
      setCkn(true);
    } else {
      const result = await res.json();
      alert(JSON.stringify(result.message))
    }
  };

  const checkEmail = async () => {
    const res = await fetch("http://localhost:8050/user/sign-up/email-check", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: email,
    });


    if (res.ok) {
      const result = await res.json();
      alert(JSON.stringify(result.message));
      setCkm(true);
    } else {
      const result = await res.json();
      alert(JSON.stringify(result.message))
    }
  };

  return (
    <div className="body-wrapper">

      <div className="container">
        <h2>회원가입</h2>
        <form
          onSubmit={handleSubmit} method="post" action="#"
        >
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="name"
              name="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={ckn}
              required
            />
            <label htmlFor="username">닉네임</label>
            <button type="button" className="duplicate-check-btn" onClick={checkName}>
              중복확인
            </button>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              id="email"
              className="form-control"
              placeholder="name@example.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={ckm}
              required
            />
            <label htmlFor="email">이메일</label>
            <button type="button" className="duplicate-check-btn" onClick={checkEmail}>
              중복확인
            </button>
          </div>


          <div className="form-floating mb-3">
            <input
              type="text"
              id="phone"
              className="form-control"
              placeholder="휴대폰 번호"
              name="phonenumber"
              required
            />
            <label htmlFor="phone">휴대폰 번호</label>
          </div>

          {/* 부산광역시 구 선택 */}
          <div className="form-floating mb-3">
            <select id="busanGu" className="form-control" name="address" required>
              <option value="" disabled>구/군 선택</option>
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

          {/* <div className="form-floating mb-3">
            <input
              type="text"
              id="detailAddress"
              className="form-control"
              placeholder="상세주소 (예: 00동 123-45)"
              name="entry.detailAddress"
              required
            />
            <label htmlFor="detailAddress">상세주소</label>
          </div> */}

          <div className="form-floating mb-3">
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Password"
              name="password"
              required
            />
            <label htmlFor="password">비밀번호</label>
          </div>

          <button type="submit" disabled={!(ckm && ckn)} style={{ fontSize: "1.2rem" }}>가입하기</button>
        </form>
      </div>
    </div>
  );
};

export default Register;