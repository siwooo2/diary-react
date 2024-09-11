import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { TiTrash } from "react-icons/ti";
import { PiStar, PiStarFill } from "react-icons/pi";

function ToDoList({ id, content, completed, userid, getToDo, time, special }) {

    const navigate = useNavigate();


    const deleteToDo = async () => {
        try {
            const response = await api.delete(`api/deletetodo?id=${id}&userid=${userid}`)
            if (response.data) {
                getToDo();
                navigate(`/todos/${userid}`)
            } else {
                alert('삭제 중 오류가 발생했습니다.')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const updateCompleted = async () => {
        try {
            const data = {
                id: id,
                userid: userid,
                completed: !completed
            }
            await api.patch('api/updatecompleted', data)
            getToDo();
        } catch (err) {
            console.log(err)
        }
    }



    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        if (hours < 12) {
            return `${hours}:${minutes} am`;
        } else if (hours === 12) {
            return `${hours}:${minutes} pm`;
        } else {
            return `${(hours - 12).toString().padStart(2, '0')}:${minutes} pm`;
        }

    }

    const changeStar = async() => {
        try{
            const data = {
                id : id,
                userid : userid,
                special: !special
            }
            await api.patch('api/changestar', data)
            getToDo();
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div>
            <li className="list-group-item d-flex justify-content-between align-items-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '2px solid #d3d3d3', width: '500px', height: 'auto', borderRadius: '10px' }}>
                <div className="d-flex align-items-center">
                    <input className="form-check-input me-1" type="checkbox" checked={completed} onChange={updateCompleted} id={id} style={{ width: '18px', height: '18px' }} />
                    &nbsp;&nbsp;
                    <label className="form-check-label"
                        htmlFor={id}
                        style={{ fontWeight: '600', textDecoration: completed ? 'line-through' : 'none', fontSize: '16px', color: completed ? '#939393' : '#393939' }}
                    >{content}</label>

                </div>
                <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '13px', textDecoration: completed ? 'line-through' : 'none', color: completed ? '#939393' : 'black' }}>{formatTime(time)}</span>
                &nbsp;&nbsp;&nbsp;
                    <span style={{fontSize:'18px', cursor:'pointer'}} onClick={changeStar}>{special ? <PiStarFill/> : <PiStar/>}</span>
                    &nbsp;
                    <TiTrash style={{ fontSize: '25px', cursor: 'pointer' }} onClick={deleteToDo} />
                </div>

            </li>

            <p />
        </div>
    )
}

export default ToDoList;