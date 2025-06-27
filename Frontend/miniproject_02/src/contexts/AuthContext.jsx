import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [userid, setUserid] = useState(null);

  const checkLoginStatus = async () => {
    const res = await fetch("/api/user/me", {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setIsLoggedIn(true);
      setUsername(data.username);
      setUserid(data.uid)
    } else {
      setIsLoggedIn(false);
      setUsername(null);
      setUserid(null);
    }
  };
  useEffect(() => {
    // 앱 시작 시 세션 검사

    checkLoginStatus();
  }, []);

  return (
    // <AuthContext.Provider value={{ isLoggedIn, username, userid, setIsLoggedIn, setUsername }}>
    <AuthContext.Provider value={{ isLoggedIn, username, userid, setIsLoggedIn, setUsername, setUserid, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context 가져오는 훅
export const useAuth = () => useContext(AuthContext);
