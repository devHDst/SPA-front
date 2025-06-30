import React,{ useState } from "react";
import "../css/Menu.css"
import Stack from "@mui/material/Stack";
import Introduction from "./Introduction.tsx";
import Order from "./Order.tsx";
import Reservation from "./Reservation.tsx";
import Access from "./Access.tsx";


const Menu = ()=> {
    const [open, setOpen] = useState(false);

    const toggleMenu = () =>{
        setOpen(!open);
    };

    return(
        <>
            <div className="hamburger-icon" onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            <nav className={`side-menu ${open ? 'open' : ''}`}>
                <Stack spacing={1}>
                    <Introduction/>
                    <Order/>
                    <Reservation/>
                    <Access/>
                </Stack>
            </nav>

            {open && <div className="overlay" onClick={toggleMenu}></div>}
        </>
    );
}
export default Menu;