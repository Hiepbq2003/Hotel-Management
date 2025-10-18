import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import api from "../api/apiConfig"; // chỉnh đường dẫn nếu khác

const RoomTypeManagement = () => {
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
    imageUrl: ""
  });

  // --- Lấy danh sách loại phòng ---
  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const data = await api.get("/room-type");
      setRoomTypes(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách loại phòng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  // --- Mở modal thêm/sửa ---
  const openModal = (room = null) => {
    if (room) {
      setIsEditing(true);
      setCurrentRoom(room);
    } else {
      setIsEditing(false);
      setCurrentRoom({
        id: null,
        name: "",
        basePrice: "",
        capacity: "",
        bedInfo: "",
        description: "",
        imageUrl: ""
      });
    }
    setShowModal(true);
  };

  // --- Gửi form thêm/sửa ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/room-type/${currentRoom.id}`, currentRoom);
        alert("Cập nhật thành công!");
      } else {
        await api.post("/room-type", currentRoom);
        alert("Thêm mới thành công!");
      }
      setShowModal(false);
      fetchRoomTypes();
    } catch (err) {
      alert("Lỗi khi lưu: " + (err.message || "Vui lòng thử lại."));
    }
  };

  // --- Xóa loại phòng ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa loại phòng này?")) return;
    try {
      await api.delete(`/room-type/${id}`);
      alert("Đã xóa thành công!");
      fetchRoomTypes();
    } catch (err) {
      alert("Lỗi khi xóa: " + (err.message || "Không thể xóa."));
    }
  };

  // --- Loading ---
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Quản lý loại phòng</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button variant="primary" className="mb-3" onClick={() => openModal()}>
        + Thêm loại phòng
      </Button>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên phòng</th>
            <th>Giá cơ bản</th>
            <th>Sức chứa</th>
            <th>Giường</th>
            <th>Mô tả</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((room) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.name}</td>
              <td>${room.basePrice}</td>
              <td>{room.capacity}</td>
              <td>{room.bedInfo}</td>
              <td>{room.description}</td>
              <td>
                <img
                  src={room.imageUrl || "https://via.placeholder.com/80"}
                  alt={room.name}
                  width="80"
                  height="60"
                  style={{ objectFit: "cover" }}
                />
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openModal(room)}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(room.id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Sửa loại phòng" : "Thêm loại phòng"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
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
              <Form.Label>Giá cơ bản</Form.Label>
              <Form.Control
                type="number"
                value={currentRoom.basePrice}
                onChange={(e) => setCurrentRoom({ ...currentRoom, basePrice: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sức chứa</Form.Label>
              <Form.Control
                type="number"
                value={currentRoom.capacity}
                onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thông tin giường</Form.Label>
              <Form.Control
                type="text"
                value={currentRoom.bedInfo}
                onChange={(e) => setCurrentRoom({ ...currentRoom, bedInfo: e.target.value })}
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
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              {isEditing ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomTypeManagement;
