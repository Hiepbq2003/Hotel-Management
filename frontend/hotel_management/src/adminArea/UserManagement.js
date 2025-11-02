import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Row, 
    Col, 
    Table, 
    Spinner, 
    Alert, 
    Button, 
    Form, 
    Badge,
    Modal 
} from 'react-bootstrap'; 
import api from '../api/apiConfig'; 

// --- Constants ---
const ALLOWED_ACCESS_ROLES = ['ADMIN', 'MANAGER']; // Roles allowed to access this management page
const ALL_STAFF_ROLES = ['ADMIN', 'MANAGER', 'RECEPTION', 'HOUSEKEEPING'];

// =================================================================================
// 1. CREATE USER MODAL (Thêm mới nhân viên)
// =================================================================================

function CreateUserModal({ show, handleClose, handleCreate, editableRoles }) {
    // Đảm bảo role khởi tạo là role đầu tiên trong danh sách editable, hoặc mặc định là RECEPTION nếu danh sách rỗng
    const initialRole = editableRoles.length > 0 ? editableRoles[0] : 'RECEPTION';
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: initialRole
    });
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        if (show) {
            // Reset form khi mở Modal
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: editableRoles.length > 0 ? editableRoles[0] : 'RECEPTION'
            });
            setValidationError('');
        }
    }, [show, editableRoles]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setValidationError('');
    };

    const handleInternalCreate = (e) => {
        e.preventDefault();
        
        const { fullName, email, password, confirmPassword, role } = formData;

        // 1. Check required fields
        if (!fullName || !email || !password || !confirmPassword || !role) {
            setValidationError('Vui lòng điền đầy đủ Tên, Email, Mật khẩu và Vai trò.');
            return;
        }

        // 2. Password match check
        if (password !== confirmPassword) {
            setValidationError('Mật khẩu và Xác nhận Mật khẩu không khớp.');
            return;
        }
        
        // 3. Email format check
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setValidationError('Email không hợp lệ.');
            return;
        }

        // 4. Password format check (chỉ cần 6 ký tự số)
        if (!/^\d{6}$/.test(password)) {
             setValidationError('Mật khẩu phải là 6 ký tự số.');
             return;
        }

        handleCreate(formData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>➕ Thêm Tài khoản Nhân viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleInternalCreate}>
                    {validationError && <Alert variant="danger">{validationError}</Alert>}
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Họ và Tên (*)</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email (*)</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Vai trò (*)</Form.Label>
                        <Form.Select 
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            {editableRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu (6 ký tự số) (*)</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu (6 số)"
                            maxLength={6}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Xác nhận Mật khẩu (*)</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Xác nhận mật khẩu (6 số)"
                            maxLength={6}
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleInternalCreate}>
                    Tạo Tài Khoản
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

// =================================================================================
// MAIN COMPONENT: UserManagement
// =================================================================================

function UserManagement() {
    // --- State Hooks ---
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Đảm bảo role được lấy ra là chuỗi UPPERCASE để so sánh nhất quán
    const currentUserRole = localStorage.getItem('userRole');

    // States cho Modal
    const [showCreateModal, setShowCreateModal] = useState(false);

    // --- Side Effects (Initial Load & Permission Check) ---
    useEffect(() => {
        if (!ALLOWED_ACCESS_ROLES.includes(currentUserRole)) {
            setError('Bạn không có quyền truy cập trang Quản lý Người dùng.');
            setLoading(false);
            return;
        }
        fetchUsers();
    }, [currentUserRole]);

    // --- Data Fetching Logic ---
    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Giả định API /user/staff trả về danh sách nhân viên
            const response = await api.get('/user/staff'); 
            // Cập nhật state, đảm bảo response.data được xử lý nếu cần
            setUsers(response.data || response || []); 
            setError(null);
        } catch (err) {
            console.error("Lỗi tải người dùng:", err);
            setError('Không thể tải danh sách người dùng. Lỗi API hoặc quyền truy cập.');
        } finally {
            setLoading(false);
        }
    };
    
    // --- Permission & Role Logic ---
    const canEdit = (targetUserRole) => {
        // ADMIN có thể chỉnh sửa tất cả (trừ chính ADMIN)
        if (currentUserRole === 'ADMIN') {
            return targetUserRole !== 'ADMIN';
        }
        // MANAGER KHÔNG THỂ chỉnh sửa ADMIN hoặc MANAGER khác, chỉ có thể chỉnh sửa RECEPTION và HOUSEKEEPING
        if (currentUserRole === 'MANAGER') {
            return targetUserRole === 'RECEPTION' || targetUserRole === 'HOUSEKEEPING';
        }
        return false;
    };
    
    const getEditableRoles = () => {
        if (currentUserRole === 'ADMIN') {
            // ADMIN có thể tạo/chuyển đổi sang MANAGER, RECEPTION, HOUSEKEEPING
            // Loại bỏ ADMIN khỏi danh sách role có thể gán
            return ALL_STAFF_ROLES.filter(role => role !== 'ADMIN');
        }
        if (currentUserRole === 'MANAGER') {
            // MANAGER chỉ có thể tạo/chuyển đổi sang RECEPTION và HOUSEKEEPING
            return ['RECEPTION', 'HOUSEKEEPING'];
        }
        return [];
    };

    // --- CRUD Handlers ---

    // Handler cho việc thay đổi role trong Form.Select
    const handleRoleChangeInTable = (userId, newRole) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
        ));
    };

    // CREATE Logic
    const handleCreateUser = async ({ fullName, email, password, role }) => {
        try {
            // Giả định API cho tạo mới là POST /user/staff
            // Vì backend yêu cầu username, ta giả định username là email (có thể thay đổi)
            await api.post('/user/staff', { 
                fullName, 
                email, 
                username: email.split('@')[0], // Tạo username từ email
                password, 
                role 
            });
            
            alert(`Tạo tài khoản nhân viên ${fullName} (${role}) thành công!`);
            setShowCreateModal(false);
            fetchUsers(); 
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                                ? typeof err.response.data === 'string' ? err.response.data : "Lỗi server hoặc email đã tồn tại."
                                : "Lỗi không xác định khi tạo người dùng.";
            alert(`Lỗi khi tạo người dùng: ${errorMessage}`);
        }
    };

    // UPDATE Role Logic (Inline Save)
    const handleUpdateRole = async (userToUpdate) => {
        const userId = userToUpdate.id;
        const newRole = userToUpdate.role;
        const originalUser = users.find(u => u.id === userId);

        if (!originalUser || !canEdit(originalUser.role)) {
            alert("Lỗi: Bạn không có quyền thay đổi vai trò của người dùng này.");
            return;
        }
        
        try {
            // Giả định API cho cập nhật vai trò là PUT /user/{userId}/role
            // Cần gửi header X-User-Role cho backend kiểm tra quyền
            await api.put(`/user/${userId}/role`, { role: newRole }, {
                headers: {
                    'X-User-Role': currentUserRole 
                }
            });
            alert(`Cập nhật vai trò cho ${userToUpdate.fullName} thành ${newRole} thành công!`);
            fetchUsers();
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                                ? typeof err.response.data === 'string' ? err.response.data : "Lỗi server hoặc không có quyền truy cập."
                                : "Lỗi không xác định khi cập nhật vai trò.";
            alert(`Lỗi khi cập nhật vai trò: ${errorMessage}`);
            fetchUsers();
        }
    };

    // DELETE Logic
    const handleDeleteUser = async (userId, fullName) => {
        // Kiểm tra quyền dựa trên role HIỆN TẠI của người dùng được chọn
        const targetUserRole = users.find(u => u.id === userId)?.role;
        if (!canEdit(targetUserRole)) {
             alert("Bạn không có quyền xóa tài khoản này.");
             return;
        }

        if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản nhân viên: ${fullName} (ID: ${userId})?`)) {
            try {
                // Giả định API cho xóa là DELETE /user/{userId}
                await api.delete(`/user/${userId}`); 
                alert(`Xóa nhân viên ${fullName} thành công!`);
                fetchUsers();
            } catch (err) {
                const errorMessage = err.response && err.response.data 
                                        ? typeof err.response.data === 'string' ? err.response.data : "Lỗi server hoặc không có quyền truy cập."
                                        : "Lỗi không xác định khi xóa khách hàng.";
                alert(`Lỗi khi xóa nhân viên: ${errorMessage}`);
            }
        }
    };

    // --- Helper for Role Badge ---
    const getRoleVariant = (role) => {
        switch (role) {
            case 'ADMIN': return 'danger';
            case 'MANAGER': return 'warning';
            case 'RECEPTION': return 'info';
            case 'HOUSEKEEPING': return 'primary';
            default: return 'secondary';
        }
    }

    // --- Render Logic ---
    const editableRoles = getEditableRoles();

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Đang tải...</span>
                </Spinner>
                <p className="mt-3">Đang tải danh sách người dùng...</p>
            </Container>
        );
    }

    return (
        <Container className="my-5">
        
            <Row className="mb-4 justify-content-center"> 
                <Col md={10} className="text-center"> 
                    <h2 className="text-primary display-6 fw-bold">👨‍💼 Quản lý Tài khoản Nhân viên</h2>
                    <p className="lead">
                        Quyền hạn hiện tại của bạn: <Badge bg={getRoleVariant(currentUserRole)} className="fs-6">{currentUserRole}</Badge>
                    </p>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4">
                    <Alert.Heading>Lỗi Truy Cập</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            )}

            {!error && (
                <Row className="mb-3">
                    <Col className="d-flex justify-content-between">
                        {/* Nút Thêm Mới */}
                        <Button 
                            variant="success" 
                            onClick={() => setShowCreateModal(true)} 
                            disabled={editableRoles.length === 0}
                        >
                            <i className="bi bi-person-plus-fill me-2"></i> Thêm Nhân viên Mới
                        </Button>
                        <Button variant="outline-primary" onClick={fetchUsers}>
                            <i className="bi bi-arrow-clockwise me-2"></i> Tải lại danh sách
                        </Button>
                    </Col>
                </Row>
            )}

            {!error && users.length === 0 && (
                <Alert variant="info" className="text-center">
                    <p className="mb-0">Danh sách nhân viên trống.</p>
                </Alert>
            )}

            {!error && users.length > 0 && (
                <div className="table-responsive">
                    <Table striped bordered hover className="align-middle shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Họ và Tên</th>
                                <th>Email</th>
                                <th style={{width: '200px'}}>Vai trò</th>
                                <th style={{width: '200px'}} className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                // Kiểm tra quyền chỉnh sửa
                                const editable = canEdit(user.role); 
                                
                                // Quyết định xem có nên hiển thị role selector hay chỉ là Badge
                                const showRoleSelector = editable && editableRoles.includes(user.role);

                                return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {showRoleSelector ? (
                                                <Form.Select
                                                    value={user.role}
                                                    // Chỉ hiển thị các role mà người dùng hiện tại có quyền chỉnh sửa
                                                    onChange={(e) => handleRoleChangeInTable(user.id, e.target.value)}
                                                    size="sm"
                                                >
                                                    {editableRoles.map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </Form.Select>
                                            ) : (
                                                <Badge bg={getRoleVariant(user.role)} className="py-2 px-3">{user.role}</Badge>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {editable && (
                                                <>
                                                    <Button 
                                                        variant="success" 
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleUpdateRole(user)}
                                                        title="Lưu vai trò mới"
                                                    >
                                                        <i className="bi bi-floppy-fill"></i> Lưu Role
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user.id, user.fullName)}
                                                        title="Xóa tài khoản nhân viên"
                                                    >
                                                        <i className="bi bi-trash-fill"></i> Xóa
                                                    </Button>
                                                </>
                                            )}
                                            {!editable && (
                                                <Badge bg="secondary">Không thể sửa</Badge>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            )}
            
            {/* Modal Thêm Nhân viên Mới */}
            <CreateUserModal 
                show={showCreateModal}
                handleClose={() => setShowCreateModal(false)}
                handleCreate={handleCreateUser}
                editableRoles={editableRoles}
            />
        </Container>
    );
}

export default UserManagement;
