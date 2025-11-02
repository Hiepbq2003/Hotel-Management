import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import api from "../api/apiConfig"; 

const DEFAULT_HOTEL_ID = 1; 
// Khai báo hằng số cho quyền truy cập, chỉ cho phép 'MANAGER'
const ALLOWED_ROLES = ['MANAGER']; 

const RoomTypeManagement = () => {
    
    const currentUserRole = localStorage.getItem('userRole');

    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRoom, setCurrentRoom] = useState({
        id: null,
        name: "",
        basePrice: "",
        capacity: "",
        bedInfo: "",
        description: "",
        imageUrl: "",
        code: "" 
    });

    const formatPrice = (price) => {
        if (price === null || price === undefined) return '';
        const numberPrice = parseFloat(price);
        if (isNaN(numberPrice)) return price;
        return numberPrice.toLocaleString("vi-VN") + " ₫";
    };

    const fetchRoomTypes = async () => {
      
        if (error && error.includes('không có quyền truy cập')) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/room-type");
            const data = response.data || response.content || response; 
            setRoomTypes(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("Không thể tải danh sách loại phòng. Lỗi API hoặc quyền truy cập.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Kiểm tra quyền truy cập
        if (!ALLOWED_ROLES.includes(currentUserRole)) {
            setError('Bạn không có quyền truy cập trang Quản lý Loại phòng. Yêu cầu vai trò MANAGER.');
            setLoading(false);
            return;
        }
        fetchRoomTypes();
    }, [currentUserRole]); 

    const canManageRoomTypes = ALLOWED_ROLES.includes(currentUserRole);

    const openModal = (room = null) => {
        
        if (!ALLOWED_ROLES.includes(currentUserRole)) {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }
        
        if (room) {
            setIsEditing(true);
            setCurrentRoom({
                ...room,
                basePrice: room.basePrice?.toString() || "",
                capacity: room.capacity?.toString() || ""
            });
        } else {
            setIsEditing(false);
            setCurrentRoom({
                id: null, name: "", basePrice: "", capacity: "",
                bedInfo: "", description: "", imageUrl: "", code: "" 
            });
        }
        setError(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setError(null); 
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!canManageRoomTypes) {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }
        
        if (!currentRoom.code) {
            setError("Mã loại phòng (Code) là bắt buộc!");
            toast.error("Vui lòng nhập Mã loại phòng.");
            return;
        }

        try {
            const dataToSend = {
                ...currentRoom,
                basePrice: parseFloat(currentRoom.basePrice),
                capacity: parseInt(currentRoom.capacity),
            
                hotel: { id: DEFAULT_HOTEL_ID } 
            };
            
            if (!isEditing) delete dataToSend.id; 

            if (isEditing) {
                await api.put(`/room-type/${dataToSend.id}`, dataToSend);
                toast.success("✅ Cập nhật thành công!");
            } else {
                await api.post("/room-type", dataToSend);
                toast.success("➕ Thêm mới thành công!");
            }
            closeModal();
            fetchRoomTypes();
        } catch (err) {
            console.error("Chi tiết lỗi API:", err); 
            let errorMessage = "Lỗi không xác định. Vui lòng thử lại.";
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message; 
            } else if (err.message) {
                errorMessage = err.message;
            }
            toast.error(`❌ Lỗi khi lưu: ${errorMessage}`);
            setError(`Lỗi khi lưu: ${errorMessage}`);
        }
    };

    const handleDelete = async (id, name) => {
        if (!canManageRoomTypes) {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }

        if (!window.confirm(`Bạn có chắc muốn xóa loại phòng "${name}" này?`)) return;
        try {
            await api.delete(`/room-type/${id}`);
            toast.info(`🗑️ Đã xóa loại phòng "${name}" thành công!`);
            fetchRoomTypes();
        } catch (err) {
            const errorMessage = err.message || "Không thể xóa.";
            toast.error(`❌ Lỗi khi xóa: ${errorMessage}`);
        }
    };

    // Hiển thị lỗi quyền truy cập
    if (error && error.includes('không có quyền truy cập')) {
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

            <h3 className="mb-4 text-center text-primary">Quản lý Loại phòng 🏨</h3>

            {error && !showModal && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            {/* Chỉ hiển thị nút Thêm loại phòng mới nếu có quyền */}
            {canManageRoomTypes && (
                <Button variant="success" className="mb-3 shadow-sm" onClick={() => openModal()}>
                    ➕ Thêm loại phòng mới
                </Button>
            )}


            <div className="shadow-sm rounded table-responsive">
                <Table bordered hover className="bg-white" style={{ minWidth: '800px' }}> 
                    <thead>
                        <tr className="table-primary">
                            <th className="text-center text-nowrap" style={{ width: '50px' }}>ID</th>
                            <th className="text-nowrap" style={{ width: '150px' }}>Tên phòng</th>
                            <th className="text-end text-nowrap" style={{ width: '100px' }}>Giá cơ bản</th>
                            <th className="text-center text-nowrap" style={{ width: '80px' }}>Sức chứa</th>
                            <th className="text-nowrap" style={{ width: '80px' }}>Mã phòng</th>
                            <th className="text-nowrap" style={{ width: '120px' }}>Giường</th>
                            <th>Mô tả</th>
                            <th className="text-center text-nowrap" style={{ width: '100px' }}>Ảnh</th>
                            <th className="text-center text-nowrap" style={{ width: '140px' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomTypes.length > 0 ? (
                            roomTypes.map((room) => (
                                <tr key={room.id}>
                                    <td className="text-center text-muted">{room.id}</td>
                                    <td>{room.name}</td>
                                    <td className="text-end fw-bold text-success">{formatPrice(room.basePrice)}</td>
                                    <td className="text-center">{room.capacity} người</td>
                                    <td className="fw-bold">{room.code}</td>
                                    <td>{room.bedInfo}</td>
                                    <td>{room.description?.substring(0, 50) + (room.description?.length > 50 ? '...' : '')}</td>
                                    <td className="text-center">
                                        <img
                                            src={room.imageUrl || "https://via.placeholder.com/80x60?text=No+Image"}
                                            alt={room.name}
                                            width="80"
                                            height="60"
                                            style={{ objectFit: "cover", borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td className="text-center">
                                         {/* Chỉ hiển thị nút Sửa/Xóa nếu có quyền */}
                                         {canManageRoomTypes ? (
                                             <>
                                                 <Button
                                                     variant="outline-warning"
                                                     size="sm"
                                                     className="me-2"
                                                     onClick={() => openModal(room)}
                                                 >Sửa</Button>
                                                 <Button
                                                     variant="outline-danger"
                                                     size="sm"
                                                     onClick={() => handleDelete(room.id, room.name)}
                                                 >Xóa</Button>
                                             </>
                                         ) : (
                                            <span className="text-muted">Không có quyền</span>
                                         )}
                                        </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4 text-muted">
                                        Không có loại phòng nào được tìm thấy.
                                    </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {canManageRoomTypes && (
                <Modal show={showModal} onHide={closeModal}>
                    <Modal.Header closeButton className={isEditing ? "bg-warning text-white" : "bg-primary text-white"}>
                        <Modal.Title>{isEditing ? "Sửa loại phòng" : "Thêm loại phòng mới"}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form.Group className="mb-3">
                                <Form.Label>Tên phòng</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRoom.name}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Mã loại phòng (Code) <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRoom.code}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, code: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Giá cơ bản (VND)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={currentRoom.basePrice}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, basePrice: e.target.value })}
                                    required
                                    min="0"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Sức chứa (Người)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={currentRoom.capacity}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: e.target.value })}
                                    min="1"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Thông tin giường</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRoom.bedInfo}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, bedInfo: e.target.value })}
                                    placeholder="Ví dụ: 1 King Bed"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={currentRoom.description}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, description: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Ảnh (URL)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRoom.imageUrl}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, imageUrl: e.target.value })}
                                    placeholder="Nhập URL ảnh loại phòng"
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

export default RoomTypeManagement;