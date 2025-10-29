import React, { useEffect, useState } from "react";
import api from "../api/apiConfig";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";

const FrontDeskCheckIn = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [assignedRoom, setAssignedRoom] = useState(null);

  // 🔹 Hàm tạo giá trị datetime-local đúng format
  const formatDateTimeLocal = (date) => date.toISOString().slice(0, 16);

  // 🔹 Thời điểm hiện tại (local time)
  const now = new Date();

  // 🔹 Ngày +1 mặc định
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(12, 0, 0, 0); // mặc định 12:00

  const [form, setForm] = useState({
    guestName: "",
    checkInDate: formatDateTimeLocal(now),
    checkOutDate: formatDateTimeLocal(tomorrow),
    roomType: "",
    adultCount: 1,
    childCount: 0,
    email: "",
    phone: "",
    nationality: "",
    documentType: "",
    documentNumber: "",
  });

  const [selectedTime, setSelectedTime] = useState("12:00"); // giờ mặc định

  useEffect(() => {
    api
      .get("/room-type/hotel/1")
      .then((res) => setRoomTypes(res))
      .catch((err) => console.error("❌ Lỗi khi tải room types:", err));
  }, []);

  // 🔹 Khi chọn mốc giờ checkout
  const handleCheckoutTimeChange = (e) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);

    const dateOnly = new Date(form.checkOutDate);
    const [hour, minute] = newTime.split(":").map(Number);
    dateOnly.setHours(hour, minute, 0, 0);

    setForm({ ...form, checkOutDate: formatDateTimeLocal(dateOnly) });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckIn = async () => {
    try {
      const payload = {
        ...form,
        checkInDate: new Date(form.checkInDate).toISOString(),
        checkOutDate: new Date(form.checkOutDate).toISOString(),
      };
  
      const res = await api.post("/checkIn/assign", payload);
      console.log("✅ Response từ backend:", res);
  
      if (!res.data) {
        alert("❌ Phản hồi rỗng từ server — kiểm tra backend!");
        return;
      }
  
      setAssignedRoom(res.data);
      alert(`✅ Đã nhận phòng ${res.data.number} (${res.data.type}) cho khách ${form.guestName}`);
    } catch (err) {
      console.error("❌ Lỗi check-in:", err);
      alert("❌ Không còn phòng trống hoặc lỗi server!");
    }
  };
  

  return (
    <Container className="mt-4">
      <h3>Reception - Guest Check-in</h3>
      <Card className="p-4 shadow-sm">
        <Row>
          <Col md={6}>
            {/* Guest Name */}
            <Form.Group className="mb-3">
              <Form.Label>Guest Name</Form.Label>
              <Form.Control
                type="text"
                name="guestName"
                value={form.guestName}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Check-in (readonly) */}
            <Form.Group className="mb-3">
              <Form.Label>Check-in Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="checkInDate"
                value={form.checkInDate}
                readOnly
              />
            </Form.Group>

            {/* Check-out Date (có chọn mốc giờ) */}
            <Form.Group className="mb-3">
              <Form.Label>Check-out Date</Form.Label>
              <Form.Control
                type="date"
                value={form.checkOutDate.slice(0, 10)}
                onChange={(e) => {
                  const newDate = e.target.value;
                  const date = new Date(newDate + "T" + selectedTime);
                  setForm({ ...form, checkOutDate: formatDateTimeLocal(date) });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Checkout Time</Form.Label>
              <Form.Select value={selectedTime} onChange={handleCheckoutTimeChange}>
                <option value="08:00">08:00</option>
                <option value="12:00">12:00</option>
                <option value="18:00">18:00</option>
              </Form.Select>
            </Form.Group>

            {/* Adults & Children */}
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Adults</Form.Label>
                  <Form.Control
                    type="number"
                    name="adultCount"
                    min="1"
                    value={form.adultCount}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Children</Form.Label>
                  <Form.Control
                    type="number"
                    name="childCount"
                    min="0"
                    value={form.childCount}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Contact info */}
            {["email", "phone", "nationality", "documentNumber"].map((key) => (
              <Form.Group className="mb-3" key={key}>
                <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-3">
              <Form.Label>Document Type</Form.Label>
              <Form.Select name="documentType" value={form.documentType} onChange={handleChange}>
                <option value="">-- Select --</option>
                <option value="CCCD">CCCD</option>
                <option value="Passport">Passport</option>
              </Form.Select>
            </Form.Group>

            {/* Room Type */}
            <Form.Group className="mb-3">
              <Form.Label>Room Type</Form.Label>
              <Form.Select name="roomType" value={form.roomType} onChange={handleChange}>
                <option value="">-- Select a type --</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button
              onClick={handleCheckIn}
              disabled={!form.guestName || !form.roomType || !form.checkOutDate}
            >
              Assign Room
            </Button>

            {assignedRoom && (
              <div className="mt-3 p-3 border rounded bg-light">
                ✅ Assigned Room: <strong>{assignedRoom.number}</strong> ({assignedRoom.type})
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default FrontDeskCheckIn;
