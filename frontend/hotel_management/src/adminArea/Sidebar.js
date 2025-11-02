// Giả định: File này đã được đổi tên thành Sidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaHotel, FaUsers, FaBed, FaSignOutAlt } from 'react-icons/fa';

// Nhận role qua props
const Sidebar = ({ role }) => { 
    const location = useLocation(); 
    
    // 1. Xác định basePath dựa trên role
    const basePath = role === 'ADMIN' ? '/admin' : '/manager';
    // 2. Xác định các role có quyền thấy link quản lý người dùng
    const canManageUsers = role === 'ADMIN' || role === 'MANAGER';
    // 3. Xác định các role có quyền thấy link quản lý loại phòng
    const canManageRoomTypes = role === 'ADMIN' || role === 'MANAGER'; 
    // Nếu bạn muốn giới hạn RoomType chỉ cho Manager như route cũ: 
    // const canManageRoomTypes = role === 'MANAGER'; 

    return (
        <div style={{ width: '250px', height: '100vh', position: 'fixed', zIndex: 1000 }} className="bg-dark text-white shadow">
            
            <h4 className="p-3 text-center border-bottom border-secondary text-warning">
                {role} Dashboard
            </h4>

            <Nav className="flex-column p-2">
                
                {/* Dashboard */}
                <Nav.Link 
                    as={Link} 
                    to={`${basePath}/dashboard`} // <-- Dùng basePath
                    className={`text-white ${location.pathname === `${basePath}/dashboard` ? 'bg-primary rounded' : ''}`}
                >
                    <FaTachometerAlt className="me-2" /> Dashboard
                </Nav.Link>

                <hr className="bg-secondary my-2" />
                
                {/* Quản lý Khách sạn (Giả định chỉ Admin/Manager) */}
                {(role === 'ADMIN' || role === 'MANAGER') && (
                    <Nav.Link 
                        as={Link} 
                        to={`${basePath}/hotels`} // <-- Dùng basePath
                        className={`text-white ${location.pathname === `${basePath}/hotels` ? 'bg-primary rounded' : ''}`}
                    >
                        <FaHotel className="me-2" /> Quản lý Khách sạn
                    </Nav.Link>
                )}


                {/* Quản lý Loại phòng */}
                {canManageRoomTypes && (
                    <Nav.Link 
                        as={Link} 
                        to={`${basePath}/room-types`} 
                        className={`text-white ${location.pathname === `${basePath}/room-types` ? 'bg-primary rounded' : ''}`}
                    >
                        <FaBed className="me-2" /> Quản lý Loại phòng
                    </Nav.Link>
                )}

                {/* Quản lý Người dùng */}
                {canManageUsers && (
                    <Nav.Link 
                        as={Link} 
                        to={`${basePath}/user-management`} 
                        className={`text-white ${location.pathname === `${basePath}/user-management` ? 'bg-primary rounded' : ''}`} // <-- Đã sửa logic active
                    >
                        <FaUsers className="me-2" /> Quản lý Người dùng
                    </Nav.Link>
                )}
                  {canManageUsers && (
                    <Nav.Link 
                        as={Link} 
                        to={`${basePath}/customer-management`}
                        className={`text-white ${location.pathname === `${basePath}/customer-management` ? 'bg-primary rounded' : ''}`} // <-- Đã sửa logic active
                    >
                        <FaUsers className="me-2" /> Quản lý Khách hàng
                    </Nav.Link>
                )}

                <hr className="bg-secondary my-2" />

                {/* Logout */}
                <Nav.Link 
                    onClick={() => { console.log('Đăng xuất...'); }}
                    className="text-danger mt-3"
                >
                    <FaSignOutAlt className="me-2" /> Đăng xuất
                </Nav.Link>

            </Nav>
        </div>
    );
};

export default Sidebar;