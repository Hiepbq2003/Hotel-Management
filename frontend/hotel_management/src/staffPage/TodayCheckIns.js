import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Container, Card } from "react-bootstrap";
import api from "../api/apiConfig";

const TodayCheckIns = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchTodayCheckIns();
  }, []);

  return (
    <Container className="mt-4">
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

export default TodayCheckIns;
