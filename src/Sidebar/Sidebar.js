import { Dashboard } from '@material-ui/icons';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../Sidebar/Sidebar.css';
import Logo from './logo.png';
import { SidebarData } from './SidebarData';

function Sidebar(props) {
    const {admin} = props;
    return (
        <div className="Sidebar">
            <div className="brand"><img style={{height:'100px', width:'100px'}} src={Logo} alt="Logo" /></div>
            <ul className="SidebarList">
                {SidebarData(admin).map((val, key) => {
                    return (
                        <NavLink 
                            to={val.link}
                            className="row" 
                            key={key}
                            activeClassName="active"
                        >
                            <div id="icon">{val.icon}</div>
                            <div id="title">
                                {val.title}
                            </div>
                        </NavLink>
                        // <li 
                        // className="row" 
                        // key={key}
                        // id={window.location.pathname === val.link ? "active" : ""}
                        // onClick={() => { window.location.pathname = val.link }}>
                        //     <div id="icon">{val.icon}</div>
                        //     <div id="title">
                        //         {val.title}
                        //     </div>
                        // </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default Sidebar;