import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";


function LoginPage(){

    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const userNameHandler = (e) => {
        setUserName(e.target.value)
    }
    const passwordHandler = (e) => {
        setPassword(e.target.value)
    }

    const login = async(e) => {
        e.preventDefault();
        if(userName && password){
            const data = {
                username : userName,
                password : password
            }
            const response = await api.post('api/login', data);
            if(response.data){
                const response = await api.post('api/getuser', data)
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', userName);
                localStorage.setItem('id', response.data.id);
                localStorage.setItem('nickName', response.data.nickname);
                alert(`${response.data.nickname}님 환영합니다!`)
                navigate('/')
            }else{
                alert("아이디와 비밀번호를 다시 확인하세요")
            }
            
        }else{
            alert("아이디 혹은 비밀번호를 입력해 주세요")
        }
    }

    



    return(
        <div className="custom-background">
            <div style={{ padding: "150px", textAlign:"center"}}>
                <h1 style={{fontSize:'4rem',
                    color: 'black',
                    fontFamily: 'Georgia, serif', // 고급스러운 폰트
                    fontWeight: 'bold',
                    textShadow: '5px 10px 5px gray'}}>Diary</h1>
                <br/>
                <form style={{ display: 'inline-block', backgroundColor: "white", padding: '20px', borderRadius: '10px', boxShadow: '0 10px 50px gray'}} onSubmit={login}>
                    <input type="text" className="form-control " placeholder="아이디" style={{width:'300px', height:'50px', border: '1px solid gray'}} value={userName} onChange={userNameHandler}/>
                    <p/>
                    <input type="password" className="form-control " placeholder="비밀번호" style={{width:'300px', height:'50px', border: '1px solid gray'}} value={password} onChange={passwordHandler}/>
                    <p/>
                    <button className="btn btn-secondary" type="submit" style={{width:'300px', height:'50px'}}>로그인</button>
                </form>
                
            </div>
            
        </div>
    )
}

export default LoginPage;