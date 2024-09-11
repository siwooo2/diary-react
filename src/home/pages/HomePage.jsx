import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";


  
function HomePage(){

    const navigate = useNavigate();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickName, setNickName] = useState('');
    const [id, setId] = useState('');

    const moveLogin = () => {
        navigate('/login')
    }

    const moveSignUp = () => {
        navigate('/signup')
    }

    const moveToDos = () => {
        navigate(`/todos/${id}`)
    }

    useEffect(()=>{
        if(localStorage.getItem('isLoggedIn')){
            setIsLoggedIn(true);
            setNickName(localStorage.getItem('nickName'))
            setId(localStorage.getItem('id'))
        }
    },[])
    
    const logOut = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('nickName');
        localStorage.removeItem('id');
        setIsLoggedIn(false);
    }

    return(
        
        <div className="custom-background">
            {isLoggedIn ? (
                <div style={{ padding: '50px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '30px', textShadow: '1px 2px 2px gray' }}>환영합니다, {nickName}!</h1>
                    <p style={{ fontSize: '5rem', fontWeight: 'bold', fontFamily: 'Georgia, serif', textShadow: '3px 6px 3px gray'}}>To Do List</p>
                    <br/>
                    <p style={{fontWeight:600}}>당신의 오늘을 기록하세요.</p>
                    <p style={{fontWeight:600}}>아래 버튼을 클릭하여 할 일을 작성해 보세요!</p>
                    <p/>
                    <button type="button" className="btn btn-outline-dark" onClick={moveToDos} >To Do List 작성하러 가기</button>
                    <p/>
                    <button type="button" className="btn btn-outline-dark" onClick={logOut} >로그아웃</button>
                </div>
            ) : (
                <div style={{ padding: '150px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '4rem', textShadow: '1px 2px 3px gray' }}>환영합니다!</h1>
                    <br/><br/>
                    <p>여러분의 소중한 순간들을 기록할 준비가 되셨나요? </p>
                    <p>개인 일기장에 오신 것을 기쁘게 생각하며, 특별한 기록들을 안전하게 관리할 수 있도록 도와드리겠습니다.</p>
                    <br/>
                    <p style={{fontWeight:600}}>로그인을 통해 시작해 보세요!</p>
                    <p/>
                    <button type="button" className="btn btn-outline-dark" onClick={moveLogin}>로그인</button>
                    &nbsp;
                    <button type="button" className="btn btn-outline-dark" onClick={moveSignUp}>회원가입</button>
                </div>
            )}         
        </div>
    )
}

export default HomePage;