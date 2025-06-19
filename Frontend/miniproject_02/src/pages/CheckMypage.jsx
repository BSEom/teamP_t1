import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckMyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      const res = await fetch("http://localhost:8050/user/me", {
        method: "GET",
        credentials: "include", // 세션 검사
      });

      if (res.ok) {
        navigate("/mypage");
      } else {
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    };

    checkLogin();
  }, [navigate]);

  return <div>로그인 상태 확인 중...</div>; // 로딩 상태
};

export default CheckMyPage;