
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './login/pages/LoginPage';
import SignUpPage from './signup/pages/SignUpPage';
import NaviPage from './navibar/pages/NaviPage';
import HomePage from './home/pages/HomePage';
import ToDosPage from './todos/pages/ToDosPage';


function App() {
  return (
    <BrowserRouter >
      <NaviPage/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/todos/:id" element={<ToDosPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
