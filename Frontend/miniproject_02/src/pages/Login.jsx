import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUsername } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
      const init_login = () =>{
        setIsLoggedIn(false);
        setUsername(null);
      };
      
      init_login();
  }, []);

  const handelLogin = async () => {
    const response = await fetch("http://localhost:8050/user/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    });

    // 응답
    if (response.ok) {
      const result = await response.json();
      alert(JSON.stringify(result.message));

      setIsLoggedIn(true);
      setUsername(result.username);

      setTimeout(() => navigate("/"), 100); 
    } else {
      const result = await response.json();
      alert(JSON.stringify(result.message))
      setTimeout(() => navigate("/login"), 100); 
    }
  }

  
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="floatingInput">이메일</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">패스워드</label>
        </div>
      </div>
      <button type="submit" style={{ fontSize: "1.5rem" }} onClick={handelLogin}>로그인</button>
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