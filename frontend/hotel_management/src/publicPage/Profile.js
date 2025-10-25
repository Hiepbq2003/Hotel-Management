import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Modal, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiConfig'; // Giả định đường dẫn này là đúng
import { FaUserCircle, FaEnvelope, FaIdBadge, FaUser, FaPhoneAlt, FaLock, FaEdit } from 'react-icons/fa'; 
import Breadcrumbs from '../components/Breadcrumbs'; 

const Profile = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        fullName: 'Loading...',
        email: 'Loading...',
        phone: 'Loading...', 
        role: 'GUEST',
        isLoggedIn: false
    });
    
    // State quản lý Modal
    const [showProfileModal, setShowProfileModal] = useState(false); // Modal cho Tên và SĐT
    const [showPasswordModal, setShowPasswordModal] = useState(false); // Modal cho Mật khẩu
    
    // State cho form chỉnh sửa Profile (Name, Phone)
    const [editProfileForm, setEditProfileForm] = useState({ fullName: '', phone: '' });
    // State cho form đổi Mật khẩu
    const [newPassword, setNewPassword] = useState({ current: '', new: '', confirm: '' });

    // --- Data Fetching ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        
        // Lấy thông tin từ localStorage
        const storedFullName = localStorage.getItem('fullName') || 'Guest User';
        const storedEmail = localStorage.getItem('email') || 'N/A';
        const storedPhone = localStorage.getItem('phone') || 'Chưa cập nhật'; 
        
        setUserInfo({
            fullName: storedFullName,
            email: storedEmail,
            phone: storedPhone,
            role: role || 'CUSTOMER',
            isLoggedIn: !!token
        });

        // Bắt buộc đăng nhập
        if (!token) {
             navigate('/login'); 
        }
    }, [navigate]);

    // Hàm định dạng vai trò
    const formatRole = (role) => {
        if (!role) return 'Customer';
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    };
    
    // --- HANDLERS ---

    // Mở Modal chỉnh sửa Profile và gán giá trị hiện tại
    const handleShowProfileModal = () => {
        setEditProfileForm({ 
            fullName: userInfo.fullName, 
            phone: userInfo.phone === 'Chưa cập nhật' ? '' : userInfo.phone 
        });
        setShowProfileModal(true);
    };

    // Xử lý đổi Tên và Số điện thoại (MOCK API)
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        
        const { fullName, phone } = editProfileForm;
        
        if (!fullName.trim()) {
            alert("Tên không được để trống.");
            return;
        }

        // *** MOCK API CALL (Thay thế bằng api.put('/user/profile', { fullName, phone }) ) ***
        
        // Cập nhật localStorage và state
        localStorage.setItem('fullName', fullName.trim());
        localStorage.setItem('phone', phone.trim());
        
        setUserInfo(prev => ({ 
            ...prev, 
            fullName: fullName.trim(),
            phone: phone.trim() || 'Chưa cập nhật'
        }));
        
        setShowProfileModal(false);
        alert("Cập nhật thông tin thành công!");
    };

    // Xử lý Đổi Mật khẩu (API Call)
    const handlePasswordChange = async (e) => { 
        e.preventDefault();
        const { current, new: newPass, confirm } = newPassword;
        const email = userInfo.email; 

        if (newPass !== confirm) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }
        if (newPass.length < 6) {
            alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }
        if (newPass === current) {
             alert("Mật khẩu mới phải khác mật khẩu hiện tại.");
             return;
        }
        
        try {
            await api.post('/auth/change-password', { 
                email: email, 
                currentPassword: current, 
                newPassword: newPass 
            });

            // Xử lý thành công: Đăng xuất người dùng
            setShowPasswordModal(false);
            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            
            localStorage.clear();
            navigate('/login'); 

        } catch (error) {
            const errorMessage = error.message || "Đã xảy ra lỗi khi đổi mật khẩu.";
            alert(`Lỗi: ${errorMessage}`);
        }
        
        setNewPassword({ current: '', new: '', confirm: '' });
    };

    // --- RENDER ---
    
    return (
        <>
            <Breadcrumbs title="User Profile" page="Profile" />
            <Container style={{ paddingTop: '50px', paddingBottom: '100px' }}>
                <Row className="justify-content-center">
                    <Col lg={8} md={10}>
                        <Card className="shadow-sm">
                            <Card.Header 
                                className="text-center text-white" 
                                style={{ 
                                    backgroundColor: 'var(--main-color)', 
                                    padding: '20px', 
                                    fontSize: '1.5rem', 
                                    fontWeight: '600'
                                }}
                            >
                                <FaUserCircle style={{ marginRight: '10px' }} />
                                Thông tin tài khoản
                            </Card.Header>
                            <Card.Body>
                                {/* Họ và Tên */}
                                <Row className="py-3 border-bottom align-items-center">
                                    <Col xs={4} className="text-muted fw-bold">
                                        <FaIdBadge style={{ marginRight: '10px', color: '#FFBF58' }} />
                                        Họ và Tên:
                                    </Col>
                                    <Col xs={8}>
                                        {userInfo.fullName}
                                    </Col>
                                </Row>

                                {/* Email */}
                                <Row className="py-3 border-bottom align-items-center">
                                    <Col xs={4} className="text-muted fw-bold">
                                        <FaEnvelope style={{ marginRight: '10px', color: '#FFBF58' }} />
                                        Email:
                                    </Col>
                                    <Col xs={8}>
                                        {userInfo.email}
                                    </Col>
                                </Row>
                                
                                {/* SỐ ĐIỆN THOẠ */}
                                <Row className="py-3 border-bottom align-items-center">
                                    <Col xs={4} className="text-muted fw-bold">
                                        <FaPhoneAlt style={{ marginRight: '10px', color: '#FFBF58' }} />
                                        Số điện thoại:
                                    </Col>
                                    <Col xs={8}>
                                        {userInfo.phone}
                                    </Col>
                                </Row>

                                {/* Vai trò */}
                                <Row className="py-3 align-items-center">
                                    <Col xs={4} className="text-muted fw-bold">
                                        <FaUser style={{ marginRight: '10px', color: '#FFBF58' }} />
                                        Vai trò:
                                    </Col>
                                    <Col xs={8}>
                                        <Badge bg="info">
                                            {formatRole(userInfo.role)}
                                        </Badge>
                                    </Col>
                                </Row>
                                
                                {/* ACTION BUTTONS */}
                                <div className="d-grid gap-2 mt-4">
                                    <Button variant="primary" onClick={handleShowProfileModal}>
                                        <FaEdit style={{ marginRight: '8px' }} /> Chỉnh sửa thông tin
                                    </Button>
                                    <Button variant="warning" onClick={() => setShowPasswordModal(true)}>
                                        <FaLock style={{ marginRight: '8px' }} /> Đổi Mật Khẩu
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            
            {/* Modal Chỉnh sửa Profile (Tên + SĐT) */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin cá nhân</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleProfileUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ và Tên</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={editProfileForm.fullName} 
                                onChange={(e) => setEditProfileForm({...editProfileForm, fullName: e.target.value})} 
                                required 
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={editProfileForm.phone} 
                                onChange={(e) => setEditProfileForm({...editProfileForm, phone: e.target.value})} 
                                placeholder="Nhập số điện thoại"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mt-2">
                            Lưu Thay Đổi
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            
            {/* Modal Đổi Mật Khẩu */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title><FaLock style={{ marginBottom: '3px', marginRight: '5px' }} /> Đổi Mật Khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePasswordChange}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu hiện tại</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={newPassword.current}
                                onChange={(e) => setNewPassword({...newPassword, current: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={newPassword.new}
                                onChange={(e) => setNewPassword({...newPassword, new: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={newPassword.confirm}
                                onChange={(e) => setNewPassword({...newPassword, confirm: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Button variant="warning" type="submit" className="w-100">
                            Xác Nhận Đổi Mật Khẩu
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Profile;