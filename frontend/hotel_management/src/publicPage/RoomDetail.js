import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiConfig";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const IMAGE_SEEDS = [
    "hotel bed pillows",        // Bed and pillows
    "hotel room shower bathroom", // Shower and bathroom
    "modern hotel suite desk",  // Modern workspace
    "luxury hotel lamp design", // Lamp and luxury design
    "hotel minibar coffee",     // Minibar / coffee amenities
    "hotel room mirror vanity", // Mirror and vanity area
    "high end hotel room art",  // Room artwork
    "modern small hotel lobby", // Modern shared interior
    "hotel room towels amenities", // Towels and toiletries
  ];

  const getRoomImageUrl = (index) => {
    // Use modulo (%) to repeat the image list if there are more than 9 room types
    const seed = IMAGE_SEEDS[index % IMAGE_SEEDS.length];
    return `https://picsum.photos/seed/${seed}/800/500`; // 800x500 size for consistent horizontal images
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await api.get(`/room-type/${id}`);
        setRoom(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Unable to load room information.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="m-4 text-center">
        {error}
      </Alert>
    );

  if (!room)
    return (
      <Alert variant="info" className="m-4 text-center">
        Room information not found.
      </Alert>
    );

  return (
    <Container style={{ paddingTop: "50px", paddingBottom: "50px" }}>
      <Row>
        {/* Room Image Carousel */}
        <Col md={7}>
          <Carousel fade>
            {(room.images || [{ url: room.imageUrl }]).map((img, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={room.imageUrl || getRoomImageUrl(id)}
                  alt={`Room ${index}`}
                  style={{ height: "400px", objectFit: "cover", borderRadius: "10px" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>

          <div style={{ marginTop: "30px" }}>
            <h3 style={{ fontWeight: "bold" }}>{room.name}</h3>
            <p style={{ color: "#555", fontSize: "15px" }}>{room.description}</p>

            <h5 className="mt-3">Amenities</h5>
            <ul style={{ columns: 2, listStyle: "none", paddingLeft: 0 }}>
              {room.amenities?.map((a, i) => (
                <li key={i}>✔️ {a.name || a}</li>
              )) || <li>No information available.</li>}
            </ul>
          </div>
        </Col>

        {/* Booking Section */}
        <Col md={5}>
          <div
            style={{
              background: "#2c2c2c",
              color: "#fff",
              padding: "30px",
              borderRadius: "10px",
              height: "100%",
            }}
          >
            <h5>Available Rooms: {room.quantity || 1}</h5>
            <p>Room Size: {room.size || 20} m²</p>
            <p>Bed Type: {room.bedInfo}</p>
            <p>Capacity: {room.capacity} adults</p>
            <h4 style={{ color: "#f4b400", fontWeight: "bold" }}>
              Price: {room.basePrice} $ / night
            </h4>

            <Button
              variant="warning"
              style={{
                color: "#000",
                fontWeight: "600",
                width: "100%",
                marginTop: "20px",
              }}
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  alert("⚠️ Vui lòng đăng nhập trước khi đặt phòng!");
                  navigate("/login");
                  return;
                }
                navigate(`/booking/${room.id}`);
              }}
            >
              Book Now
            </Button>

            <div style={{ marginTop: "20px", fontSize: "14px", color: "#ccc" }}>
              <h6>Notes:</h6>
              <p>- Extra charge for 3rd guest: 150,000 VND/night</p>
              <p>- Check-in: 2:00 PM | Check-out: 12:00 PM</p>
              <p>- Includes 10% VAT</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RoomDetails;
