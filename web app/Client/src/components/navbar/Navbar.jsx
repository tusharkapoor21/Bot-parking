import React from 'react';
import logo from '../../assets/logo.png';
import './Navbar.css'

const Navbar = () => {
    return (
        <nav>
            <img src={logo} alt="Logo" id='nav_logo' />
            <h3>
                Bot Parking
            </h3>

        </nav>
    )
}

export default Navbar




