
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function SignUpPage() {

    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [nickName, setNickName] = useState('');
    const [birth, setBirth] = useState('');
    const [duplication, setDuplication] = useState(true);

    const userNameHandler = (e) => {
        setUserName(e.target.value);
        setDuplication(true); // 사용자 이름 변경 시 중복 확인 상태를 다시 true로 설정
    }
    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }
    const nickNameHandler = (e) => {
        setNickName(e.target.value);
    }
    const birthHandler = (e) => {
        setBirth(e.target.value);
    }

    const signUp = async(e) => {
        e.preventDefault();
        try{
            if (duplication) {
                alert('아이디 중복 확인을 진행해 주세요')
            } else {
                if (userName.trim() && password.trim() && nickName.trim() && birth.trim()) {
                    const data = {
                        username : userName,
                        password : password,
                        nickname : nickName,
                        birthdate : birth
                    }
                    const response = await api.post('api/signup', data);
                    if(response.data){
                        alert('회원가입을 축하합니다!')
                        navigate('/login')
                    } else{
                        alert('회원가입에 실패하였습니다')
                    }
                    
                } else {
                    alert('내용을 입력해 주세요')
                }
            }
        }catch(error){
            console.log("회원 가입 요청 중 에러 발생 >> ", error);
                alert('회원 가입 요청 중 오류 발생!')
        }
        
    }

    const duplicationHandler = async () => {
        const data = {
            username: userName
        }
        if (userName.trim()) {
            try {
                const response = await api.post('api/duplication', data);
                if (response.data) {
                    alert("중복된 아이디입니다")
                    setDuplication(true);
                } else {
                    alert("사용 가능한 아이디입니다")
                    setDuplication(false);
                }
            } catch (error) {
                console.log("중복 확인 중 에러 발생 >> ", error);
                alert('중복 확인 중 오류 발생!')
                setDuplication(true); // 오류 발생 시 중복으로 간주
            }
        } else {
            alert("아이디를 입력하세요")
        }


    }



    return (
        <div className="custom-background">
            <div style={{ padding: "100px", textAlign: "center" }}>
                <h1 style={{
                    fontSize: '4rem',
                    color: 'black',
                    fontFamily: 'Georgia, serif', // 고급스러운 폰트
                    fontWeight: 'bold', // 두꺼운 글씨
                    textShadow: '5px 10px 5px gray'
                }}>Diary</h1>
                <br />
                <form style={{ display: 'inline-block', backgroundColor: "white", padding: '20px', borderRadius: '10px', boxShadow: '0 10px 50px gray' }} onSubmit={signUp}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="아이디" style={{ width: '200px', height: '50px', border: '1px solid gray' }} value={userName} onChange={userNameHandler} />
                        <button className="btn btn-outline-secondary" type="button" onClick={duplicationHandler}>중복확인</button>
                    </div>
                    <p />
                    <input type="password" className="form-control " placeholder="비밀번호" style={{ width: '300px', height: '50px', border: '1px solid gray' }} value={password} onChange={passwordHandler} />
                    <p />
                    <input type="text" className="form-control " placeholder="닉네임" style={{ width: '300px', height: '50px', border: '1px solid gray' }} value={nickName} onChange={nickNameHandler} />
                    <p />
                    <input type="text" className="form-control " placeholder="생년월일(8자리)" style={{ width: '300px', height: '50px', border: '1px solid gray' }} value={birth} title="8자리 숫자만 입력 가능합니다" pattern="\d{8}" onChange={birthHandler} maxLength="8" />
                    <p />
                    <button className="btn btn-secondary" type="submit" style={{ width: '300px', height: '50px' }} >회원가입 요청</button>
                </form>

            </div>


        </div>
    )
}

export default SignUpPage;