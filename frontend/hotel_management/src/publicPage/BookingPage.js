import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiConfig";

const BookingPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [form, setForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    nationality: "",
    documentType: "CMND",
    documentNumber: "",
    checkInDate: "",
    checkOutDate: "",
    adultCount: 1,
    childCount: 0,
    notes: "",
  });

  // Lấy thông tin phòng
  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await api.get(`/room-type/${id}`);
        setRoom(data);
      } catch (err) {
        setError("Không tải được thông tin phòng.");
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [id]);

  // Thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit booking
  const toLocalDateTime = (dateString) => {
    if (!dateString) return null;
    return `${dateString}T00:00:00`;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
  
    try {
      const body = {
        roomType: room.code,
        guestName: form.guestName,
        email: form.email,
        phone: form.phone,
        nationality: form.nationality,
        documentType: form.documentType,
        documentNumber: form.documentNumber,
  
        // ✅ FIX: convert sang LocalDateTime đúng chuẩn
        checkInDate: toLocalDateTime(form.checkInDate),
        checkOutDate: toLocalDateTime(form.checkOutDate),
  
        adultCount: Number(form.adultCount),
        childCount: Number(form.childCount),
        notes: form.notes,
      };
  
      const res = await api.post("/booking", body);
  
      setSuccess("Đặt phòng thành công! Mã đặt phòng: " + res.reservationCode);
  
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError("Đặt phòng thất bại: " + (err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  if (!room) return <Alert variant="danger">Không tìm thấy loại phòng.</Alert>;

  return (
    <Container style={{ paddingTop: "40px", paddingBottom: "40px" }}>
      <Row>
        <Col md={7}>
          <h3 className="fw-bold">{room.name}</h3>
          <p style={{ color: "#666" }}>{room.description}</p>

          <p><strong>Giá:</strong> {room.basePrice} VNĐ/đêm</p>
          <p><strong>Sức chứa:</strong> {room.capacity} người</p>
          <p><strong>Giường:</strong> {room.bedInfo}</p>
        </Col>

        {/* FORM ĐẶT PHÒNG */}
        <Col md={5}>
          <div style={{ background: "#1f1f1f", padding: 25, borderRadius: 10, color: "#fff" }}>
            <h4 className="text-warning fw-bold mb-3">Thông tin đặt phòng</h4>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control name="guestName" value={form.guestName} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" value={form.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control name="phone" value={form.phone} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quốc tịch</Form.Label>
                <Form.Control name="nationality" value={form.nationality} onChange={handleChange} />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Loại giấy tờ</Form.Label>
                    <Form.Select name="documentType" value={form.documentType} onChange={handleChange}>
                      <option>CMND</option>
                      <option>CCCD</option>
                      <option>Passport</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Số giấy tờ</Form.Label>
                    <Form.Control name="documentNumber" value={form.documentNumber} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày nhận phòng</Form.Label>
                    <Form.Control type="date" name="checkInDate" value={form.checkInDate} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày trả phòng</Form.Label>
                    <Form.Control type="date" name="checkOutDate" value={form.checkOutDate} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Người lớn</Form.Label>
                    <Form.Control type="number" min="1" name="adultCount" value={form.adultCount} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Trẻ em</Form.Label>
                    <Form.Control type="number" min="0" name="childCount" value={form.childCount} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Ghi chú</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button
                variant="warning"
                type="submit"
                className="w-100 fw-bold"
                disabled={submitting}
              >
                {submitting ? "Đang xử lý..." : "Hoàn tất đặt phòng"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;
