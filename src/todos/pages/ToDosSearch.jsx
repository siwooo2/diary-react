import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import SearchList from "../list/SearchList";

function ToDosSearch(){

    const navigate = useNavigate();

    const { id } = useParams();
    const [content, setContent] = useState('');
    const [toDoBtn, setToDoBtn] = useState(true);
    const [toDos, setToDos] = useState([]);
    const [currentSort, setCurrentSort] = useState('date');

    useEffect(() => {
        if (content) {
            setToDoBtn(false)
        } else {
            setToDoBtn(true)
        }
    }, [content])

    const contentForm = (e) => [
        e.preventDefault(),
        onSearch()
    ]

    const contentHandler = (e) => {
        setContent(e.target.value)
    }

    // 시간별 정렬 함수
    const sortByTime = (a, b) => {
        const timeA = new Date(`${a.date}T${a.time}`);
        const timeB = new Date(`${b.date}T${b.time}`);
        return timeA - timeB;
    };

    // 이름별 정렬 함수
    const sortByName = (a, b) => {
        const nameA = a.content;
        const nameB = b.content;
        return nameA.localeCompare(nameB)
    }

    // 전체 삭제
    const allRemove = async () => {
        try {
            const response = await api.delete(`api/alldeletetodo?id=${id}`)
            if (response.data) {
                onSearch();
            } else {
                alert('전체 삭제 중 오류가 발생했습니다')
            }

        } catch (err) {
            console.log(err);
        }
    }


    const onSearch = async() => {
        try{
            const data = {
                userid : id,
                content: content
            }
            const response = await api.get('api/searchtodo', {params: data})
            if(currentSort === 'reg'){
                // 등록순 정렬
                setToDos(response.data);
            } else if (currentSort === 'name'){
                // 이름순 정렬
                setToDos(response.data.sort(sortByName));
            } else {
                // 시간순 정렬
                setToDos(response.data.sort(sortByTime));
            }
            
        }catch(err){
            console.log(err)
        }
    }

    const selectSort = (e) => {
        setCurrentSort(e.target.value);
    }

    const moveToDoList = () => {
        navigate(-1)
    }


    return(
        <div className={`default`}>
            <div className="container">
                
                <div className="row g-3">
                    <div className="justify-content-center d-flex flex-column align-items-center" >
                        <div style={{ textAlign: 'center', width:'300px'}}>
                            <p />
                            <div style={{fontSize:'40px', marginTop:'20px'}}>
                                <FaSearch/>
                            </div>
                            <p style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'Georgia, serif', textShadow: '3px 6px 3px gray',  cursor:'pointer' }} onClick={moveToDoList}>To Do List</p>
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
                            <button type="submit" 
                                className="btn btn-outline-dark" 
                                style={{borderRadius:'10px', color: '#393939', fontWeight: 'bold',}}
                            >SEARCH
                            </button> 
                            
                        </form>
                        <div className="input-group" style={{width:'120px', marginLeft:'480px',}}>
                            <select onChange={selectSort} className="form-select" id="inputGroupSelect04" aria-label="Example select with button addon" style={{borderRadius:'10px',border: '1px solid gray', backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>
                                <option value="date">날짜순</option>
                                <option value="name">가나다순</option>
                                <option value="reg">등록순</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-center ">
                            <ul className="list-group " style={{alignItems:'center'}} >
                                <p/>
                                <div style={{ maxHeight: '400px', overflowY: 'auto' ,}}>
                                    {toDos.length > 0 ?
                                        toDos.map((item) => (
                                            <div style={{marginRight:'10px'}} key={item.id}>
                                                <SearchList 
                                                id={item.id}
                                                content={item.content}
                                                completed={item.completed}
                                                userid={id}
                                                onSearch={onSearch}
                                                special={item.special}
                                                time={item.time}
                                                date={item.date} 
                                                />
                                            </div>
                                        )) :
                                        <div style={{ textAlign: 'center', }}>조회된 일정이 없습니다</div>
                                    }
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
                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ marginTop: '250px' , }}>
                    <div className="modal-dialog" style={{ display: 'flex', justifyContent: 'center' , }} >
                        <div className="modal-content" style={{ borderRadius: '40px' , }} >
                            <div style={{ textAlign: 'center',  }}>
                                <br />
                                <FiAlertTriangle style={{fontSize:'40px'}}/>
                                <p />
                                <div style={{}}>
                                    모든 일정을 정말 다 지우시겠어요?<br />
                                    맞다면 확인, 아니라면 취소를 눌러주세요
                                </div>
                                <p />
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" style={{ width: '150px', height: '40px', borderRadius: '20px' }}>취소</button>
                                &nbsp;
                                <button type="button" className="btn btn-danger" style={{ width: '150px', height: '40px' ,  borderRadius: '20px'}} data-bs-dismiss="modal" onClick={allRemove}>확인</button>
                                <p />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ToDosSearch;