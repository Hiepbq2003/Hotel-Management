import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import api from "../api/apiConfig";
import { useNavigate } from "react-router-dom";
const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.get("/room-type");
        setRooms(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError(err.message || "Không thể tải dữ liệu phòng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const cardHoverStyle = {
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  return (
    <Container style={{ paddingTop: "60px", paddingBottom: "60px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ fontWeight: "bold" }}>Our Rooms</h2>
        <p style={{ color: "#6c757d" }}>
          Discover the comfort and elegance of our hotel rooms
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <strong>Lỗi:</strong> {error}
        </Alert>
      )}

      {!error && rooms.length === 0 && (
        <Alert variant="info" className="mb-4" style={{ textAlign: "center" }}>
          Hiện tại chưa có loại phòng nào được cung cấp.
        </Alert>
      )}

      <Row className="g-4">
        {rooms.map((room) => (
          <Col key={room.id} lg={4} md={6}>
            <Card
              className="h-100 shadow-sm border-0"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                ...cardHoverStyle,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.1)";
              }}
            >
              <Card.Img
                variant="top"
                src={
                  room.imageUrl ||
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60"
                }
                alt={room.name}
                style={{
                  height: "240px",
                  objectFit: "cover",
                }}
              />

              <Card.Body style={{ padding: "20px" }}>
                <Card.Title style={{ fontWeight: "600" }}>{room.name}</Card.Title>
                <h5 style={{ color: "#f4b400", fontWeight: "bold" }}>
                  ${room.basePrice}
                </h5>
                <p
                  style={{
                    color: "#6c757d",
                    fontSize: "14px",
                    minHeight: "60px",
                  }}
                >
                  {room.description}
                </p>

                <ul
                  style={{
                    listStyle: "none",
                    paddingLeft: 0,
                    fontSize: "14px",
                    color: "#var(--main-color)",
                    marginBottom: "16px",
                  }}
                >
                  <li>
                    <b>Capacity:</b> {room.capacity} person(s)
                  </li>
                  <li>
                    <b>Bed:</b> {room.bedInfo}
                  </li>
                </ul>

                <Button
                  variant="outline-dark"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    fontWeight: "500",
                    padding: "8px 0",
                  }}
                  onClick={() => navigate(`/rooms/${room.id}`)}  // 👈 thêm dòng này
                >
                  More Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Rooms;
