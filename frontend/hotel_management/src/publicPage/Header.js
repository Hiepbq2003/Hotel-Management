import React from 'react';
import { Container, Nav, Navbar, Dropdown, Row, Col } from "react-bootstrap";
import { FaPhoneAlt, FaUser, FaFacebookF, FaTwitter, FaInstagram, FaTripadvisor } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');

    const isLoggedIn = !!token;
    const displayName = fullName || email || 'User';

    const STAFF_ROLES = ['admin', 'manager', 'reception', 'housekeeping'];
    const isStaff = isLoggedIn && userRole && STAFF_ROLES.includes(userRole.toLowerCase());

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

    const handleGoToWorkspace = () => {
        if (!userRole) return;
        const role = userRole.toLowerCase();
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'manager') navigate('/manager/dashboard');
        else if (role === 'reception') navigate('/reception/check-in');
        else if (role === 'housekeeping') navigate('/housekeeping/dashboard');
        else navigate('/profile'); // customer
    };

    return (
        <header>
            {/* Top bar info */}
            <Row className='justify-content-center' style={{
                borderBottom: "1px solid #e0e0e0",
            }}>
                <Col md={9} >
                    <div>
                        <Container>
                            <Row className="align-items-center" >
                                {/* Left Info */}
                                <Col lg={6}>
                                    <ul
                                        style={{
                                            display: "flex",
                                            gap: "20px",
                                            listStyle: "none",
                                            margin: 0,
                                            color: "#333",
                                            padding: "14px 0"
                                        }}
                                    >
                                        <li style={{ display: "flex", alignItems: "center", gap: "6px", paddingRight: "30px" }}>
                                            <FaPhoneAlt style={{ fontSize: "15px" }} /> (12) 345 67890
                                        </li>

                                        <li style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "0px" }}>
                                            <TbMailFilled style={{ fontSize: "15px" }} /> info.colorlib@gmail.com
                                        </li>
                                    </ul>
                                </Col>

                                {/* Right Info */}
                                <Col lg={6} className="text-end">
                                    <div
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "25px",
                                        }}
                                    >
                                        {/* Social Icons */}
                                        <div>
                                            {[FaFacebookF, FaTwitter, FaTripadvisor, FaInstagram].map((Icon, i) => (
                                                <a
                                                    key={i}
                                                    href="#"
                                                    style={{
                                                        color: "#333",
                                                        marginRight: "15px",
                                                        fontSize: "1.1rem",
                                                        transition: "color 0.3s",
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--main-color)")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
                                                >
                                                    <Icon />
                                                </a>
                                            ))}
                                        </div>

                                        {/* Booking Button */}
                                        <a
                                            href="#"
                                            style={{
                                                backgroundColor: "var(--main-color)",
                                                color: "#fff",
                                                padding: "14px 24px",
                                                paddingTop: "16px",
                                                fontWeight: 500,
                                                textDecoration: "none",
                                                height: "auto"
                                            }}
                                        >
                                            BOOKING NOW
                                        </a>

                                        {/* User Dropdown */}
                                        <Dropdown align="end">
                                            <Dropdown.Toggle
                                                id="user-dropdown"
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#333",
                                                    fontWeight: 500,
                                                    padding: "14px 0"
                                                }}
                                            >
                                                <FaUser style={{ marginBottom: "7px" }} /> {displayName}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {!isLoggedIn ? (
                                                    <Dropdown.Item onClick={() => navigate('/login')}>Sign In / Sign Up</Dropdown.Item>
                                                ) : (
                                                    <>
                                                        <Dropdown.Item onClick={() => navigate('/profile')}>Profile</Dropdown.Item>
                                                        {isLoggedIn && (
                                                            <Dropdown.Item
                                                                onClick={handleGoToWorkspace}
                                                                style={{ color: "var(--main-color)", fontWeight: "bold" }}
                                                            >
                                                                🏢 Go to Workspace
                                                            </Dropdown.Item>
                                                        )}
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
                                                    </>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Col>
            </Row>
            {/* Main Navigation */}
            <Row className='justify-content-center' style={{ backgroundColor: "white", borderBottom: "1px solid #eee" }}>
                <Col lg={9} >
                    <Navbar expand="lg" >
                        <Container>
                            <Navbar.Brand href="#home" style={{ fontWeight: "bold", fontSize: "1.4rem", textTransform: "uppercase" }}>
                                ✨<span style={{ color: '#FFBF58' }}>Stella</span > Horizon
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="ms-auto">
                                    {["Home", "Rooms", "News", "About Us", "Shop", "Contact"].map((item, i) => (
                                        <Nav.Link
                                            key={i}
                                            href={"#" + item.toLowerCase()}
                                            style={{
                                                color: "#333",
                                                marginLeft: "20px",
                                                fontWeight: 500,
                                                transition: "color 0.3s",
                                                paddingBottom: "2px"
                                            }}
                                            onMouseEnter={(e) => (e.target.style.borderBottom = "2px solid var(--main-color)")}
                                            onMouseLeave={(e) => (e.target.style.borderBottom = "none")}
                                        >
                                            {item}
                                        </Nav.Link>
                                    ))}
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </Col>
            </Row>

        </header>
    );
};

export default Header;
