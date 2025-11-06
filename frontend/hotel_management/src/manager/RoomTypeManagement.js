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

    // ⭐ AMENITY STATES ⭐
    const [allAmenities, setAllAmenities] = useState([]); // Danh sách tất cả amenities
    const [showAmenityModal, setShowAmenityModal] = useState(false); // Trạng thái modal tiện nghi
    const [currentRoomTypeForAmenity, setCurrentRoomTypeForAmenity] = useState(null); // RoomType đang được chỉnh sửa amenities
    const [selectedAmenityIds, setSelectedAmenityIds] = useState([]); // Các ID amenities đang được chọn

    // --- UTILS ---

    const formatPrice = (price) => {
        if (price === null || price === undefined) return '';
        const numberPrice = parseFloat(price);
        if (isNaN(numberPrice)) return price;
        // Sử dụng style tiền tệ 'currency' và đơn vị 'VND'
        return numberPrice.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' });
    };

    const canManageRoomTypes = ALLOWED_ROLES.includes(currentUserRole);

    // --- FETCHING LOGIC ---

    const fetchRoomTypes = async () => {
        if (error && error.includes('không có quyền truy cập')) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/room-type");
            const data = response || response.content; 
            setRoomTypes(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("Không thể tải danh sách loại phòng. Lỗi API hoặc quyền truy cập.");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchAllAmenities = async () => {
        try {
            const response = await api.get(`/hotel-amenities?hotelId=${DEFAULT_HOTEL_ID}`);
            const data = response || []; 
            setAllAmenities(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi khi tải danh sách tiện nghi:", err);
            // toast.error("Không thể tải danh sách tiện nghi."); // Tránh spam toast
        }
    };

    useEffect(() => {
        if (!ALLOWED_ROLES.includes(currentUserRole)) {
            setError('Bạn không có quyền truy cập trang Quản lý Loại phòng. Yêu cầu vai trò MANAGER.');
            setLoading(false);
            return;
        }
        fetchRoomTypes();
        fetchAllAmenities(); 
    }, [currentUserRole]); 

    // --- CRUD MODAL LOGIC (CREATE/UPDATE) ---

    const openModal = (room = null) => {
        if (!canManageRoomTypes) {
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
            };
            
            if (!isEditing) delete dataToSend.id; 

            if (isEditing) {
                await api.put(`/room-type/${dataToSend.id}`, dataToSend);
                toast.success("✅ Cập nhật thành công!");
            } else {
                await api.post("/room-type", dataToSend, { params: { hotelId: DEFAULT_HOTEL_ID } }); // Gửi hotelId qua param
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

    // --- AMENITY MODAL LOGIC ---
    
    const openAmenityModal = (roomType) => {
        if (!canManageRoomTypes) {
            toast.error("Bạn không có quyền thực hiện thao tác này.");
            return;
        }
        setCurrentRoomTypeForAmenity(roomType);
        const currentIds = (roomType.amenities || []).map(a => a.id);
        setSelectedAmenityIds(currentIds);
        setShowAmenityModal(true);
        setError(null);
    };

    const closeAmenityModal = () => {
        setShowAmenityModal(false);
        setCurrentRoomTypeForAmenity(null);
        setSelectedAmenityIds([]);
    };

    const handleAmenitySelection = (amenityId) => {
        setSelectedAmenityIds(prevIds => {
            if (prevIds.includes(amenityId)) {
                return prevIds.filter(id => id !== amenityId);
            } else {
                return [...prevIds, amenityId];
            }
        });
    };

    const handleSaveAmenities = async () => {
        if (!currentRoomTypeForAmenity || !canManageRoomTypes) return;
        setLoading(true);

        try {
            const roomTypeId = currentRoomTypeForAmenity.id;
            const data = { amenityIds: selectedAmenityIds };
            
            // Gọi API PUT
            await api.put(`/room-type/${roomTypeId}/amenities`, data); 

            toast.success(`✅ Cập nhật tiện nghi cho ${currentRoomTypeForAmenity.name} thành công!`);
            closeAmenityModal();
            fetchRoomTypes(); 
        } catch (err) {
            let errorMessage = "Lỗi khi cập nhật tiện nghi. Vui lòng kiểm tra console.";
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message; 
            }
            toast.error(`❌ ${errorMessage}`);
            console.error("Error saving amenities:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER ---

    if (error && error.includes('không có quyền truy cập')) {
        return <p className="text-danger text-center mt-5 p-4 bg-light rounded shadow-sm" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
            Lỗi: {error}
        </p>;
    }


    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-primary">Đang tải dữ liệu Loại phòng...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <h3 className="mb-4 text-center text-primary border-bottom pb-2" style={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                🏠 QUẢN LÝ LOẠI PHÒNG
            </h3>

            {error && !showModal && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            {canManageRoomTypes && (
                <Button 
                    variant="primary" 
                    className="mb-3 shadow-lg btn-lg" 
                    onClick={() => openModal()}
                    style={{ fontWeight: 600 }}
                >
                    ➕ THÊM LOẠI PHÒNG MỚI
                </Button>
            )}


            {/* Bảng dữ liệu */}
            <div className="shadow-2xl rounded-xl table-responsive bg-white p-3 border border-gray-200">
                <Table striped bordered hover className="m-0 align-middle caption-top" style={{ minWidth: '1200px' }}> 
                    <caption className="text-primary fw-bold mb-2">
                        Danh sách Loại phòng (Khách sạn ID: **{DEFAULT_HOTEL_ID}**)
                    </caption>
                    <thead className="table-dark shadow-md">
                        <tr style={{ backgroundColor: '#007bff' }}>
                            <th className="text-center text-nowrap" style={{ width: '5%' }}>ID</th>
                            <th className="text-nowrap" style={{ width: '15%' }}>Tên phòng</th>
                            <th className="text-end text-nowrap" style={{ width: '10%' }}>Giá cơ bản</th>
                            <th className="text-center text-nowrap" style={{ width: '5%' }}>Sức chứa</th>
                            <th className="text-nowrap" style={{ width: '8%' }}>Mã phòng</th>
                            <th className="text-nowrap" style={{ width: '10%' }}>Giường</th>
                            <th>Mô tả</th>
                            <th className="text-center text-nowrap" style={{ width: '8%' }}>Ảnh</th>
                            <th className="text-center text-nowrap" style={{ width: '10%' }}>Tiện nghi</th>
                            <th className="text-center text-nowrap" style={{ width: '14%' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomTypes.length > 0 ? (
                            roomTypes.map((room) => (
                                <tr key={room.id} className="align-middle">
                                    <td className="text-center text-muted fw-light">{room.id}</td>
                                    <td className="fw-bold text-primary">{room.name}</td>
                                    <td className="text-end fw-bold text-success">{formatPrice(room.basePrice)}</td>
                                    <td className="text-center">{room.capacity}</td>
                                    <td className="fw-bold text-secondary">{room.code}</td>
                                    <td>{room.bedInfo}</td>
                                    <td>
                                        <span title={room.description}>
                                            {room.description?.substring(0, 50) + (room.description?.length > 50 ? '...' : '')}
                                        </span>
                                    </td>
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
                                        {canManageRoomTypes ? (
                                            <Button 
                                                variant="secondary" // Thay info bằng secondary hoặc màu khác phù hợp hơn
                                                size="sm"
                                                onClick={() => openAmenityModal(room)}
                                                className="shadow-sm"
                                            >
                                                ⚙️ Tiện nghi ({room.amenities?.length || 0})
                                            </Button>
                                        ) : (
                                            <span className="text-muted">{room.amenities?.length || 0}</span>
                                        )}
                                    </td>
                                    <td className="text-center text-nowrap">
                                            {canManageRoomTypes ? (
                                                <>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        className="me-2 text-dark shadow-sm" // Dùng text-dark để chữ vàng rõ hơn
                                                        onClick={() => openModal(room)}
                                                    >✏️ Sửa</Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="shadow-sm"
                                                        onClick={() => handleDelete(room.id, room.name)}
                                                    >🗑️ Xóa</Button>
                                                </>
                                            ) : (
                                                <span className="text-muted">Không có quyền</span>
                                            )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center py-4 text-secondary">
                                    📋 Không có loại phòng nào được tìm thấy.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Modal CRUD RoomType */}
            {canManageRoomTypes && (
                <Modal show={showModal} onHide={closeModal} centered>
                    <Modal.Header closeButton className={isEditing ? "bg-warning text-dark" : "bg-primary text-white"}>
                        <Modal.Title>{isEditing ? "✏️ Sửa loại phòng" : "➕ Thêm loại phòng mới"}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Tên phòng <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRoom.name}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Mã loại phòng (Code) <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRoom.code}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, code: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Giá cơ bản (VND) <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    value={currentRoom.basePrice}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, basePrice: e.target.value })}
                                    required
                                    min="0"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Sức chứa (Người) <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    value={currentRoom.capacity}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: e.target.value })}
                                    min="1"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Thông tin giường</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRoom.bedInfo}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, bedInfo: e.target.value })}
                                    placeholder="Ví dụ: 1 King Bed"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={currentRoom.description}
                                    onChange={(e) => setCurrentRoom({ ...currentRoom, description: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className="fw-bold">Ảnh (URL)</Form.Label>
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
                            <Button type="submit" variant={isEditing ? "warning" : "primary"} className={isEditing ? "text-dark" : "text-white"}>
                                {isEditing ? "Lưu thay đổi" : "Thêm mới"}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            )}

            {/* Modal Quản lý Tiện nghi */}
            {canManageRoomTypes && currentRoomTypeForAmenity && (
                <Modal show={showAmenityModal} onHide={closeAmenityModal} centered>
                    <Modal.Header closeButton className="bg-secondary text-white">
                        <Modal.Title>⚙️ Quản lý Tiện nghi: {currentRoomTypeForAmenity.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-muted small">Chọn hoặc bỏ chọn các tiện nghi cho loại phòng này:</p>
                        <div className="amenity-list-container" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '5px' }}>
                            <Form>
                                {allAmenities.length > 0 ? (
                                    allAmenities.map(amenity => (
                                        <Form.Check 
                                            key={amenity.id}
                                            type="checkbox"
                                            id={`amenity-check-${amenity.id}`}
                                            label={
                                                <>
                                                    <span className="fw-bold text-primary">{amenity.name}</span>
                                                    <span className="text-muted small ms-2">({amenity.description || 'Không mô tả'})</span>
                                                </>
                                            }
                                            checked={selectedAmenityIds.includes(amenity.id)}
                                            onChange={() => handleAmenitySelection(amenity.id)}
                                            className="mb-2"
                                        />
                                    ))
                                ) : (
                                    <Alert variant="warning">Không tìm thấy tiện nghi nào để chọn. (Vui lòng kiểm tra dữ liệu hoặc API /hotel-amenities?hotelId=1)</Alert>
                                )}
                            </Form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeAmenityModal}>Hủy</Button>
                        <Button variant="primary" onClick={handleSaveAmenities}>
                            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : "Lưu Tiện nghi"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

        </div>
    );
};

export default RoomTypeManagement;