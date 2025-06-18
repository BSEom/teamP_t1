import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (

 <div className="body-wrapper">
  <div className="container">
    <div className="form-container" style={{ padding: "2rem" }}>
      <h2>로그인</h2>
<br />
      <div>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label htmlFor="floatingInput">이메일</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label htmlFor="floatingPassword">패스워드</label>
        </div>
      </div>
      <button type="submit" style={{ fontSize: "1.5rem" }}>로그인</button>
    </div>
              <hr />
          <p className="note">
            계정이 없으신가요? {" "}<Link to="/Register" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
    회원가입</Link>
          </p>
  </div>
</div>
  );
};

export default Login;