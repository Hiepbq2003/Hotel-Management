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
    Badge 
} from 'react-bootstrap'; 
import api from '../api/apiConfig'; 

// --- Constants ---
const ADMIN_ROLES = ['ADMIN', 'MANAGER', 'RECEPTION', 'HOUSEKEEPING'];
const MANAGER_ROLES = ['RECEPTION', 'HOUSEKEEPING'];

function UserManagement() {
    // --- State Hooks ---
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserRole = localStorage.getItem('userRole');

    // --- Side Effects (Initial Load & Permission Check) ---
    useEffect(() => {
        if (currentUserRole !== 'ADMIN' && currentUserRole !== 'MANAGER') {
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
            const response = await api.get('/user/staff'); 
            setUsers(response || []); 
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
        if (currentUserRole === 'ADMIN') {
            return true;
        }
        if (currentUserRole === 'MANAGER') {
            return targetUserRole === 'RECEPTION' || targetUserRole === 'HOUSEKEEPING';
        }
        return false;
    };
    
    const getEditableRoles = () => {
        if (currentUserRole === 'ADMIN') {
            return ADMIN_ROLES;
        }
        if (currentUserRole === 'MANAGER') {
            return MANAGER_ROLES;
        }
        return [];
    };

    // --- Event Handlers ---
    const handleRoleChange = (userId, newRole) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
        ));
    };

    const handleUpdateRole = async (userToUpdate) => {
        const userId = userToUpdate.id;
        const newRole = userToUpdate.role;
        const originalUser = users.find(u => u.id === userId);

        if (!originalUser || !canEdit(originalUser.role)) {
            alert("Lỗi: Bạn không có quyền thay đổi vai trò của người dùng này.");
            return;
        }
        
        try {
            await api.put(`/user/${userId}/role`, { role: newRole }, {
                headers: {
                    'X-User-Role': currentUserRole 
                }
            });
            alert(`Cập nhật vai trò cho ${userToUpdate.fullName} thành ${newRole} thành công!`);
            fetchUsers();
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                                ? err.response.data.message || "Lỗi server hoặc không có quyền truy cập."
                                : "Lỗi không xác định khi cập nhật vai trò.";
            alert(`Lỗi khi cập nhật vai trò: ${errorMessage}`);
            fetchUsers();
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
                <Col md={8} className="text-center"> 
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

            {!error && users.length === 0 && (
                <Alert variant="info" className="text-center">
                    <p className="mb-0">Danh sách nhân viên trống.</p>
                </Alert>
            )}

            {!error && users.length > 0 && (
                <div className="table-responsive">
                    <Table striped bordered hover className="align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ và Tên</th>
                                <th>Email</th>
                                <th style={{width: '200px'}}>Vai trò</th>
                                <th style={{width: '150px'}} className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                const editable = canEdit(user.role); 
                                
                                return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {editable ? (
                                                <Form.Select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={editableRoles.length === 0}
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
                                                <Button 
                                                    variant="success" 
                                                    size="sm"
                                                    onClick={() => handleUpdateRole(user)}
                                                >
                                                    Lưu Role
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            )}
            
            <Row className="mt-4">
                <Col className="text-end">
                    <Button variant="outline-primary" onClick={fetchUsers}>
                        <i className="bi bi-arrow-clockwise me-2"></i> Tải lại danh sách
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default UserManagement;