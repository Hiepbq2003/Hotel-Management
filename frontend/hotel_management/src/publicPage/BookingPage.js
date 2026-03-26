import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import api from "../api/apiConfig";

const BookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [requiredRooms, setRequiredRooms] = useState(1);
  const [extraDocs, setExtraDocs] = useState([]);

  // Read pre-filled dates from query params (from HeroSection)
  const queryParams = new URLSearchParams(location.search);
  const preCheckIn = queryParams.get("checkIn") || "";
  const preCheckOut = queryParams.get("checkOut") || "";
  const preAdults = queryParams.get("adults") || "1";

  const [form, setForm] = useState({
    customerId: localStorage.getItem("customerId") || "",
    guestName: localStorage.getItem("fullName") || "",
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || "",
    nationality: "",
    documentType: "",
    documentNumber: "",
    checkInDate: preCheckIn,
    checkOutDate: preCheckOut,
    adultCount: preAdults,
    childCount: 0,
    notes: "",
  });

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await api.get(`/room-type/${id}`);
        setRoom(data);
      } catch (err) {
        setError("Failed to load room information.");
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [id]);

  useEffect(() => {
    if (!room) return;
    const adult = Number(form.adultCount) || 0;
    const child = Number(form.childCount) || 0;
    const totalGuest = adult + child / 2;
    const capacity = room.capacity || 1;
    const roomsNeeded = Math.ceil(totalGuest / capacity);

    setRequiredRooms(roomsNeeded);

    if (roomsNeeded > 1) {
      setExtraDocs(Array.from({ length: roomsNeeded - 1 }, () => generateDocNumber()));
    } else {
      setExtraDocs([]);
    }
  }, [form.adultCount, form.childCount, room]);

  const generateDocNumber = () => "DOC-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  const buildRoomsPayload = () => {
    const customerId = form.customerId || localStorage.getItem("customerId") || null;
    const rooms = [];

    for (let i = 0; i < requiredRooms; i++) {
      rooms.push({
        customerId: customerId,
        guestName: i === 0 ? form.guestName : `${form.guestName} (Room ${i + 1})`,
        email: form.email,
        phone: form.phone,
        nationality: form.nationality,
        documentType: i === 0 ? form.documentType : "",
        documentNumber: i === 0 ? form.documentNumber || generateDocNumber() : extraDocs[i - 1],
        adultCount: parseInt(form.adultCount || "1", 10),
        childCount: parseInt(form.childCount || "0", 10),
        notes: form.notes,
      });
    }

    return rooms;
  };

  const toLocalDateTime = (d) => (d ? `${d}T00:00:00` : null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateNights = () => {
    if (!form.checkInDate || !form.checkOutDate) return 0;
    return Math.max(0, (new Date(form.checkOutDate) - new Date(form.checkInDate)) / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      localStorage.setItem("guestName", form.guestName);
      localStorage.setItem("email", form.email);
      localStorage.setItem("phone", form.phone);
      localStorage.setItem("customerId", form.customerId);

      const body = {
        roomType: room.code,
        checkInDate: toLocalDateTime(form.checkInDate),
        checkOutDate: toLocalDateTime(form.checkOutDate),
        guestName: form.guestName,
        rooms: buildRoomsPayload(),
      };

      const res = await api.post("/booking", body);

      const reservationId = res.data?.reservationId || res.data?.id || res?.reservationId || res?.id;

      if (!reservationId) {
        throw new Error("Could not retrieve reservation ID from server.");
      }

      const nights = calculateNights() || 1;
      const deposit = room.basePrice * nights * 0.2;

      setSuccess(
        <>
          <p><strong>Booking confirmed!</strong></p>
          <p>Room reference: <strong>{body.rooms[0]?.documentNumber}</strong></p>
          <p>Deposit (20%): <strong>${deposit.toFixed(2)}</strong></p>
          <p>Redirecting to payment...</p>
        </>
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const paymentResp = await api.post("/payment/create-vnpay", { reservationId });
      const vnpUrl = paymentResp?.data?.vnpayUrl || paymentResp?.vnpayUrl;

      if (!vnpUrl) {
        throw new Error("Could not generate payment URL.");
      }

      window.location.assign(vnpUrl);
    } catch (err) {
      console.error("Booking error:", err);
      setError("Booking failed: " + (err.response?.data?.message || err.response?.data || err.message));
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

  if (!room) return <Alert variant="danger">Room type not found.</Alert>;

  const nights = calculateNights();

  return (
    <Container style={{ paddingTop: 40, paddingBottom: 60 }}>
      <Row>
        <Col md={7}>
          <h3 className="fw-bold">{room.name}</h3>
          <p style={{ color: "#666" }}>{room.description}</p>
          <p><strong>Price:</strong> ${room.basePrice} <span style={{ color: "#888" }}>/night</span></p>
          <p><strong>Capacity:</strong> {room.capacity} guest(s)</p>
          <p><strong>Bed Type:</strong> {room.bedInfo || "Standard"}</p>

          {nights > 0 && (
            <div style={{ background: "#f8f9fa", padding: "15px 20px", borderRadius: 8, marginTop: 20 }}>
              <p className="mb-1"><strong>Stay Summary</strong></p>
              <p className="mb-1">{nights} night(s) × ${room.basePrice} = <strong>${(nights * room.basePrice).toFixed(2)}</strong></p>
              <p className="mb-0" style={{ color: "#888", fontSize: "0.9em" }}>20% deposit = ${(nights * room.basePrice * 0.2).toFixed(2)}</p>
            </div>
          )}

          {requiredRooms > 1 && (
            <Alert variant="warning" className="mt-3">
              Guest count exceeds single room capacity. System will automatically book {requiredRooms} rooms.
            </Alert>
          )}
        </Col>

        <Col md={5}>
          <div style={{ background: "#1f1f1f", padding: 25, borderRadius: 10, color: "#fff" }}>
            <h4 className="text-warning fw-bold mb-3">Booking Details</h4>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <h5 className="text-info fw-bold mb-3">Room 1</h5>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Check-In Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="checkInDate"
                      value={form.checkInDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Check-Out Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="checkOutDate"
                      value={form.checkOutDate}
                      onChange={handleChange}
                      required
                      min={form.checkInDate || new Date().toISOString().split("T")[0]}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Adults</Form.Label>
                    <Form.Control type="number" min="1" name="adultCount" value={form.adultCount} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Children</Form.Label>
                    <Form.Control type="number" min="0" name="childCount" value={form.childCount} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control as="textarea" rows={3} name="notes" value={form.notes} onChange={handleChange} placeholder="Special requests or notes..." />
              </Form.Group>

              {requiredRooms > 1 &&
                extraDocs.map((doc, index) => (
                  <div key={index} className="mt-4 p-3" style={{ background: "#333", borderRadius: 8 }}>
                    <h5 className="text-warning">Room {index + 2}</h5>
                    <p>Auto-generated code: {doc}</p>
                  </div>
                ))}

              <Button variant="warning" type="submit" className="w-100 fw-bold" disabled={submitting}>
                {submitting ? "Processing..." : "Complete Booking"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;
