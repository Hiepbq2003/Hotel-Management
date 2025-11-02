import React, { useEffect, useState } from "react";
import api from "../api/apiConfig";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";

const CheckOutPage = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // 🔹 Tải danh sách khách đang check-in
  const fetchCheckedInGuests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/checkIn/today"); // lấy danh sách đã check-in
      setCheckIns(res || []);
      setError(null);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách khách đang ở:", err);
      setError("Không thể tải danh sách khách đang ở.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckedInGuests();
  }, []);

  // 🔹 Checkout
  const handleCheckOut = async (guest) => {
    if (!window.confirm(`Xác nhận trả phòng ${guest.roomNumber}?`)) return;

    try {
      const payload = {
        roomNumber: guest.roomNumber,
        guestName: guest.guestName,
      };
      const res = await api.post("/checkIn/checkout", payload);
      console.log("✅ Checkout Response:", res);

      setSuccess(`✅ Khách ${guest.guestName} đã trả phòng ${guest.roomNumber}`);
      fetchCheckedInGuests(); // Refresh danh sách
    } catch (err) {
      console.error("❌ Lỗi khi checkout:", err);
      setError("Không thể checkout. Vui lòng thử lại!");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Đang tải danh sách...</p>
      </div>
    );

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Check-Out Page</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {checkIns.length === 0 ? (
        <Alert variant="info">Không có khách nào đang ở.</Alert>
      ) : (
        <Row>
          <Col>
            <Table bordered hover responsive>
              <thead className="table-dark">
                <tr className="text-center">
                  <th>#</th>
                  <th>Khách</th>
                  <th>Phòng</th>
                  <th>Loại phòng</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {checkIns.map((g, idx) => (
                  <tr key={idx} className="align-middle text-center">
                    <td>{idx + 1}</td>
                    <td>{g.guestName}</td>
                    <td>{g.roomNumber}</td>
                    <td>{g.roomType}</td>
                    <td>{new Date(g.checkInDate).toLocaleString()}</td>
                    <td>{new Date(g.checkOutDate).toLocaleString()}</td>
                    <td>{g.status}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleCheckOut(g)}
                      >
                        Check Out
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CheckOutPage;
