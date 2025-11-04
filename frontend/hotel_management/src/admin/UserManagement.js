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
const ALLOWED_ACCESS_ROLES = ['ADMIN']; 
const ALL_STAFF_ROLES = ['ADMIN', 'MANAGER', 'RECEPTION', 'HOUSEKEEPING'];

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

// Hàm trích xuất lỗi chi tiết
const getErrorMessage = (err) => {
    if (err.response && err.response.data) {
        // Kiểm tra nếu body là string (lỗi SecurityException/IllegalArgumentException)
        if (typeof err.response.data === 'string') {
            return err.response.data;
        }
        // Nếu là JSON (thường là lỗi validation 400)
        if (err.response.data.message) {
             return err.response.data.message;
        }
    }
    return "Lỗi không xác định hoặc lỗi kết nối mạng.";
};


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

        // Gửi UserRequest DTO (bao gồm hotelId: null để khớp BE)
        handleCreate({ 
            fullName, 
            email, 
            username, 
            password, 
            role: role, 
            phone,
            hotelId: null // Bắt buộc phải có để khớp DTO tạo mới ở BE
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

        // Payload chỉ chứa các trường thuộc StaffUpdateRequest
        const updatedFields = {
            fullName: formData.fullName,
            phone: formData.phone,
            role: formData.role 
        };
        
        // Truyền updatedFields vào handleSave.
        handleSave(user.id, updatedFields); 
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
                            // Không cho phép thay đổi vai trò của Admin
                            disabled={user.role === 'ADMIN'}
                        >
                            {editableRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Form.Select>
                        {user.role === 'ADMIN' && <Form.Text className="text-muted">Không thể thay đổi vai trò của tài khoản Admin.</Form.Text>}
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
        
        // Kiểm tra quyền hạn ở FE trước khi gửi
        if (user.role === 'ADMIN') {
            setError('Không thể thay đổi trạng thái của tài khoản Admin.');
            return;
        }

        // Gửi trạng thái dưới dạng UPPERCASE (newStatus) để khớp với Java Enum.
        const statusToSend = newStatus; 
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
                        disabled={user.role === 'ADMIN'}
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </Form.Select>
                    {user.role === 'ADMIN' && <Form.Text className="text-danger">Không thể thay đổi trạng thái của tài khoản Admin.</Form.Text>}
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleInternalSave} disabled={user.role === 'ADMIN'}>
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
    
    // Lấy giá trị ban đầu cho hiển thị và kiểm tra quyền
    const currentUserRole = localStorage.getItem('userRole') ? localStorage.getItem('userRole').toUpperCase() : '';
    // Đảm bảo currentUserId là số nếu cần so sánh.
    const currentUserId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null; 

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
            const response = await api.get('/user/staff'); 
            const processedUsers = (response || []).map(user => ({
                ...user,
                // Đảm bảo ID là số nguyên để so sánh sau này
                id: parseInt(user.id), 
                role: user.role.toUpperCase(),
                status: user.status.toUpperCase()
            }));
            setUsers(processedUsers); 
            setError(null);
        } catch (err) {
            console.error("Lỗi tải người dùng:", err);
            const errorMessage = getErrorMessage(err);
            setError(`Không thể tải danh sách người dùng. ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };
    
    // --- Permission & Role Logic (Fixed to block ALL Admin edits) ---
    const isCurrentUserAdmin = currentUserRole === 'ADMIN';

    const canEdit = (targetUserRole, targetUserId) => {
        if (!isCurrentUserAdmin) return false;
        // Chặn hoàn toàn việc chỉnh sửa/vô hiệu hóa bất kỳ tài khoản Admin nào.
        if (targetUserRole === 'ADMIN') return false; 
        return true; 
    };
    
    const getEditableRoles = () => {
        if (isCurrentUserAdmin) {
            return ALL_STAFF_ROLES.filter(role => role !== 'ADMIN');
        }
        return [];
    };

    // --- CRUD Handlers (Finalized for new DTOs) ---

    // CREATE Logic
    const handleCreateUser = async (formData) => {
        const role = localStorage.getItem('userRole') ? localStorage.getItem('userRole').toUpperCase() : '';
        if (!role) {
            alert("Lỗi xác thực: Không tìm thấy vai trò người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        try {
            // Dùng UserRequest DTO (bao gồm username, email, password, hotelId: null)
            await api.post('/user', formData, {
                 headers: {
                    'X-User-Role': role 
                 }
            });
            
            alert(`Tạo tài khoản nhân viên ${formData.fullName} thành công!`);
            fetchUsers(); 
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            alert(`Lỗi khi tạo người dùng: ${errorMessage}`);
        }
    };
    
    // EDIT Details (Tên/SĐT/Vai trò) Logic
    const handleEditDetails = async (userId, updatedFields) => {
        const role = localStorage.getItem('userRole') ? localStorage.getItem('userRole').toUpperCase() : '';
        if (!role) {
            alert("Lỗi xác thực: Không tìm thấy vai trò người dùng. Vui lòng đăng nhập lại.");
            setShowEditModal(false);
            return;
        }
        
        // **FIXED: CHỈ GỬI StaffUpdateRequest DTO (fullName, phone, role)**
        const staffUpdatePayload = {
            fullName: updatedFields.fullName,
            phone: updatedFields.phone,
            role: updatedFields.role,
        };

        try {
            // API call sử dụng StaffUpdateRequest
            await api.put(`/user/${userId}/details`, staffUpdatePayload, {
                headers: {
                    'X-User-Role': role
                }
            });
            alert(`Cập nhật thông tin người dùng ID ${userId} thành công!`);
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            alert(`Lỗi khi cập nhật chi tiết: ${errorMessage}`);
            setShowEditModal(false);
        }
    };
    
    // UPDATE Status (Inactive/Blocked) Logic
    const handleUpdateStatus = async (userId, newStatus) => {
        const role = localStorage.getItem('userRole') ? localStorage.getItem('userRole').toUpperCase() : '';
        if (!role) {
            alert("Lỗi xác thực: Không tìm thấy vai trò người dùng. Vui lòng đăng nhập lại.");
            setShowStatusModal(false);
            return;
        }

        try {
            // Payload cho API /status chỉ cần { newStatus }
            await api.put(`/user/${userId}/status`, { newStatus }, {
                headers: {
                    'X-User-Role': role 
                }
            });
            alert(`Cập nhật trạng thái người dùng ID ${userId} thành ${newStatus} thành công!`);
            setShowStatusModal(false);
            fetchUsers();
        } catch (err) {
            const errorMessage = getErrorMessage(err);
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
                    <Alert.Heading>Lỗi Truy Cập/Tải Dữ Liệu</Alert.Heading>
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
            
            {!error && !isCurrentUserAdmin && (
                <Alert variant="warning" className="text-center">
                    Bạn không có quyền thực hiện các thao tác quản lý.
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
                                <th>Trạng thái</th> 
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
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
                                                <Badge bg="secondary" title="Không thể chỉnh sửa hoặc thay đổi trạng thái của tài khoản Admin">Không thể sửa</Badge>
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
