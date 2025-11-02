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
// Cập nhật để chỉ cho phép ADMIN truy cập và quản lý
const ALLOWED_ACCESS_ROLES = ['ADMIN']; 
const ALL_STAFF_ROLES = ['ADMIN', 'MANAGER', 'RECEPTION', 'HOUSEKEEPING'];

// Hàm chuyển đổi vai trò/trạng thái (Role/Status) từ chữ hoa sang chữ thường cho API
const toSnakeCaseRole = (role) => role ? role.toLowerCase() : null;

// --- Helper Functions for UI ---

const getRoleVariant = (role) => {
    switch (role) {
        case 'ADMIN': return 'danger';
        case 'MANAGER': return 'warning';
        case 'RECEPTION': return 'info';
        case 'HOUSEKEEPING': return 'primary';
        default: return 'secondary';
    }
}

const getStatusVariant = (status) => {
    switch (status) {
        case 'ACTIVE': return 'success';
        case 'INACTIVE': return 'secondary';
        case 'BLOCKED': return 'danger';
        default: return 'secondary';
    }
}

// =================================================================================
// 1. CREATE USER MODAL (Thêm mới nhân viên)
// =================================================================================

function CreateUserModal({ show, handleClose, handleCreate, editableRoles }) {
    const initialRole = editableRoles.length > 0 ? editableRoles[0] : 'RECEPTION';
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
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
                phone: '',
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
        
        const { fullName, email, password, confirmPassword, role, phone } = formData;

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

        // Tạo username từ email (giả định)
        const username = email.split('@')[0];

        handleCreate({ 
            fullName, 
            email, 
            username, 
            password, 
            role: toSnakeCaseRole(role), // Chuyển sang chữ thường cho backend
            phone 
        });
        
        // Đóng modal sau khi gửi thành công
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-success text-white">
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
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
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
                <Button variant="success" onClick={handleInternalCreate}>
                    Tạo Tài Khoản
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

// =================================================================================
// 2. EDIT USER MODAL (Chỉnh sửa Tên và Vai trò)
// =================================================================================

function EditUserModal({ show, handleClose, user, handleSave, editableRoles }) {
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        role: user?.role || 'RECEPTION'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                phone: user.phone || '',
                role: user.role || 'RECEPTION'
            });
            setError('');
        }
    }, [user, show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleInternalSave = () => {
        if (!formData.fullName || formData.fullName.trim() === '') {
            setError('Họ và Tên không được để trống.');
            return;
        }

        // Chuyển đổi role về chữ thường cho API
        const dataToSend = {
            fullName: formData.fullName,
            phone: formData.phone,
            role: toSnakeCaseRole(formData.role)
        };
        
        handleSave(user.id, dataToSend);
    };
    
    // Nếu user chưa được chọn hoặc đang loading
    if (!user) return null;

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-warning text-dark">
                <Modal.Title>✏️ Chỉnh sửa Nhân viên: {user.fullName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Họ và Tên</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Vai trò</Form.Label>
                        <Form.Select 
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            {editableRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="warning" onClick={handleInternalSave}>
                    Lưu Thay Đổi
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

// =================================================================================
// 3. UPDATE STATUS MODAL (Chỉnh sửa trạng thái: Active/Inactive/Blocked)
// =================================================================================

function UpdateStatusModal({ show, handleClose, user, handleSave }) {
    const [newStatus, setNewStatus] = useState(user?.status || 'ACTIVE');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setNewStatus(user.status || 'ACTIVE');
            setError('');
        }
    }, [user, show]);

    const handleInternalSave = () => {
        if (newStatus === user.status) {
            setError('Trạng thái mới phải khác trạng thái hiện tại.');
            return;
        }

        // Chuyển đổi status về chữ thường cho API
        const statusToSend = toSnakeCaseRole(newStatus); 
        handleSave(user.id, statusToSend);
    };

    if (!user) return null;

    // Các trạng thái có thể chọn
    const statusOptions = ['ACTIVE', 'INACTIVE', 'BLOCKED'];

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>🔒 Cập nhật Trạng thái Nhân viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>Bạn đang cập nhật trạng thái cho **{user.fullName}**.</p>
                <p>Trạng thái hiện tại: <Badge bg={getStatusVariant(user.status)}>{user.status}</Badge></p>
                
                <Form.Group className="mb-3">
                    <Form.Label>Chọn Trạng thái Mới</Form.Label>
                    <Form.Select
                        value={newStatus}
                        onChange={(e) => {
                            setNewStatus(e.target.value);
                            setError('');
                        }}
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleInternalSave}>
                    Cập nhật Trạng thái
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
    const currentUserRole = localStorage.getItem('userRole') ? localStorage.getItem('userRole').toUpperCase() : '';
    const currentUserId = localStorage.getItem('userId');

    // States cho Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // --- Side Effects (Initial Load & Permission Check) ---
    useEffect(() => {
        if (!ALLOWED_ACCESS_ROLES.includes(currentUserRole)) {
            setError('Bạn không có quyền truy cập trang Quản lý Người dùng. Chỉ Admin mới được truy cập.');
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
            // Đảm bảo role và status là UPPERCASE để hiển thị thống nhất trong FE
            const processedUsers = (response || []).map(user => ({
                ...user,
                role: user.role.toUpperCase(),
                status: user.status.toUpperCase()
            }));
            setUsers(processedUsers); 
            setError(null);
        } catch (err) {
            console.error("Lỗi tải người dùng:", err);
            const errorMessage = err.response && err.response.data 
                                 ? typeof err.response.data === 'string' ? err.response.data : "Lỗi API khi tải danh sách."
                                 : "Không thể tải danh sách người dùng. Lỗi kết nối.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    // --- Permission & Role Logic ---
    const isCurrentUserAdmin = currentUserRole === 'ADMIN';

    const canEdit = (targetUserRole, targetUserId) => {
        // Chỉ ADMIN mới có quyền thực hiện edit trên trang này.
        if (!isCurrentUserAdmin) return false;
        
        // ADMIN không thể chỉnh sửa tài khoản của chính mình.
        // Lưu ý: currentUserId cần được lấy đúng (ví dụ: từ token hoặc state)
        return targetUserId !== currentUserId; 
    };
    
    const getEditableRoles = () => {
        // Admin có thể tạo/chuyển đổi sang bất kỳ role nào trừ ADMIN
        if (isCurrentUserAdmin) {
            return ALL_STAFF_ROLES.filter(role => role !== 'ADMIN');
        }
        return [];
    };

    // --- CRUD Handlers ---

    // CREATE Logic
    const handleCreateUser = async (formData) => {
        try {
            // Yêu cầu Backend kiểm tra quyền Admin
            await api.post('/user', formData, {
                 headers: {
                    'X-User-Role': currentUserRole 
                 }
            });
            
            alert(`Tạo tài khoản nhân viên ${formData.fullName} thành công!`);
            fetchUsers(); 
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                                 ? typeof err.response.data === 'string' ? err.response.data : "Lỗi server hoặc dữ liệu không hợp lệ."
                                 : "Lỗi không xác định khi tạo người dùng.";
            alert(`Lỗi khi tạo người dùng: ${errorMessage}`);
        }
    };
    
    // EDIT Details (Tên/SĐT/Vai trò) Logic
    const handleEditDetails = async (userId, dataToSend) => {
        try {
            await api.put(`/user/${userId}/details`, dataToSend, {
                headers: {
                    'X-User-Role': currentUserRole 
                }
            });
            alert(`Cập nhật thông tin người dùng ID ${userId} thành công!`);
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                                 ? typeof err.response.data === 'string' ? err.response.data : "Lỗi server hoặc không có quyền truy cập."
                                 : "Lỗi không xác định khi cập nhật chi tiết.";
            alert(`Lỗi khi cập nhật chi tiết: ${errorMessage}`);
            setShowEditModal(false);
        }
    };
    
    // UPDATE Status (Inactive/Blocked) Logic
    const handleUpdateStatus = async (userId, newStatus) => {
        try {
            await api.put(`/user/${userId}/status`, { newStatus }, {
                headers: {
                    'X-User-Role': currentUserRole 
                }
            });
            alert(`Cập nhật trạng thái người dùng ID ${userId} thành ${newStatus} thành công!`);
            setShowStatusModal(false);
            fetchUsers();
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                                 ? typeof err.response.data === 'string' ? err.response.data : "Lỗi server hoặc không có quyền truy cập."
                                 : "Lỗi không xác định khi cập nhật trạng thái.";
            alert(`Lỗi khi cập nhật trạng thái: ${errorMessage}`);
            setShowStatusModal(false);
        }
    };

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

            {!error && isCurrentUserAdmin && (
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
            
            {/* Cảnh báo nếu không phải Admin nhưng API vẫn trả về dữ liệu (chỉ xảy ra nếu bỏ qua kiểm tra FE) */}
             {!error && !isCurrentUserAdmin && (
                <Alert variant="warning" className="text-center">
                    Bạn không có quyền thực hiện các thao tác quản lý.
                </Alert>
            )}

            {!error && users.length === 0 && isCurrentUserAdmin && (
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
                                <th>Vai trò</th>
                                <th>Trạng thái</th> {/* Cột Trạng thái */}
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                // Kiểm tra quyền chỉnh sửa (Admin, không phải chính mình)
                                const editable = canEdit(user.role, user.id); 
                                
                                return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Badge bg={getRoleVariant(user.role)} className="py-2 px-3">{user.role}</Badge>
                                        </td>
                                        <td>
                                            <Badge bg={getStatusVariant(user.status)} className="py-2 px-3">{user.status}</Badge>
                                        </td>
                                        <td className="text-center">
                                            {editable ? (
                                                <>
                                                    <Button 
                                                        variant="warning" 
                                                        size="sm"
                                                        className="me-2 text-white"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowEditModal(true);
                                                        }}
                                                        title="Chỉnh sửa Tên và Vai trò"
                                                    >
                                                        <i className="bi bi-pencil-square"></i> Edit
                                                    </Button>
                                                    <Button 
                                                        variant="primary" 
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowStatusModal(true);
                                                        }}
                                                        title="Cập nhật trạng thái"
                                                    >
                                                        <i className="bi bi-person-fill-lock"></i> Trạng thái
                                                    </Button>
                                                </>
                                            ) : (
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
            
            {/* Modal Chỉnh sửa Chi tiết (Tên và Role) */}
            <EditUserModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                user={selectedUser}
                handleSave={handleEditDetails}
                editableRoles={editableRoles}
            />

            {/* Modal Chỉnh sửa Trạng thái */}
            <UpdateStatusModal
                show={showStatusModal}
                handleClose={() => setShowStatusModal(false)}
                user={selectedUser}
                handleSave={handleUpdateStatus}
            />
        </Container>
    );
}

export default UserManagement;
