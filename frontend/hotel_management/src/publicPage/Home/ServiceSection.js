import React from 'react';
import { Container, Row, Col,Button,Card} from "react-bootstrap";
import {
    FaMapMarkerAlt,
    FaUtensils,
    FaBaby,
    FaTshirt,
    FaCar,
    FaCocktail,
} from "react-icons/fa";

const ServiceSection = () => {
    const services = [
        { icon: <FaMapMarkerAlt />, title: "Travel Plan" },
        { icon: <FaUtensils />, title: "Catering Service" },
        { icon: <FaBaby />, title: "Babysitting" },
        { icon: <FaTshirt />, title: "Laundry" },
        { icon: <FaCar />, title: "Hire Driver" },
        { icon: <FaCocktail />, title: "Bar & Drink" },
    ];
    const rooms = [
        {
            image:
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
            title: "Premium King Room",
            price: 159,
            desc: "Spacious room with modern design and city view.",
        },
        {
            image:
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=60",
            title: "Deluxe Queen Room",
            price: 189,
            desc: "Elegant comfort with a touch of luxury.",
        },
        {
            image:
                "https://images.unsplash.com/photo-1618213837799-9ce22d43c4d2?auto=format&fit=crop&w=800&q=60",
            title: "Luxury Suite",
            price: 249,
            desc: "Enjoy full facilities and panoramic views.",
        },
        {
            image:
                "https://images.unsplash.com/photo-1600585154205-8e8c6b7a5a59?auto=format&fit=crop&w=800&q=60",
            title: "Family Room",
            price: 199,
            desc: "Perfect for family vacations, large space & cozy feel.",
        },
    ];
    return (
        <>
            <Container style={{ textAlign: "center", marginBottom: "120px" }}>
                <p
                    style={{
                        textTransform: "uppercase",
                        color: "var(--main-color)",
                        fontWeight: 700,
                        marginBottom: "10px",
                    }}
                >
                    What We Do
                </p>
                <h1
                    style={{
                        fontWeight: 700,
                        fontSize: "2.5rem",
                        marginBottom: "60px",
                    }}
                >
                    Discover Our Services
                </h1>

                <Row className="justify-content-center">
                    <Col lg={10}>
                        <Row className="justify-content-center g-3">
                            {services.map((service, i) => (
                                <Col key={i} lg={4} md={6} sm={12}>
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "30px 10px",
                                            backgroundColor: "#fff",
                                            transition: "all 0.3s ease",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "var(--main-color)";
                                            e.currentTarget.querySelector("svg").style.color = "#fff";
                                            e.currentTarget.querySelector("h5").style.color = "#fff";
                                            e.currentTarget.querySelector("p").style.color = "#f0f0f0";
                                            e.currentTarget.style.transform = "translateY(-8px)";
                                            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "#fff";
                                            e.currentTarget.querySelector("svg").style.color = "var(--main-color)";
                                            e.currentTarget.querySelector("h5").style.color = "#000";
                                            e.currentTarget.querySelector("p").style.color = "#555";
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "2.5rem",
                                                marginBottom: "20px",
                                                color: "var(--main-color)",
                                                transition: "color 0.3s",
                                            }}
                                        >
                                            {service.icon}
                                        </div>
                                        <h5
                                            style={{
                                                fontWeight: 600,
                                                marginBottom: "10px",
                                                transition: "color 0.3s",
                                            }}
                                        >
                                            {service.title}
                                        </h5>
                                        <p
                                            style={{
                                                color: "#555",
                                                fontSize: "15px",
                                                lineHeight: "1.8",
                                                transition: "color 0.3s",
                                            }}
                                        >
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna.
                                        </p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Container fluid style={{ marginTop: "80px", marginBottom: "100px" }}>
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <p
                        style={{
                            textTransform: "uppercase",
                            color: "var(--main-color)",
                            fontWeight: 600,
                            marginBottom: "8px",
                        }}
                    >
                        Our Rooms
                    </p>
                    <h1 style={{ fontWeight: 700 }}>Explore Our Luxury Rooms</h1>
                </div>

                <Row className="justify-content-center g-4">
                    {rooms.map((room, i) => (
                        <Col key={i} lg={3} md={6} sm={12}>
                            <Card
                                style={{
                                    border: "none",
                                    overflow: "hidden",
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-8px)";
                                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
                                }}
                            >
                                <Card.Img
                                    variant="top"
                                    src={room.image}
                                    alt={room.title}
                                    style={{
                                        height: "240px",
                                        objectFit: "cover",
                                    }}
                                />
                                <Card.Body style={{ padding: "25px" }}>
                                    <Card.Title
                                        style={{
                                            fontWeight: 700,
                                            fontSize: "1.25rem",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        {room.title}
                                    </Card.Title>
                                    <Card.Text
                                        style={{
                                            color: "#666",
                                            fontSize: "15px",
                                            marginBottom: "20px",
                                            minHeight: "48px",
                                        }}
                                    >
                                        {room.desc}
                                    </Card.Text>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "var(--main-color)",
                                                fontWeight: 700,
                                                fontSize: "18px",
                                            }}
                                        >
                                            {room.price}$ <span style={{ color: "#888", fontWeight: 400 }}>/night</span>
                                        </span>
                                        <Button
                                            variant="outline-dark"
                                            style={{
                                                borderRadius: 0,
                                                letterSpacing: "1px",
                                                fontWeight: 500,
                                                textTransform: "uppercase",
                                                padding: "6px 14px",
                                                fontSize: "13px",
                                            }}
                                        >
                                            More details
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default ServiceSection;