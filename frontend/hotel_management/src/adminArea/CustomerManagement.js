import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Row, 
    Col, 
    Table, 
    Spinner, 
    Alert, 
    Button, 
    Badge, 
    Modal, 
    Form 
} from 'react-bootstrap'; 
import api from '../api/apiConfig'; 

// --- Constants ---
const ALLOWED_ROLES = ['ADMIN', 'MANAGER']; 
const STATUS_OPTIONS = ['active', 'inactive', 'blocked'];

// --- Modal Component cho chức năng Thêm/Sửa ---
// Để đơn giản hóa, ta chỉ tập trung vào việc hiển thị Modal cho chức năng Sửa Trạng thái.
function EditCustomerModal({ show, handleClose, customer, statusOptions, handleSave }) {
    const [currentStatus, setCurrentStatus] = useState(customer?.status || '');

    useEffect(() => {
        setCurrentStatus(customer?.status || statusOptions[0]);
    }, [customer, statusOptions]);

    const handleInternalSave = () => {
        if (customer) {
            handleSave(customer.id, currentStatus);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa Khách hàng: {customer?.fullName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {customer && (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" value={customer.email} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái (Status)</Form.Label>
                            <Form.Select 
                                value={currentStatus}
                                onChange={(e) => setCurrentStatus(e.target.value)}
                            >
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status.toUpperCase()}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleInternalSave}>
                    Lưu Thay Đổi
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
// --- Hết Modal Component ---

function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserRole = localStorage.getItem('userRole'); 
    
    // State cho Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        if (!ALLOWED_ROLES.includes(currentUserRole)) {
            setError('Bạn không có quyền truy cập trang Quản lý Tài khoản Khách hàng.');
            setLoading(false);
            return;
        }
        fetchCustomers();
    }, [currentUserRole]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/customer'); 
            setCustomers(response || []); 
            setError(null);
        } catch (err) {
            console.error("Lỗi khi tải danh sách khách hàng:", err);
            setError('Không thể tải danh sách khách hàng. Lỗi API hoặc quyền truy cập.');
        } finally {
            setLoading(false);
        }
    };

    const canEditStatus = () => {
        return ALLOWED_ROLES.includes(currentUserRole);
    };

    // --- Modal Handlers ---
    const handleShowEditModal = (customer) => {
        if (canEditStatus()) {
            setSelectedCustomer(customer);
            setShowEditModal(true);
        } else {
            alert("Bạn không có quyền sửa trạng thái.");
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedCustomer(null);
    };
    
    // --- CRUD Logic (UPDATE) ---
    const handleSaveStatus = async (customerId, newStatus) => {
        const customerToUpdate = customers.find(c => c.id === customerId);

        try {
            await api.put(`/customer/${customerId}/status`, { newStatus: newStatus });
            
            alert(`Cập nhật trạng thái cho ${customerToUpdate.fullName} thành ${newStatus} thành công!`);
            handleCloseEditModal();
            fetchCustomers(); 
        } catch (err) {
            const errorMessage = err.response && err.response.data 
                                ? err.response.data.message || "Lỗi server hoặc không có quyền truy cập."
                                : "Lỗi không xác định khi cập nhật trạng thái.";
            alert(`Lỗi khi cập nhật trạng thái: ${errorMessage}`);
            fetchCustomers(); 
        }
    };

    // --- CRUD Logic (DELETE) ---
    const handleDeleteCustomer = async (customerId, fullName) => {
        if (!canEditStatus()) {
            alert("Bạn không có quyền xóa khách hàng.");
            return;
        }

        if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản khách hàng: ${fullName} (ID: ${customerId})?`)) {
            try {
                // Giả định API cho xóa là DELETE /customer/:id
                await api.delete(`/customer/${customerId}`); 
                alert(`Xóa khách hàng ${fullName} thành công!`);
                fetchCustomers();
            } catch (err) {
                const errorMessage = err.response && err.response.data 
                                    ? err.response.data.message || "Lỗi server hoặc không có quyền truy cập."
                                    : "Lỗi không xác định khi xóa khách hàng.";
                alert(`Lỗi khi xóa khách hàng: ${errorMessage}`);
            }
        }
    };
    
    // --- Helper cho Status Badge ---
    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'secondary';
            case 'blocked': return 'danger';
            default: return 'light';
        }
    }

    // --- Render Logic ---
    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Đang tải...</span>
                </Spinner>
                <p className="mt-3">Đang tải danh sách tài khoản khách hàng...</p>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Row className="mb-4 justify-content-center"> 
                <Col md={8} className="text-center"> 
                    <h2 className="text-info display-6 fw-bold">🧑‍🤝‍🧑 Quản lý Tài khoản Khách hàng</h2>
                    <p className="lead">
                        Quyền hạn hiện tại của bạn: <Badge bg="dark" className="fs-6">{currentUserRole}</Badge>
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
                        {/* Nút Thêm Mới - Hiện tại không có Modal tương ứng, chỉ là nút placeholder */}
                        <Button variant="primary" /* onClick={handleShowCreateModal} */ disabled={!canEditStatus()}>
                            <i className="bi bi-person-plus-fill me-2"></i> Thêm Khách hàng Mới
                        </Button>
                        <Button variant="outline-primary" onClick={fetchCustomers}>
                            <i className="bi bi-arrow-clockwise me-2"></i> Tải lại danh sách
                        </Button>
                    </Col>
                </Row>
            )}

            {!error && customers.length === 0 && (
                <Alert variant="info" className="text-center">
                    <p className="mb-0">Danh sách khách hàng trống.</p>
                </Alert>
            )}

            {!error && customers.length > 0 && (
                <div className="table-responsive">
                    <Table striped bordered hover className="align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ và Tên</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th style={{width: '150px'}}>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th style={{width: '180px'}} className="text-center">Hành động</th>
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
                                            <Badge bg={getStatusVariant(customer.status)} className="py-2 px-3">
                                                {customer.status?.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td className="text-center">
                                            {editable && (
                                                <>
                                                    <Button 
                                                        variant="warning" 
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleShowEditModal(customer)}
                                                    >
                                                        Sửa
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => handleDeleteCustomer(customer.id, customer.fullName)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </>
                                            )}
                                            {!editable && (
                                                <Badge bg="secondary">Không có quyền</Badge>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            )}
            
            {/* Modal Sửa trạng thái khách hàng */}
            {selectedCustomer && (
                <EditCustomerModal 
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    customer={selectedCustomer}
                    statusOptions={STATUS_OPTIONS}
                    handleSave={handleSaveStatus}
                />
            )}
        </Container>
    );
}

export default CustomerManagement;