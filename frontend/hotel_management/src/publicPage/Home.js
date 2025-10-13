import React from "react";
import { Carousel, Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaRegCalendarAlt } from "react-icons/fa";

const Home = () => {
    const images = [
        "https://www.orchidhotel.com/static/website/img/hotels/panchgani/homepage_slider/homepage_slider.webp",
        "https://www.internationalhotel.it/wp-content/uploads/sites/195/2025/01/internetional_hotel_piscine_gallery_18_n.jpg",
        "https://content.r9cdn.net/rimg/himg/2e/7b/a5/expedia_group-94818-faad0b-358361.jpg?width=1366&height=768&crop=true",
    ];

    return (
        <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
            {/* Carousel Background */}
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

            {/* Overlay content */}
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
                        {/* Left: Text */}
                        <Col lg={6} md={12} className="text-lg-start text-center mb-4 mb-lg-0">
                            <h1
                                style={{
                                    fontSize: "3.5rem",
                                    fontWeight: "600",
                                    lineHeight: "1.2",
                                }}
                            >
                                Sona A Luxury Hotel
                            </h1>
                            <p
                                style={{
                                    maxWidth: "450px",
                                    color: "#eee",
                                    margin: "20px 0",
                                    fontSize: "1.05rem",
                                }}
                            >
                                Here are the best hotel booking sites, including recommendations
                                for international travel and for finding low-priced hotel rooms.
                            </p>
                            <Button
                                variant="outline-light"
                                style={{
                                    borderRadius: "0",
                                    letterSpacing: "1px",
                                    fontWeight: "500",
                                }}
                            >
                                DISCOVER NOW
                            </Button>
                        </Col>

                        {/* Right: Booking Form */}
                        <Col
                            lg={4}
                            md={10}
                            className="ms-auto bg-white text-dark rounded"
                            style={{
                                boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                                opacity: 0.95,
                                padding: "55px"
                            }}
                        >
                            <h3 className="mb-4 text-center fw-semibold">Booking Your Hotel</h3>

                            <Form className="text-secondary">
                                {/* Check In */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Check In:</Form.Label>
                                    <div style={{ position: "relative" }}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Check in date"
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => !e.target.value && (e.target.type = "text")}
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

                                {/* Check Out */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Check Out:</Form.Label>
                                    <div style={{ position: "relative" }}>
                                        <Form.Control
                                            type="date"
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

                                {/* Guests */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Guests:</Form.Label>
                                    <Form.Select style={{ borderRadius: 0 }}>
                                        <option>2 ADULTS</option>
                                        <option>1 ADULT</option>
                                        <option>3 ADULTS</option>
                                        <option>4 ADULTS</option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Room */}
                                <Form.Group className="mb-4">
                                    <Form.Label>Room:</Form.Label>
                                    <Form.Select style={{ borderRadius: 0 }}>
                                        <option>1 ROOM</option>
                                        <option>2 ROOMS</option>
                                        <option>3 ROOMS</option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Button */}
                                <Button
                                    variant="outline-dark"
                                    className="w-100"
                                    style={{
                                        borderRadius: 0,
                                        fontWeight: "600",
                                        padding: "10px 0",
                                        letterSpacing: "1px",
                                        color: "#222",
                                        borderColor: "#222",
                                    }}
                                >
                                    CHECK AVAILABILITY
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Home;
