import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert, Badge } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import api from "../api/apiConfig"; 

const DEFAULT_HOTEL_ID = 1; 
// Chỉ cho phép vai trò 'MANAGER' truy cập trang này (tương tự RoomTypeManagement.js)
const ALLOWED_ROLES = ['MANAGER']; 

// Định nghĩa các trạng thái phòng và màu sắc tương ứng
const ROOM_STATUSES = {
    available: { label: "Sẵn sàng", variant: "success" },
    occupied: { label: "Đang ở", variant: "danger" },
    maintenance: { label: "Bảo trì", variant: "warning" },
    out_of_service: { label: "Ngừng phục vụ", variant: "secondary" }
};

const RoomManagement = () => {
    
    const currentUserRole = localStorage.getItem('userRole');

    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRoom, setCurrentRoom] = useState({
        id: null,
        roomNumber: "",
        roomType: { id: "" }, 
        floor: 1,
        status: "available",
        description: ""
    });

    const getStatusBadge = (status) => {
        const info = ROOM_STATUSES[status] || ROOM_STATUSES.out_of_service;
        return <Badge bg={info.variant}>{info.label}</Badge>;
    };

    // ------------------- FETCH DATA -------------------
    const fetchRooms = async () => {
        setLoading(true);
        setError(null);
        try {
            // Đã sửa: API trả về JSON object trực tiếp
            const response = await api.get("/rooms"); 
            const data = response; // Lấy dữ liệu trực tiếp từ response
            setRooms(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("Không thể tải danh sách phòng. Lỗi API hoặc quyền truy cập.");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchRoomTypes = async () => {
        try {
            // Đã sửa: API trả về JSON object trực tiếp
            const response = await api.get("/room-type");
            const data = response; // Lấy dữ liệu trực tiếp từ response
            setRoomTypes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi khi tải danh sách loại phòng:", err);
            toast.error("Không thể tải danh sách loại phòng.");
        }
    };

    useEffect(() => {
        if (!ALLOWED_ROLES.includes(currentUserRole)) {
            setError('Bạn không có quyền truy cập trang Quản lý Phòng. Yêu cầu vai trò MANAGER.');
            setLoading(false);
            return;
        }
        fetchRooms();
        fetchRoomTypes();
    }, [currentUserRole]); 

    const canManageRooms = ALLOWED_ROLES.includes(currentUserRole);

    // ------------------- MODAL & FORM HANDLERS -------------------
    const openModal = (room = null) => {
        if (!canManageRooms) {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }
        
        if (room) {
            setIsEditing(true);
            setCurrentRoom({
                ...room,
                // Đảm bảo lấy đúng ID của RoomType
                roomType: { id: room.roomType?.id?.toString() || "" }, 
                floor: room.floor?.toString() || "",
                status: room.status || "available"
            });
        } else {
            setIsEditing(false);
            setCurrentRoom({
                id: null, roomNumber: "", roomType: { id: roomTypes[0]?.id?.toString() || "" }, 
                floor: 1, status: "available", description: "" 
            });
        }
        setError(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setError(null); 
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "roomType") {
            setCurrentRoom({ ...currentRoom, roomType: { id: value } });
        } else if (name === "floor") {
             // Đảm bảo Floor là số nguyên
            const floorValue = value ? parseInt(value) : 1;
            setCurrentRoom({ ...currentRoom, [name]: floorValue });
        } else {
            setCurrentRoom({ ...currentRoom, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!canManageRooms) {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }
        
        if (!currentRoom.roomNumber || !currentRoom.roomType.id) {
            setError("Số phòng và Loại phòng là bắt buộc!");
            toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc.");
            return;
        }

        try {
            const dataToSend = {
                ...currentRoom,
                floor: parseInt(currentRoom.floor),
                roomType: { id: parseInt(currentRoom.roomType.id) },
                hotel: { id: DEFAULT_HOTEL_ID } 
            };
            
            // Xóa ID nếu là thao tác thêm mới
            if (!isEditing) delete dataToSend.id; 

            if (isEditing) {
                // PUT request: /api/rooms/{id}
                await api.put(`/rooms/${dataToSend.id}`, dataToSend);
                toast.success(`✅ Cập nhật phòng ${dataToSend.roomNumber} thành công!`);
            } else {
                // POST request: /api/rooms
                await api.post("/rooms", dataToSend);
                toast.success(`➕ Thêm phòng ${dataToSend.roomNumber} mới thành công!`);
            }
            closeModal();
            fetchRooms(); // Tải lại danh sách sau khi thao tác
        } catch (err) {
            console.error("Chi tiết lỗi API:", err); 
            let errorMessage = "Lỗi không xác định. Vui lòng thử lại.";
            
            // Đã sửa: Trích xuất thông báo lỗi trực tiếp từ đối tượng lỗi (JSON object)
            if (err && typeof err === 'object' && err.message) {
                errorMessage = err.message; 
            } else if (typeof err === 'string') {
                 // Trường hợp lỗi chỉ là chuỗi (ví dụ: Network Error)
                errorMessage = err;
            } else if (err instanceof Error) {
                // Trường hợp lỗi là Error object (ví dụ: Request timeout)
                errorMessage = err.message;
            }
            
            toast.error(`❌ Lỗi khi lưu: ${errorMessage}`);
            setError(`Lỗi khi lưu: ${errorMessage}`);
        }
    };

    const handleDelete = async (id, roomNumber) => {
        if (!canManageRooms) {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }

        if (!window.confirm(`Bạn có chắc muốn xóa phòng số "${roomNumber}" này? Thao tác này không thể hoàn tác.`)) return;
        try {
            // DELETE request: /api/rooms/{id}
            await api.delete(`/rooms/${id}`);
            toast.info(`🗑️ Đã xóa phòng số "${roomNumber}" thành công!`);
            fetchRooms(); // Tải lại danh sách
        } catch (err) {
            // Sử dụng logic xử lý lỗi tương tự như handleSubmit
            let errorMessage = err.message || "Không thể xóa. Có thể phòng đang được liên kết với một Reservation.";
            if (err && typeof err === 'object' && err.message) {
                 errorMessage = err.message; 
            }
            toast.error(`❌ Lỗi khi xóa: ${errorMessage}`);
        }
    };

    // ------------------- RENDER -------------------
    if (error && error.includes('không có quyền truy cập')) {
        return <p className="text-danger text-center mt-5" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Lỗi: {error}</p>;
    }

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-primary">Đang tải dữ liệu phòng...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <h3 className="mb-4 text-center text-primary">Quản lý Phòng Khách sạn 🚪</h3>

            {error && !showModal && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            {canManageRooms && (
                <Button variant="success" className="mb-3 shadow-sm" onClick={() => openModal()}>
                    ➕ Thêm phòng mới
                </Button>
            )}


            <div className="shadow-sm rounded table-responsive">
                <Table bordered hover className="bg-white" style={{ minWidth: '800px' }}> 
                    <thead>
                        <tr className="table-primary">
                            <th className="text-center text-nowrap" style={{ width: '50px' }}>ID</th>
                            <th className="text-nowrap" style={{ width: '100px' }}>Số phòng</th>
                            <th className="text-nowrap" style={{ width: '150px' }}>Loại phòng</th>
                            <th className="text-center text-nowrap" style={{ width: '80px' }}>Tầng</th>
                            <th className="text-center text-nowrap" style={{ width: '150px' }}>Trạng thái</th>
                            <th>Mô tả</th>
                            <th className="text-center text-nowrap" style={{ width: '140px' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length > 0 ? (
                            rooms.map((room) => (
                                <tr key={room.id}>
                                    <td className="text-center text-muted">{room.id}</td>
                                    <td className="fw-bold">{room.roomNumber}</td>
                                    <td>{room.roomType?.name || room.roomType?.code || 'N/A'}</td>
                                    <td className="text-center">{room.floor}</td>
                                    <td className="text-center">
                                        {getStatusBadge(room.status)}
                                    </td>
                                    <td>{room.description?.substring(0, 50) + (room.description?.length > 50 ? '...' : '')}</td>
                                    <td className="text-center">
                                         {canManageRooms ? (
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
                                                     onClick={() => handleDelete(room.id, room.roomNumber)}
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
                                <td colSpan="7" className="text-center py-4 text-muted">
                                    Không có phòng nào được tìm thấy.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Modal Form */}
            {canManageRooms && (
                <Modal show={showModal} onHide={closeModal}>
                    <Modal.Header closeButton className={isEditing ? "bg-warning text-white" : "bg-primary text-white"}>
                        <Modal.Title>{isEditing ? "Sửa thông tin Phòng" : "Thêm Phòng mới"}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form.Group className="mb-3">
                                <Form.Label>Số phòng <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="roomNumber"
                                    value={currentRoom.roomNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Loại phòng <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="roomType"
                                    value={currentRoom.roomType.id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">-- Chọn Loại Phòng --</option>
                                    {roomTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name} ({type.code})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <div className="row">
                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Tầng</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="floor"
                                        value={currentRoom.floor}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 col-md-6">
                                    <Form.Label>Trạng thái</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={currentRoom.status}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {Object.entries(ROOM_STATUSES).map(([key, value]) => (
                                            <option key={key} value={key}>{value.label}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả (Ghi chú về phòng)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={currentRoom.description}
                                    onChange={handleInputChange}
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

export default RoomManagement;