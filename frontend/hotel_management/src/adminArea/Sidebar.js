import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaHotel,
    FaUsers,
    FaBed,
    FaConciergeBell,
    FaLayerGroup,
} from 'react-icons/fa';

const Sidebar = ({ role }) => {
    const userRole = role ? role.toUpperCase() : '';
    const location = useLocation();

    const isAdmin = userRole === 'ADMIN';
    const isManager = userRole === 'MANAGER';
    const isManagerOrAdmin = isAdmin || isManager;

    const basePath = isAdmin ? '/admin' : (isManager ? '/manager' : '');

    if (!isManagerOrAdmin) return null;

    const navLink = (to, icon, label) => (
        <Nav.Link
            as={Link}
            to={to}
            className={`text-white px-3 py-2 rounded ${location.pathname === to ? 'bg-primary' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}
        >
            {icon} {label}
        </Nav.Link>
    );

    return (
        <div style={{ width: '250px', height: '100vh', position: 'fixed', zIndex: 1000 }} className="bg-dark text-white shadow">
            <h4 className="p-3 text-center border-bottom border-secondary text-warning">
                {userRole} Dashboard
            </h4>

            <Nav className="flex-column p-2">
                {/* Common for both Admin & Manager */}
                {navLink(`${basePath}/dashboard`, <FaTachometerAlt />, 'Dashboard')}

                <hr className="bg-secondary my-2" />

                {/* Admin-only */}
                {isAdmin && navLink(`${basePath}/room-management`, <FaBed />, 'Room Management')}
                {navLink(`${basePath}/customer-management`, <FaUsers />, 'Customer Management')}

                {/* Manager-only */}
                {isManager && navLink(`${basePath}/amenities`, <FaConciergeBell />, 'Hotel Amenities')}
                {isManager && navLink(`${basePath}/service-management`, <FaHotel />, 'Service Management')}
                {isManager && navLink(`${basePath}/room-types`, <FaLayerGroup />, 'Room Types')}
                {isManager && navLink(`${basePath}/user-management`, <FaUsers />, 'Staff Management')}
                <hr className="bg-secondary my-2" />

            </Nav>
        </div>
    );
};

export default Sidebar;
