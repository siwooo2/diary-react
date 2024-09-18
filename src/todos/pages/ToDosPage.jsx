import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FaRegSmile } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { TiWeatherCloudy, TiWeatherDownpour, TiWeatherNight, TiWeatherPartlySunny, TiWeatherSnow, TiWeatherSunny } from "react-icons/ti";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import ToDoList from "../list/ToDoList";



function ToDosPage() {

    const navigate = useNavigate();

    const { id } = useParams();
    const [content, setContent] = useState('');
    const [toDos, setToDos] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [toDoBtn, setToDoBtn] = useState(true);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [time, setTime] = useState(`${new Date().getHours().toString().padStart(2,"0")}:${new Date().getMinutes().toString().padStart(2,"0")}`);
    const [calDate, setCalDate] = useState(new Date());     // 날짜 선택 달력 
    const [basedate, setBasedate] = useState(new Date().getHours() >= 6 ? 
        `${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,"0")}${(new Date().getDate()).toString().padStart(2,"0")}` : 
        `${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,"0")}${(new Date().getDate()-1).toString().padStart(2,"0")}`
    )
    const [tmFc, setTmFc] = useState(new Date().getHours() >= 6 ? 
    `${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,"0")}${(new Date().getDate()).toString().padStart(2,"0")}0600` : 
    `${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,"0")}${(new Date().getDate()-1).toString().padStart(2,"0")}0600`
)
    const [weatherAry, setWeatherAry] = useState([]);
    const [todayWeather, setTodayWeather] = useState('');
    const [loading, setLoading] = useState(false);      //화면 로딩 상태
    const [addDate, setAddDate] = useState(startDate);
    const [weatherMdData, setWeatherMdData] = useState('');

    
    const timeHandler = (e) => {
        setTime(e.target.value)
    }

    const contentHandler = (e) => {
        setContent(e.target.value)
    }

    // 화면 리로딩 방지
    const contentForm = (e) => [
        e.preventDefault()
    ]


    useEffect(() => {
        setDate(startDate);
    }, [])

    useEffect(() => {
        if (day) {
            getToDo();
        }
        if(weatherAry.length>0){
            changeWeather();
        }
    }, [day])

    useEffect(() => {
        if (content) {
            setToDoBtn(false)
        } else {
            setToDoBtn(true)
        }
    }, [content])

    useEffect(()=>{
        getWeather();
    },[basedate, tmFc])

    useEffect(()=>{
        if(weatherAry.length>0){
            changeWeather();
        }
    },[weatherAry])


    const getToDo = async () => {

        try {
            const data = {
                id: id,
                year: year,
                month: month + 1,
                day: day
            }

            // 날짜 정렬 기능(오름차순)
            const sortByTime = (a, b) => {
                const timeA = new Date(`1970-01-01T${a.time}`);
                const timeB = new Date(`1970-01-01T${b.time}`);
                return timeA - timeB;
            };

            const response = await api.get(`api/gettodo`, { params: data });
            const firstToDos = response.data.filter(item => item.special === true).sort(sortByTime)
            const secondToDos = response.data.filter(item => item.special === false).sort(sortByTime)
            setToDos([...firstToDos, ...secondToDos])

        } catch (error) {
            console.log(error)
        }
    }

    const addToDo = async () => {
        if (content) {
            if (time) {
                try {
                    const data = {
                        userid: id,
                        content: content,
                        date: addDate,
                        time: time
                    }
                    await api.post('api/savetodo', data)
                    setContent('')
                    getToDo();
                    setDate(startDate);
                    setTime(`${new Date().getHours().toString().padStart(2,"0")}:${new Date().getMinutes().toString().padStart(2,"0")}`)
                    alert('리스트에 추가되었습니다')
                } catch (error) {
                    console.log(error)
                }
            } else {
                alert('시간을 입력해 주세요')
            }
        } else {
            alert('내용을 입력해 주세요')
        }
    }

    const allRemove = async () => {
        try {
            const response = await api.delete(`api/alldeletetodo?id=${id}`)
            if (response.data) {
                getToDo();
            } else {
                alert('전체 삭제 중 오류가 발생했습니다')
            }

        } catch (err) {
            console.log(err);
        }
    }

    

    const getWeather = async () => {
        try{
            const setTime = setTimeout(moveHome,10000)
            const response = await api.get(`api/weather?base_date=${basedate}&base_time=0500`)
            const response02 = await api.get(`api/weathermd?tmFc=${tmFc}`)
            setWeatherAry(response.data);
            setWeatherMdData(response02.data);
            setLoading(true);
            clearTimeout(setTime);
        }catch(err){
            console.log(err);
        }
    }

    

    const formatTime = (t) => {
        return `${t.getHours().toString().padStart(2,"0")}00`
    }

    const changeWeather = () => {
        const changeDate = `${startDate.getFullYear()}${(startDate.getMonth()+1).toString().padStart(2,"0")}${startDate.getDate().toString().padStart(2,"0")}`

        let subDate = startDate.getDate() - new Date().getDate();

        if(new Date().getHours() < 6){
            subDate = subDate+1;
        }
        
        
        const forecast07 = `wf${subDate}Pm`
        const forecast10 = `wf${subDate}`

        const getSKY = weatherAry.find(item => item.category==="SKY" && item.fcstDate===changeDate && item.fcstTime===(new Date().getHours() < 6 ? "0000" : formatTime(startDate)))
        const getPTY = weatherAry.find(item => item.category==="PTY" && item.fcstDate===changeDate && item.fcstTime===(new Date().getHours() < 6 ? "0000" : formatTime(startDate)))

        if(subDate >= 0 && subDate < 3){
            if(getSKY && getPTY){
                const sky =  getSKY.fcstValue;
                const pty =  getPTY.fcstValue;
    
                if(pty == 1 || pty == 2 || pty == 4){
                    setTodayWeather("rain")
                }else if(pty == 3){
                    setTodayWeather("snow")
                }else{
                    if(sky == 1){
                        setTodayWeather("clean")
                    } else if(sky == 3){
                        setTodayWeather("partCloud")
                    }else if(sky == 4){
                        setTodayWeather("cloud")
                    } 
                }

            }else{
                setTodayWeather("no")
            }
        } else if (subDate < 8 && subDate >= 3){
            if(weatherMdData[forecast07]=="맑음"){
                setTodayWeather("clean")
            } else if (weatherMdData[forecast07]=="구름많음"){
                setTodayWeather("partCloud")
            } else if (weatherMdData[forecast07]=="구름많고 비"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast07]=="구름많고 눈"){
                setTodayWeather("snow")
            } else if (weatherMdData[forecast07]=="구름많고 비/눈"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast07]=="구름많고 소나기"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast07]=="흐림"){
                setTodayWeather("cloud")
            } else if (weatherMdData[forecast07]=="흐리고 비"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast07]=="흐리고 눈"){
                setTodayWeather("snow")
            } else if (weatherMdData[forecast07]=="흐리고 비/눈"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast07]=="흐리고 소나기"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast07]=="소나기"){
                setTodayWeather("rain")
            } 
        }else if(subDate >= 8 && subDate < 11){
            if(weatherMdData[forecast10]=="맑음"){
                setTodayWeather("clean")
            } else if (weatherMdData[forecast10]=="구름많음"){
                setTodayWeather("partCloud")
            } else if (weatherMdData[forecast10]=="구름많고 비"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast10]=="구름많고 눈"){
                setTodayWeather("snow")
            } else if (weatherMdData[forecast10]=="구름많고 비/눈"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast10]=="구름많고 소나기"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast10]=="흐림"){
                setTodayWeather("cloud")
            } else if (weatherMdData[forecast10]=="흐리고 비"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast10]=="흐리고 눈"){
                setTodayWeather("snow")
            } else if (weatherMdData[forecast10]=="흐리고 비/눈"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast10]=="흐리고 소나기"){
                setTodayWeather("rain")
            } else if (weatherMdData[forecast10]=="소나기"){
                setTodayWeather("rain")
            } 
        } else{
            setTodayWeather("no")
        }

        
    }

    

    const leftBtn = () => {
        conDate(-1)
    }

    const rightBtn = () => {
        conDate(+1)
    }

    const setDate =(d) => {
        setYear(d.getFullYear());
        setMonth(d.getMonth());
        setDay(d.getDate());
    }    

    const conDate = (num) => {
        startDate.setDate(startDate.getDate() + num);
        setDate(startDate);
    }

    const calendar = () => {
        setStartDate(calDate)
        setDate(calDate);
    }

    const moveSearch = () => {
        navigate(`/search/${id}`)
    }

    const moveToday = () => {
        const today = new Date();
        setStartDate(today);
        setDate(startDate);
    }

    const moveHome = () => {
        navigate('/')
        alert("로딩에 실패하여 홈으로 돌아갑니다. 다시 시도해 주세요")
    }

    const settingAddDate = () => {
        setAddDate(startDate)
    }


    return (
        <div className={`default`}>
            <div className="container">
                <div className="row g-3">
                    {loading?(
                    <div className="d-flex flex-column align-items-center" >
                        <div style={{ textAlign: 'center', width:'300px'}}>
                            <p />
                            <div style={{fontSize:'40px', marginTop:'20px'}}>
                                {todayWeather==="no"?<FaRegSmile/>:""}
                                {todayWeather==="clean"?<TiWeatherSunny/>:""}
                                {todayWeather==="partCloud"?<TiWeatherPartlySunny/>:""}
                                {todayWeather==="cloud"?<TiWeatherCloudy/>:""}
                                {todayWeather==="rain"?<TiWeatherDownpour/>:""}
                                {todayWeather==="snow"?<TiWeatherSnow/>:""}
                                {todayWeather==="night"?<TiWeatherNight/>:""}
                            </div>
                            <p style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'Georgia, serif', textShadow: '3px 6px 3px gray', cursor:'pointer' }}  onClick={moveToday}>To Do List</p>
                        </div>

                        <form className="input-group mb-3" style={{ width: '600px', }} onSubmit={contentForm}>
                            <input type="text"
                                className="form-control"
                                placeholder="내용을 입력해 주세요"
                                style={{ height: '50px', border: '1px solid gray', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius:'10px', }}
                                value={content}
                                onChange={contentHandler}
                            />
                            &nbsp;&nbsp;
                            <button className="btn btn-outline-secondary"
                                type="submit"
                                style={{ color: '#393939', fontWeight: 'bold' , borderRadius:'10px'}}
                                data-bs-toggle="modal"
                                data-bs-target="#dateModal"
                                disabled={toDoBtn}
                                onClick={settingAddDate}
                            >추가</button>
                            &nbsp;&nbsp;
                            <button type="button" 
                                className="btn btn-outline-dark" 
                                style={{borderRadius:'10px', color: '#393939', fontWeight: 'bold',}} 
                                onClick={moveSearch}
                            >SEARCH
                            </button> 
                        </form>
                        <p />
                        <button data-bs-toggle="modal"
                            data-bs-target="#calendarModal"
                            className="btn btn-secondary"
                            style={{ width: '100px', height: '32px', fontSize: '14px', borderRadius: '30px', fontWeight: 'bold' }}>날짜 선택</button>
                        <p />
                        <div style={{ display: 'flex', justifyContent: 'center', }}>
                            <div style={{ marginRight: '150px', marginTop: '3px' }}>
                                <SlArrowLeft style={{ fontSize: '24px', cursor: 'pointer', }} onClick={leftBtn} />
                            </div>
                            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{year}년 {month + 1}월 {day}일</p>
                            <div style={{ marginLeft: '150px', marginTop: '3px' }}>
                                <SlArrowRight style={{ fontSize: '24px', cursor: 'pointer' }} onClick={rightBtn} />
                            </div>
                        </div>
                        <p />
                        <div className="d-flex justify-content-center">
                            <ul className="list-group " >
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {toDos.length > 0 ?
                                        toDos.map((item) => (
                                            <div style={{marginRight:'10px'}} key={item.id}>
                                                <ToDoList 
                                                    id={item.id}
                                                    content={item.content}
                                                    completed={item.completed}
                                                    userid={id}
                                                    getToDo={getToDo}
                                                    special={item.special}
                                                    time={item.time} 
                                                />
                                            </div>
                                        )) :
                                        <div style={{ textAlign: 'center', }}>오늘의 일정이 없습니다</div>
                                    }
                                </div>
                                <br />
                                <button className="btn btn-secondary"
                                    type="button"
                                    style={{ width: '500px', height: '50px', borderRadius: '40px', fontSize: '20px', }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal" >Clear
                                </button>
                            </ul>
                        </div>
                    </div>
                     ):(
                        <div className="default"
                            style={{
                                position: 'fixed', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                left: 0, 
                                top: 0,
                                width: '100%',
                                height: '100%',
                                marginTop:'72px'
                            }} 
                        >
                            <div className="spinner-grow text-dark" style={{width:'2rem', height:'2rem', marginBottom:'150px'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                            </div>
                            &nbsp;
                            <div className="spinner-grow text-dark" style={{width:'2rem', height:'2rem', marginBottom:'150px'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                            </div>
                            &nbsp;
                            <div className="spinner-grow text-dark" style={{width:'2rem', height:'2rem', marginBottom:'150px'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
               

                {/* 일정 삭제 모달창 */}
                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ marginTop: '250px' }}>
                    <div className="modal-dialog" style={{ display: 'flex', justifyContent: 'center' }} >
                        <div className="modal-content" style={{ borderRadius: '40px' }} >
                            <div style={{ textAlign: 'center' }}>
                                <br />
                                <FiAlertTriangle style={{fontSize:'40px'}}/>
                                <p />
                                <div style={{}}>
                                    모든 일정을 정말 다 지우시겠어요?<br />
                                    맞다면 확인, 아니라면 취소를 눌러주세요
                                </div>
                                <p />
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" style={{ width: '150px', height: '40px', borderRadius:'20px'  }}>취소</button>
                                &nbsp;
                                <button type="button" className="btn btn-danger" style={{ width: '150px', height: '40px', borderRadius:'20px' }} data-bs-dismiss="modal" onClick={allRemove}>확인</button>
                                <p />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 일정 추가 모달창 */}
                <div className="modal fade" id="dateModal" aria-labelledby="exampleModalLabel" tabIndex="-1" aria-hidden="true" style={{ marginTop: '250px' }}>
                    <div className="modal-dialog" style={{ display: 'flex', justifyContent: 'center' }} >
                        <div className="modal-content" style={{ borderRadius: '20px', width: '400px' }} >
                            <div style={{ textAlign: 'center' }}>
                                <p />
                                <div style={{ textAlign: 'right', marginRight: '20px' }}>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div >
                                    할 일을 추가할 날짜와 시간을 선택하세요
                                </div>
                                <p />
                                날짜:
                                &nbsp;
                                <DatePicker selected={addDate} onChange={(date) => setAddDate(date)} />
                                <p />
                                시간:
                                &nbsp;
                                <input type="time" style={{ width: '185px', height: '30px' }} value={time} onChange={timeHandler} />
                                <p />
                                <button type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    style={{ width: '150px', height: '40px', marginBottom: '5px', borderRadius: '20px' }}
                                    onClick={addToDo}>선택 완료</button>
                                <p />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 달력 선택 */}
                <div className="modal fade" id="calendarModal" aria-labelledby="exampleModalLabel" tabIndex="-1" aria-hidden="true" style={{ marginTop: '200px', }}>
                    <div className="modal-dialog" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="modal-content" style={{ borderRadius: '20px', width: '300px', height: '310px' }} >
                            <div style={{ textAlign: 'center' }}>
                                <p />
                                <p />
                                <DatePicker selected={calDate} onChange={(date) => { setCalDate(date); }} inline />
                                <button type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    style={{ width: '150px', height: '40px', marginBottom: '5px', borderRadius: '20px' }}
                                    onClick={calendar}>선택 완료</button>
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
        
    )
}

export default ToDosPage;