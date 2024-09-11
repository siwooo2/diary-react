import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import ToDoList from "../list/ToDoList";
import DatePicker from "react-datepicker";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";



function ToDosPage() {

    const { id } = useParams();
    const [content, setContent] = useState('');
    const [toDos, setToDos] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [toDoBtn, setToDoBtn] = useState(true);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [time, setTime] = useState(`${new Date().getHours()}:${new Date().getMinutes()}`);
    const [calDate, setCalDate] = useState(new Date());


    const timeHandler = (e) => {
        setTime(e.target.value)
    }

    const contentHandler = (e) => {
        setContent(e.target.value)
    }

    const contentForm = (e) => [
        e.preventDefault()
    ]


    useEffect(() => {
        setYear(startDate.getFullYear())
        setMonth(startDate.getMonth())
        setDay(startDate.getDate())
    }, [])

    useEffect(() => {
        if (day) {
            getToDo()
        }
    }, [day])

    useEffect(() => {
        if (content) {
            setToDoBtn(false)
        } else {
            setToDoBtn(true)
        }
    }, [content])


    const getToDo = async () => {

        try {
            const data = {
                id: id,
                year: year,
                month: month + 1,
                day: day
            }

            const sortByTime = (a, b) => {
                const timeA = new Date(`1970-01-01T${a.time}`);
                const timeB = new Date(`1970-01-01T${b.time}`);
                return timeA - timeB;
            };

            const response = await api.get(`api/gettodo`, { params: data });
            setToDos(response.data);
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
                        date: startDate,
                        time: time
                    }
                    await api.post('api/savetodo', data)
                    setContent('')
                    getToDo();
                    setTime(`${new Date().getHours()}:${new Date().getMinutes()}`)
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


    const leftBtn = () => {
        conDate(-1)
    }

    const rightBtn = () => {
        conDate(+1)
    }

    const conDate = (num) => {
        startDate.setDate(startDate.getDate() + num);
        setYear(startDate.getFullYear());
        setMonth(startDate.getMonth());
        setDay(startDate.getDate());
    }

    const calendar = () => {
        setStartDate(calDate)
        setYear(calDate.getFullYear());
        setMonth(calDate.getMonth());
        setDay(calDate.getDate());
    }


    return (
        <div className="custom-background" style={{}}>
            <div className="container">

                <div className="row g-3" style={{}}>
                    <p />
                    <div className="row justify-content-center" >
                        <div style={{ textAlign: 'center', }}>
                            <p />
                            <p style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'Georgia, serif', textShadow: '3px 6px 3px gray' }}>To Do List</p>
                        </div>

                        <form className="input-group mb-3" style={{ width: '600px', }} onSubmit={contentForm}>
                            <input type="text"
                                className="form-control"
                                placeholder="내용을 입력해 주세요"
                                style={{ height: '50px', border: '1px solid gray', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                                value={content}
                                onChange={contentHandler}
                            />
                            <button className="btn btn-outline-secondary"
                                type="submit"
                                style={{ color: '#393939', fontWeight: 'bold' }}
                                data-bs-toggle="modal"
                                data-bs-target="#dateModal"
                                disabled={toDoBtn}
                            >추가</button>
                        </form>
                        <p />
                        <button data-bs-toggle="modal"
                            data-bs-target="#calendarModal"
                            className="btn btn-secondary"
                            style={{ width: '100px', height: '32px', fontSize: '14px', borderRadius: '30px', fontWeight: 'bold' }}>날짜 선택</button>
                        <p />
                        <div style={{ display: 'flex', justifyContent: 'space-around', }}>
                            <SlArrowLeft style={{ fontSize: '24px', cursor: 'pointer', }} onClick={leftBtn} />
                            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{year}년 {month + 1}월 {day}일</p>
                            <SlArrowRight style={{ fontSize: '24px', cursor: 'pointer' }} onClick={rightBtn} />
                        </div>
                        <p />
                        <div className="d-flex justify-content-center">
                            <ul className="list-group " >
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {toDos.length > 0 ?
                                        toDos.map((item) => (<ToDoList key={item.id}
                                            id={item.id}
                                            content={item.content}
                                            completed={item.completed}
                                            userid={id}
                                            getToDo={getToDo}
                                            special={item.special}
                                            time={item.time} />)) :
                                        <div style={{ textAlign: 'center', }}>오늘의 일정이 없습니다</div>}
                                </div>
                                <br />
                                <button className="btn btn-secondary"
                                    type="button"
                                    style={{ width: '500px', height: '50px', borderRadius: '40px', fontSize: '20px', }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal" >Clear</button>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 일정 삭제 모달창 */}
                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ marginTop: '200px' }}>
                    <div className="modal-dialog" style={{ display: 'flex', justifyContent: 'center' }} >
                        <div className="modal-content" style={{ borderRadius: '20px' }} >
                            <div style={{ textAlign: 'center' }}>
                                <br />
                                <div style={{}}>
                                    모든 일정을 정말 다 지우시겠어요?<br />
                                    맞다면 확인, 아니라면 취소를 눌러주세요
                                </div>
                                <p />
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" style={{ width: '150px', height: '40px' }}>취소</button>
                                &nbsp;
                                <button type="button" className="btn btn-primary" style={{ width: '150px', height: '40px' }} data-bs-dismiss="modal" onClick={allRemove}>확인</button>
                                <p />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 일정 추가 모달창 */}
                <div className="modal fade" id="dateModal" aria-labelledby="exampleModalLabel" tabIndex="-1" aria-hidden="true" style={{ marginTop: '200px' }}>
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
                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
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