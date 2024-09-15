
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './home/pages/HomePage';
import LoginPage from './login/pages/LoginPage';
import NaviPage from './navibar/pages/NaviPage';
import SignUpPage from './signup/pages/SignUpPage';
import ToDosPage from './todos/pages/ToDosPage';
import ToDosSearch from './todos/pages/ToDosSearch';


function App() {
  return (
    <BrowserRouter >
      <NaviPage/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/todos/:id" element={<ToDosPage/>}/>
        <Route path="/search/:id" element={<ToDosSearch/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
