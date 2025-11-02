import React, { useState, useEffect } from 'react';
import api from '../api/apiConfig'; 


const ALLOWED_ROLES = ['ADMIN', 'MANAGER']; 
const STATUS_OPTIONS = ['active', 'inactive', 'blocked'];

function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserRole = localStorage.getItem('userRole'); 
    useEffect(() => {
        // 1. Kiểm tra quyền truy cập
        if (!ALLOWED_ROLES.includes(currentUserRole)) {
            setError('Bạn không có quyền truy cập trang Quản lý Tài khoản Khách hàng.');
            setLoading(false);
            return;
        }
        fetchCustomers();
    }, [currentUserRole]);

    // 2. Tải danh sách khách hàng
    const fetchCustomers = async () => {
        try {
            // Gọi API mới để lấy danh sách khách hàng
            const response = await api.get('/customer'); 
            setCustomers(response.data); 
            setLoading(false);
        } catch (err) {
            console.error("Lỗi khi tải danh sách khách hàng:", err);
            setError('Không thể tải danh sách khách hàng. Lỗi API hoặc quyền truy cập.');
            setLoading(false);
        }
    };

    // 3. Logic xác định khả năng chỉnh sửa
    const canEditStatus = () => {
        return ALLOWED_ROLES.includes(currentUserRole);
    };

    // 4. Cập nhật tạm thời Status trong State
    const handleStatusChange = (customerId, newStatus) => {
        setCustomers(customers.map(customer => 
            customer.id === customerId ? { ...customer, status: newStatus } : customer
        ));
    };

    // 5. Gửi yêu cầu cập nhật Status lên Backend
    const handleUpdateStatus = async (customerToUpdate) => {
        const customerId = customerToUpdate.id;
        const newStatus = customerToUpdate.status; 

        if (!canEditStatus()) {
            alert("Lỗi: Bạn không có quyền thay đổi trạng thái này.");
            return;
        }
        
        try {
            // Gọi API cập nhật trạng thái khách hàng
            await api.put(`/customer/${customerId}/status`, { newStatus: newStatus });
            
            alert(`Cập nhật trạng thái cho ${customerToUpdate.fullName} thành ${newStatus} thành công!`);
            fetchCustomers(); 
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                               ? err.response.data 
                               : "Lỗi server hoặc không có quyền truy cập.";
            alert(`Lỗi khi cập nhật trạng thái: ${errorMessage}`);
            fetchCustomers(); 
        }
    };

    if (loading) return <p>Đang tải danh sách tài khoản khách hàng...</p>;
    if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

    return (
        <div className="customer-management-container">
            <h1>Quản lý Tài khoản Khách hàng</h1>
            <p>Quyền hạn của bạn: <strong>{currentUserRole}</strong></p>
            
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ và Tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {customers?.map((customer) => { 
                        const editable = canEditStatus(); 

                        return (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.fullName}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>
                                    {editable ? (
                                        <select
                                            value={customer.status}
                                            onChange={(e) => handleStatusChange(customer.id, e.target.value)}
                                        >
                                            {STATUS_OPTIONS.map(status => (
                                                <option key={status} value={status}>{status.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <strong>{customer.status?.toUpperCase()}</strong>
                                    )}
                                </td>
                                <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    {editable && (
                                        <button 
                                            onClick={() => handleUpdateStatus(customer)}
                                            className="btn-update"
                                            style={{backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}
                                        >
                                            Cập nhật Status
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

export default CustomerManagement;