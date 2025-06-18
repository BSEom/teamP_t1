import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Data from './pages/Data'
import Board from './pages/Board'
import Write from './pages/Write'
import View from './pages/View'
import Mypage from './pages/Mypage'
import Update from './pages/Update'

function App() {
  return (
    <>
    <div className="info_container">
      <Link to="/">홈</Link> | {" "}
      <Link to="/Login">로그인</Link> | {" "}
      <Link to="/Mypage">마이 페이지</Link>
    </div>
      <nav>

        <Link to="/">최저가 물건 찾기</Link>
        <Link to="/Data">통계</Link>
        <Link to="/Board">게시판</Link>

        <Link to="/Write">작성창</Link>
        <Link to="/View">뷰어</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Data" element={<Data />} />
        <Route path="/Board" element={<Board />} />
        <Route path="/Update" element={<Update />} />
        <Route path="/View" element={<View />} />
        <Route path="/Write" element={<Write />} />
        <Route path="/Mypage" element={<Mypage />} />
      </Routes>

      <footer style={{textAlign: 'center', padding: '1rem', color: '#888'}}>
        COPYRIGHTS @ 2025 Miniproject02 - Team01 , All rights reserved.
      </footer>
    </>
  );
}
export default App;

