import React, { useEffect, useState } from "react";
import api from "../api/apiConfig";
import {
  Card,
  Button,
  Form,
  Container,
  Row,
  Col,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";

const CheckInPage = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [assignedRoom, setAssignedRoom] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Hàm tạo giá trị datetime-local đúng format
// ✅ Hàm format đúng giờ địa phương (không bị lệch múi giờ)
const formatDateTimeLocal = (date) => {
  const pad = (n) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}`;
};
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
tomorrow.setHours(12, 0, 0, 0);

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

  const nations = [
    "Viet Nam",
    "Mĩ",
    "Colombia",
    "Nga",
    "Úc",
    "Hàn",
    "Nhật",
    "Trung",
    "Ấn",
    "EU",
    "Anh",
    "Các nước khác",
  ];
  const [selectedTime, setSelectedTime] = useState("12:00");

  // 🔹 Load Room Types
  useEffect(() => {
    api
      .get("/room-type/hotel/1")
      .then((res) => setRoomTypes(res))
      .catch((err) => console.error("❌ Lỗi khi tải room types:", err));
  }, []);

  // 🔹 Load danh sách check-in hôm nay
  const fetchTodayCheckIns = async () => {
    try {
      const res = await api.get("/checkIn/today");
      setCheckIns(res || []);
      setError(null);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách check-in hôm nay:", err);
      setError("Không thể tải danh sách khách check-in hôm nay.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayCheckIns();
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Xử lý Check-in
  const handleCheckIn = async () => {
    try {
      const payload = {
        ...form,
        // Gửi UTC ISO về backend
        checkInDate: new Date(form.checkInDate).toISOString(),
        checkOutDate: new Date(form.checkOutDate).toISOString(),
      };
      console.log("📤 Payload gửi lên backend:", payload);
      const res = await api.post("/checkIn/assign", payload);
      console.log("✅ Response từ backend:", res);
  
      if (!res) {
        alert("❌ Phản hồi rỗng từ server — kiểm tra backend!");
        return;
      }
  
      setAssignedRoom(res);
      alert(
        `✅ Đã nhận phòng ${res.number} (${res.type}) cho khách ${form.guestName}`
      );
  
      fetchTodayCheckIns(); // Cập nhật danh sách mới
    } catch (err) {
      console.error("❌ Lỗi check-in:", err);
      alert("❌ Không còn phòng trống hoặc lỗi server!");
    }
  };
  

  return (
    <Container className="mt-4">
      {/* ==================== FORM CHECK-IN ==================== */}
      <h3>Reception - Guest Check-in</h3>
      <Card className="p-4 shadow-sm mb-5">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Guest Name</Form.Label>
              <Form.Control
                type="text"
                name="guestName"
                value={form.guestName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Check-in Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="checkInDate"
                value={form.checkInDate}
                readOnly
              />
            </Form.Group>

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
              <Form.Select
                value={selectedTime}
                onChange={handleCheckoutTimeChange}
              >
                <option value="08:00">08:00</option>
                <option value="12:00">12:00</option>
                <option value="18:00">18:00</option>
              </Form.Select>
            </Form.Group>

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
          </Col>
          <Col lg={6}>
            {["phone", "documentNumber"].map((key) => (
              <Form.Group className="mb-3" key={key}>
                <Form.Label>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Form.Label>
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
              <br />
              {["CCCD", "Passport"].map((type) => (
                <Form.Check
                  key={type}
                  type="radio"
                  inline
                  name="documentType"
                  label={type}
                  value={type}
                  checked={form.documentType === type}
                  onChange={handleChange}
                  className="mb-2"
                />
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nationality</Form.Label>
              <Form.Select
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
              >
                <option value="">-- Select a nation --</option>
                {nations.map((nation) => (
                  <option key={nation} value={nation}>
                    {nation}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Room Type</Form.Label>
              <Form.Select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
              >
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
                ✅ Assigned Room:{" "}
                <strong>{assignedRoom.number}</strong> ({assignedRoom.type})
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* ==================== DANH SÁCH CHECK-IN HÔM NAY ==================== */}
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4 text-primary">🛎️ Guests Checked In Today</h3>

        {loading && <Spinner animation="border" />}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          checkIns.length > 0 ? (
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Guest Name</th>
                  <th>Room Number</th>
                  <th>Room Type</th>
                  <th>Check-in Date</th>
                  <th>Check-out Date</th>
                  <th>Document Type</th>
                  <th>Document Number</th>
                </tr>
              </thead>
              <tbody>
                {checkIns.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.guestName}</td>
                    <td>{item.roomNumber}</td>
                    <td>{item.roomType}</td>
                    <td>{item.checkInDate}</td>
                    <td>{item.checkOutDate}</td>
                    <td>{item.documentType}</td>
                    <td>{item.documentNumber}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">Chưa có khách nào check-in hôm nay.</Alert>
          )
        )}
      </Card>
    </Container>
  );
};

export default CheckInPage;
