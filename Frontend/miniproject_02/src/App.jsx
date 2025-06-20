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
import CheckMyPage from './pages/CheckMypage'
import Header from './components/Header'
import Footer from './components/Footer'
import Logout from './pages/Logout'

function App() {
  return (
    <div className='app-container'>
      <Header />
      <nav>
        <Link to="/">최저가 물건 찾기</Link>
        <Link to="/Data">통계</Link>
        <Link to="/Board">게시판</Link>
      </nav>

      <main className = "content">
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
        <Route path="/CheckMypage" element={<CheckMyPage />} />
        <Route path="/Logout" element={<Logout />} />
      </Routes>
      </main>
      <Footer/>
    </div>
  );
}
export default App;

