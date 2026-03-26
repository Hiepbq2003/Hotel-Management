import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaHome } from 'react-icons/fa';

const WorkspaceHeader = () => {
    const navigate = useNavigate();

    // Read from individual localStorage keys (set by SignIn.js)
    const fullName = localStorage.getItem('fullName') || '';
    const userRole = localStorage.getItem('userRole') || '';

    const displayName = fullName || userRole || 'User';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('fullName');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('userId');
        localStorage.removeItem('customerId');
        navigate('/login');
    };


    return (
        <Navbar bg="white" expand="lg" className="shadow-sm p-3 mb-4 bg-white rounded" style={{ height: "70px" }}>
            <Container fluid>
                <Navbar.Brand className="fw-bold" style={{ color: "#FFBF58", fontSize: "1.4rem" }}>
                    ✨ Stella Horizon Workspace
                </Navbar.Brand>
                <Nav className="ms-auto d-flex align-items-center">
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            id="user-dropdown"
                            style={{ background: "none", border: "none", color: "#333", fontWeight: 500 }}
                            className="d-flex align-items-center shadow-none"
                        >
                            <FaUserCircle size={24} className="me-2 text-primary" />
                            <span>{displayName}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => navigate('/profile')}>
                                👤 View Profile
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate('/home')}>
                                <FaHome className="me-2" />
                                Go to Home Page
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout} className="text-danger">
                                🚪 Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default WorkspaceHeader;
