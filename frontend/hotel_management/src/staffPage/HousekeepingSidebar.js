import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks } from 'react-icons/fa'; 

const HousekeepingSidebar = () => {
    const location = useLocation(); 

    return (
        <div style={{ width: '250px', height: '100vh', position: 'fixed', zIndex: 1000 }} className="bg-dark text-white shadow">

            <h4 className="p-3 text-center border-bottom border-secondary text-warning">
                Housekeeping
            </h4>

            <Nav className="flex-column p-2">
                <Nav.Link 
                    as={Link} 
                    to="/housekeeping/dashboard" 
                    className={`text-white ${location.pathname === '/housekeeping/dashboard' ? 'bg-primary rounded' : ''}`}
                >
                    <FaTasks className="me-2" /> Task Dashboard
                </Nav.Link>
            </Nav>
        </div>
    );
};

export default HousekeepingSidebar;
