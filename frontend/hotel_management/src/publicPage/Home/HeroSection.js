import React, { useEffect, useState } from "react";
import { Carousel, Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiConfig";

const HeroSection = () => {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    api
      .get("/room-type")
      .then((res) => setRoomTypes(Array.isArray(res) ? res : []))
      .catch((err) => console.error("Failed to load room types:", err));
  }, []);

  const [form, setForm] = useState({
    checkInDate: "",
    checkOutDate: "",
    adultCount: 2,
    roomCount: 1,
    roomTypeId: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const checkIn = new Date(form.checkInDate);
    const checkOut = new Date(form.checkOutDate);

    if (checkOut <= checkIn) {
      setMessage("Check-out date must be after check-in date.");
      setMessageType("danger");
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({
      checkIn: form.checkInDate,
      checkOut: form.checkOutDate,
      adults: form.adultCount,
    }).toString();

    setTimeout(() => {
      setLoading(false);
      if (form.roomTypeId) {
        navigate(`/booking/${form.roomTypeId}?${params}`);
      } else {
        navigate(`/rooms?${params}`);
      }
    }, 400);
  };

  const images = [
    "https://peridotgrandhotel.com/wp-content/uploads/2022/09/2.-Lobby-Area-2-2000.jpg",
    "https://peridotgrandhotel.com/wp-content/uploads/2025/05/22th416454.jpg",
    "https://peridotgrandhotel.com/wp-content/uploads/2022/09/Ignite-Sky-Bar-Birdeye.jpg",
  ];

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <Carousel fade controls={false} indicators={false} interval={5000}>
          {images.map((img, i) => (
            <Carousel.Item key={i}>
              <div
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100vh",
                  width: "100%",
                  filter: "brightness(60%)",
                }}
              ></div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 2,
          color: "white",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container>
          <Row className="align-items-center" style={{ marginRight: "70px", marginLeft: "70px" }}>
            <Col lg={6} md={12} className="text-lg-start text-center mb-4 mb-lg-0">
              <h1
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "600",
                  lineHeight: "1.2",
                }}
              >
                Mr.STELLAR A Luxury Hotel
              </h1>
              <p
                style={{
                  maxWidth: "450px",
                  color: "#eee",
                  margin: "20px 0",
                  fontSize: "1.05rem",
                }}
              >
                Experience ultimate comfort and elegance — check our room availability below.
              </p>
              <Button
                variant="outline-light"
                style={{
                  borderRadius: "0",
                  letterSpacing: "1px",
                  fontWeight: "500",
                }}
                onClick={() => navigate("/rooms")}
              >
                DISCOVER NOW
              </Button>
            </Col>
            <Col
              lg={4}
              md={10}
              className="ms-auto bg-white text-dark rounded"
              style={{
                boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                opacity: 0.97,
                padding: "55px",
              }}
            >
              <h3 className="mb-4 text-center fw-semibold">Book Your Stay</h3>

              <Form onSubmit={handleCheckAvailability} className="text-secondary">
                {message && <Alert variant={messageType}>{message}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>Check In:</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="date"
                      name="checkInDate"
                      value={form.checkInDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      style={{ borderRadius: 0, paddingLeft: "35px" }}
                    />
                    <FaRegCalendarAlt
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#888",
                      }}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Check Out:</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="date"
                      name="checkOutDate"
                      value={form.checkOutDate}
                      onChange={handleChange}
                      required
                      min={form.checkInDate || new Date().toISOString().split("T")[0]}
                      style={{ borderRadius: 0, paddingLeft: "35px" }}
                    />
                    <FaRegCalendarAlt
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#888",
                      }}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Guests:</Form.Label>
                  <Form.Select name="adultCount" value={form.adultCount} onChange={handleChange} style={{ borderRadius: 0 }}>
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4 Adults</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rooms:</Form.Label>
                  <Form.Select name="roomCount" value={form.roomCount} onChange={handleChange} style={{ borderRadius: 0 }}>
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                    <option value={3}>3 Rooms</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Room Type: <span style={{ color: "#aaa", fontWeight: 400, fontSize: "0.85em" }}>(Optional)</span></Form.Label>
                  <Form.Select name="roomTypeId" value={form.roomTypeId} onChange={handleChange} style={{ borderRadius: 0 }}>
                    <option value="">Any Room Type</option>
                    {roomTypes.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button
                  variant="outline-dark"
                  type="submit"
                  disabled={loading}
                  className="w-100"
                  style={{
                    borderRadius: 0,
                    fontWeight: "600",
                    padding: "10px 0",
                    letterSpacing: "1px",
                    borderColor: "#222",
                  }}
                >
                  {loading ? <Spinner size="sm" /> : "CHECK AVAILABILITY"}
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HeroSection;
