import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import Swal from 'sweetalert2';

const Logout = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUsername } = useAuth();

  useEffect(() => {
    const logout = async () => {
      await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      // 프론트 전역 상태 초기화
      setIsLoggedIn(false);
      setUsername(null);

      Swal.fire({
        title: '알림',
        text: '로그아웃 되었습니다!',
        icon: 'info',
        confirmButtonText: '확인'
      })

      // 홈으로 이동
      navigate("/");
    };

    logout();
  }, [navigate, setIsLoggedIn, setUsername]);

  return <div>로그아웃 중입니다...</div>;
};

export default Logout;