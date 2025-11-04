import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import api from "../api/apiConfig"; 

const DEFAULT_HOTEL_ID = 1; 
// Khai báo hằng số cho quyền truy cập, chỉ cho phép 'MANAGER' truy cập trang
const ALLOWED_ROLES = ['MANAGER']; 

const ServiceManagement = () => {
    
    // Lấy vai trò người dùng hiện tại
    const currentUserRole = localStorage.getItem('userRole');
    // Cờ kiểm tra quyền quản lý (để ẩn/hiện nút)
    const canManageServices = ALLOWED_ROLES.includes(currentUserRole);

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // State cho Service
    const [currentService, setCurrentService] = useState({
        id: null,
        code: "",
        name: "",
        description: "",
        price: "", // Dùng string để dễ dàng nhập liệu trong form
    });

    // Hàm định dạng giá tiền
    const formatPrice = (price) => {
        if (price === null || price === undefined) return '';
        const numberPrice = parseFloat(price);
        if (isNaN(numberPrice)) return price;
        // Định dạng tiền tệ Việt Nam (₫)
        return numberPrice.toLocaleString("vi-VN") + " ₫";
    };

    // Hàm tải danh sách dịch vụ
    const fetchServices = async () => {
        // Nếu đã có lỗi quyền truy cập thì không gọi API nữa
        if (error && error.includes('không có quyền truy cập')) return;
        
        setLoading(true);
        setError(null);
        try {
            // Endpoint API cho Service
            const response = await api.get("/service");
            // ĐÃ SỬA: Loại bỏ .data để lấy trực tiếp nội dung phản hồi (body)
            const data = response || response.content || response; 
            setServices(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("Không thể tải danh sách Dịch vụ. Lỗi API hoặc quyền truy cập.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Kiểm tra quyền truy cập cấp trang
        if (!ALLOWED_ROLES.includes(currentUserRole)) {
            setError('Bạn không có quyền truy cập trang Quản lý Dịch vụ. Yêu cầu vai trò MANAGER.');
            setLoading(false);
            return;
        }
        fetchServices();
    }, [currentUserRole]); 

    // Mở Modal (đã bỏ kiểm tra quyền trong hàm này)
    const openModal = (service = null) => {
        if (service) {
            setIsEditing(true);
            setCurrentService({
                ...service,
                // Chuyển BigDecimal price sang string để hiển thị trong input number
                price: service.price?.toString() || "" 
            });
        } else {
            setIsEditing(false);
            setCurrentService({
                id: null, code: "", name: "", description: "", price: ""
            });
        }
        setError(null);
        setShowModal(true);
    };

    // Đóng Modal
    const closeModal = () => {
        setShowModal(false);
        setError(null); 
    };


    // Xử lý Gửi form (Thêm mới/Cập nhật)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!canManageServices) {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }
        
        // Kiểm tra dữ liệu bắt buộc
        if (!currentService.code || !currentService.name) {
            setError("Mã dịch vụ và Tên dịch vụ là bắt buộc!");
            toast.error("Vui lòng nhập đủ thông tin bắt buộc.");
            return;
        }
        const priceValue = parseFloat(currentService.price);
        if (isNaN(priceValue) || priceValue < 0) {
            setError("Giá (Price) phải là một số không âm!");
            toast.error("Vui lòng nhập Giá hợp lệ.");
            return;
        }


        try {
            const dataToSend = {
                ...currentService,
                price: priceValue,
                // Thêm hotel id vào dataToSend (backend yêu cầu)
                hotel: { id: DEFAULT_HOTEL_ID } 
            };
            
            if (!isEditing) delete dataToSend.id; 

            if (isEditing) {
                // PUT request: /api/service/{id}
                await api.put(`/service/${dataToSend.id}`, dataToSend);
                toast.success("✅ Cập nhật dịch vụ thành công!");
            } else {
                // POST request: /api/service
                await api.post("/service", dataToSend);
                toast.success("➕ Thêm mới dịch vụ thành công!");
            }
            closeModal();
            fetchServices();
        } catch (err) {
            console.error("Chi tiết lỗi API:", err); 
            let errorMessage = "Lỗi không xác định. Vui lòng thử lại.";
            
            // Nếu API trả về lỗi có message (từ ErrorResponse trong Controller)
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message; 
            } else if (err.message) {
                errorMessage = err.message;
            }
            toast.error(`❌ Lỗi khi lưu: ${errorMessage}`);
            setError(`Lỗi khi lưu: ${errorMessage}`);
        }
    };

    // Xử lý Xóa dịch vụ
    const handleDelete = async (id, name) => {
        if (!canManageServices) {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }

        // Thay window.confirm bằng Modal tùy chỉnh nếu cần, theo hướng dẫn chung
        if (!window.confirm(`Bạn có chắc muốn xóa dịch vụ "${name}" này?`)) return;
        try {
            await api.delete(`/service/${id}`);
            toast.info(`🗑️ Đã xóa dịch vụ "${name}" thành công!`);
            fetchServices();
        } catch (err) {
            const errorMessage = err.message || "Không thể xóa.";
            toast.error(`❌ Lỗi khi xóa: ${errorMessage}`);
        }
    };

    // Hiển thị lỗi quyền truy cập cấp trang
    if (error && error.includes('không có quyền truy cập') && !canManageServices) {
        return <p className="text-danger text-center mt-5" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Lỗi: {error}</p>;
    }


    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-primary">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <h3 className="mb-4 text-center text-primary">Quản lý Dịch vụ (Tiện ích) 🛎️</h3>

            {error && !showModal && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            {/* Chỉ hiển thị nút Thêm dịch vụ mới nếu có quyền */}
            {canManageServices && (
                <Button variant="success" className="mb-3 shadow-sm" onClick={() => openModal()}>
                    ➕ Thêm dịch vụ mới
                </Button>
            )}


            <div className="shadow-sm rounded table-responsive">
                <Table bordered hover className="bg-white" style={{ minWidth: '700px' }}> 
                    <thead>
                        <tr className="table-primary">
                            <th className="text-center text-nowrap" style={{ width: '50px' }}>ID</th>
                            <th className="text-nowrap" style={{ width: '100px' }}>Mã DV</th>
                            <th className="text-nowrap" style={{ width: '180px' }}>Tên Dịch vụ</th>
                            <th className="text-end text-nowrap" style={{ width: '120px' }}>Giá</th>
                            <th>Mô tả</th>
                            <th className="text-center text-nowrap" style={{ width: '100px' }}>Ngày tạo</th>
                            {/* Chỉ hiển thị cột Hành động nếu có quyền */}
                            {canManageServices && <th className="text-center text-nowrap" style={{ width: '140px' }}>Hành động</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {services.length > 0 ? (
                            services.map((service) => (
                                <tr key={service.id}>
                                    <td className="text-center text-muted">{service.id}</td>
                                    <td className="fw-bold">{service.code}</td>
                                    <td>{service.name}</td>
                                    <td className="text-end fw-bold text-success">{formatPrice(service.price)}</td>
                                    <td>{service.description?.substring(0, 70) + (service.description?.length > 70 ? '...' : '')}</td>
                                    <td className="text-center text-muted">
                                        {/* Hiển thị ngày tạo, có thể rút gọn nếu cần */}
                                        {new Date(service.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    {/* Chỉ hiển thị nút Sửa/Xóa nếu có quyền */}
                                    {canManageServices && (
                                        <td className="text-center">
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => openModal(service)}
                                            >Sửa</Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(service.id, service.name)}
                                            >Xóa</Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={canManageServices ? "7" : "6"} className="text-center py-4 text-muted">
                                        Không có dịch vụ nào được tìm thấy.
                                    </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {canManageServices && (
                <Modal show={showModal} onHide={closeModal}>
                    <Modal.Header closeButton className={isEditing ? "bg-warning text-white" : "bg-primary text-white"}>
                        <Modal.Title>{isEditing ? "Sửa Dịch vụ" : "Thêm Dịch vụ mới"}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form.Group className="mb-3">
                                <Form.Label>Tên Dịch vụ <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentService.name}
                                    onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Mã dịch vụ (Code) <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentService.code}
                                    onChange={(e) => setCurrentService({ ...currentService, code: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Giá (VND) <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    value={currentService.price}
                                    onChange={(e) => setCurrentService({ ...currentService, price: e.target.value })}
                                    required
                                    min="0"
                                />
                            </Form.Group>
                        
                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={currentService.description}
                                    onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                                />
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeModal}>Hủy</Button>
                            <Button type="submit" variant={isEditing ? "warning" : "primary"}>
                                {isEditing ? "Lưu thay đổi" : "Thêm mới"}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            )}

        </div>
    );
};

export default ServiceManagement;