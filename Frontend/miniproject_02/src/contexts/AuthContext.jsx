import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // 앱 시작 시 세션 검사
    const checkLoginStatus = async () => {
      const res = await fetch("http://localhost:8050/user/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setUsername(data.username);
      } else {
        setIsLoggedIn(false);
        setUsername(null);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, setIsLoggedIn, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context 가져오는 훅
export const useAuth = () => useContext(AuthContext);
