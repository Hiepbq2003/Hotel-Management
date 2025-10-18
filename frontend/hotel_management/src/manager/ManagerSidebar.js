import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaHotel, FaUsers, FaBed, FaSignOutAlt } from 'react-icons/fa'; // Cần cài đặt react-icons


const ManagerSidebar = () => {
    const location = useLocation(); 

    return (
      
        <div style={{ width: '250px', height: '100vh', position: 'fixed', zIndex: 1000 }} className="bg-dark text-white shadow">
            
            <h4 className="p-3 text-center border-bottom border-secondary text-warning">
                Quản lý Hệ thống
            </h4>

            <Nav className="flex-column p-2">
                
                {/* Dashboard */}
                <Nav.Link 
                    as={Link} 
                    to="/manager/dashboard" 
                    className={`text-white ${location.pathname === '/manager/dashboard' ? 'bg-primary rounded' : ''}`}
                >
                    <FaTachometerAlt className="me-2" /> Dashboard
                </Nav.Link>

                <hr className="bg-secondary my-2" />
                
                {/* Quản lý Khách sạn */}
                <Nav.Link 
                    as={Link} 
                    to="/manager/hotels" 
                    className={`text-white ${location.pathname === '/manager/hotels' ? 'bg-primary rounded' : ''}`}
                >
                    <FaHotel className="me-2" /> Quản lý Khách sạn
                </Nav.Link>

                {/* Quản lý Loại phòng (Ví dụ: dùng endpoint của bạn) */}
                <Nav.Link 
                    as={Link} 
                    to="/manager/room-types" 
                    className={`text-white ${location.pathname === '/manager/room-types' ? 'bg-primary rounded' : ''}`}
                >
                    <FaBed className="me-2" /> Quản lý Loại phòng
                </Nav.Link>

                {/* Quản lý Người dùng */}
                <Nav.Link 
                    as={Link} 
                    to="/manager/users" 
                    className={`text-white ${location.pathname === '/manager/users' ? 'bg-primary rounded' : ''}`}
                >
                    <FaUsers className="me-2" /> Quản lý Người dùng
                </Nav.Link>

                <hr className="bg-secondary my-2" />

                {/* Logout */}
                <Nav.Link 
                    onClick={() => { console.log('Đăng xuất...'); }} // Thay bằng logic logout thực tế
                    className="text-danger mt-3"
                >
                    <FaSignOutAlt className="me-2" /> Đăng xuất
                </Nav.Link>

            </Nav>
        </div>
    );
};

export default ManagerSidebar;