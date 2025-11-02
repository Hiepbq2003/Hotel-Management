import React, { useState, useEffect } from 'react';
import api from '../api/apiConfig'; 

const ADMIN_ROLES = ['ADMIN', 'MANAGER', 'RECEPTION', 'HOUSEKEEPING'];
const MANAGER_ROLES = ['RECEPTION', 'HOUSEKEEPING'];

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserRole = localStorage.getItem('userRole');

    useEffect(() => {
        if (currentUserRole !== 'ADMIN' && currentUserRole !== 'MANAGER') {
            setError('Bạn không có quyền truy cập trang Quản lý Người dùng.');
            setLoading(false);
            return;
        }
        fetchUsers();
    }, [currentUserRole]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/user/staff'); 
            // Cẩn thận hơn, đảm bảo data là mảng, hoặc bạn sẽ cần optional chaining ở phần render
            setUsers(response.data); 
            setLoading(false);
        } catch (err) {
            setError('Không thể tải danh sách người dùng. Lỗi API hoặc quyền truy cập.');
            setLoading(false);
        }
    };
    const canEdit = (targetUserRole) => {
        if (currentUserRole === 'ADMIN') {
            return true;
        }
        if (currentUserRole === 'MANAGER') {
            return targetUserRole === 'RECEPTION' || targetUserRole === 'HOUSEKEEPING';
        }
        return false;
    };
    
    const getEditableRoles = (targetUserRole) => {
        if (currentUserRole === 'ADMIN') {
            return ADMIN_ROLES;
        }
        if (currentUserRole === 'MANAGER') {
            // Manager chỉ có thể gán/chỉnh sửa trong phạm vi: RECEPTION và HOUSEKEEPING
            if (MANAGER_ROLES.includes(targetUserRole)) {
                return MANAGER_ROLES;
            }
        }
        return [];
    };

    // Cập nhật tạm thời Role trong State khi người dùng chọn trong Dropdown
    const handleRoleChange = (userId, newRole) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
        ));
    };

    // Gửi yêu cầu cập nhật Role lên Backend
    const handleUpdateRole = async (userToUpdate) => {
        const userId = userToUpdate.id;
        const newRole = userToUpdate.role; // Lấy role đã chọn từ state
        // Cần kiểm tra users tồn tại trước khi dùng find
        const targetUserRole = users?.find(u => u.id === userId)?.role; 

        if (!canEdit(targetUserRole)) {
            alert("Lỗi: Bạn không có quyền thay đổi vai trò này.");
            return;
        }
        
        try {
            // Backend sẽ thực hiện kiểm tra bảo mật (Admin/Manager logic) một lần nữa
            await api.put(`/user/${userId}/role`, { role: newRole }, {
                headers: {
                    // Truyền Role của người gọi để Backend kiểm tra quyền
                    'X-User-Role': currentUserRole 
                }
            });
            alert(`Cập nhật vai trò cho ${userToUpdate.fullName} thành ${newRole} thành công!`);
            fetchUsers(); // Tải lại danh sách
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                               ? err.response.data 
                               : "Lỗi server hoặc không có quyền truy cập.";
            alert(`Lỗi khi cập nhật vai trò: ${errorMessage}`);
            fetchUsers(); // Tải lại để khôi phục trạng thái cũ
        }
    };

    if (loading) return <p>Đang tải danh sách người dùng...</p>;
    if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

    return (
        <div className="user-management-container">
            <h1>Quản lý Tài khoản Nhân viên</h1>
            <p>Quyền hạn của bạn: <strong>{currentUserRole}</strong></p>
            
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ và Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user) => { // Đã thêm Optional Chaining (?)
                        // Xác định khả năng chỉnh sửa dựa trên logic Admin/Manager
                        const editable = canEdit(user.role); 
                        const rolesToDisplay = getEditableRoles(user.role);

                        return (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>
                                    {editable ? (
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        >
                                            {rolesToDisplay.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <strong>{user.role}</strong>
                                    )}
                                </td>
                                <td>
                                    {editable && (
                                        <button 
                                            onClick={() => handleUpdateRole(user)}
                                            className="btn-update"
                                            style={{backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}
                                        >
                                            Cập nhật Role
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default UserManagement;