import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
    const { isLoggedIn, username } = useAuth();
    
    return (
        <div className="info_container">
            <Link to="/">홈</Link> | {" "}
            { isLoggedIn ? (
                <>
                    <span>{username}{" "}님</span> | {" "}
                    <Link to="/CheckMypage">마이 페이지</Link> | {" "}
                    <Link to="/Logout">로그아웃</Link>
                </>
            ) : (
                <Link to="/Login">로그인</Link>
            )
            }
        </div>
    );
};

export default Header;