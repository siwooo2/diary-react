import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



function NaviPage(){

    const [time, setTime] = useState(new Date());
    
    useEffect(()=>{
        const intervalTime = setInterval(()=>{
            setTime(new Date());
        },1000)

        return () => clearInterval(intervalTime);

    },[])

    

    return(
        <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark" >
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" style={{
                    color: 'white',
                    fontFamily: 'Georgia, serif'}}><h2>Diary</h2>
                </Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav d-flex flex-row w-100">
                        {/* <li className="nav-item">
                            <Link className="nav-link" to="/todolist">ToDoList</Link>
                        </li> */}

                        <li className="nav-item ms-auto">
                                <span className="nav-link" style={{fontSize:'20px'}}>{time.toLocaleTimeString()}</span>
                        </li>

                        
                    
                    </ul>
                
                </div>
            </div>
        </nav>
    )
}

export default NaviPage;