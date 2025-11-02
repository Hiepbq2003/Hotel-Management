import React from "react";
import { Container, Row, Col,Card } from "react-bootstrap";
import { FaClock } from "react-icons/fa";
import HeroSection from "./HeroSection";
import ServiceSection from "./ServiceSection";
import TestimonialsSection from "./TestimonialsSection";
const Home = () => {

    const blogs = [
        {
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            category: "TRAVEL TRIP",
            title: "Tremblant In Canada",
            date: "15TH APRIL, 2019",
        },
        {
            image: "https://images.unsplash.com/photo-1518684079-3c830dcef090",
            category: "CAMPING",
            title: "Choosing A Static Caravan",
            date: "15TH APRIL, 2019",
        },
        {
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            category: "EVENT",
            title: "Copper Canyon",
            date: "21TH APRIL, 2019",
        },
        {
            image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
            category: "EVENT",
            title: "Trip To Iqaluit In Nunavut A Canadian Arctic City",
            date: "08TH APRIL, 2019",
        },
        {
            image: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9",
            category: "TRAVEL",
            title: "Traveling To Barcelona",
            date: "12TH APRIL, 2019",
        },
        {
            image: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9",
            category: "TRAVEL",
            title: "Traveling To Barcelona",
            date: "12TH APRIL, 2019",
        },
    ];

    return (
        <>
            <HeroSection />
            {/* About us */}
            <Container style={{ marginTop: "120px", marginBottom: "140px", paddingRight: "50px", paddingLeft: "100px" }}>
                <Row className="align-items-center">
                    {/* Left side: Text */}
                    <Col lg={6} md={12} style={{ paddingRight: "20px" }}>
                        <p
                            style={{
                                textTransform: "uppercase",
                                color: "var(--main-color)",
                                fontWeight: 700,
                            }}
                        >
                            About Us
                        </p>
                        <h1
                            style={{
                                fontWeight: 700,
                                fontSize: "2.8rem",
                                marginBottom: "25px",
                                lineHeight: "1.2",
                            }}
                        >
                            Intercontinental LA <br />
                            Westlake Hotel
                        </h1>
                        <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.8" }}>
                            Sona.com is a leading online accommodation site. We’re passionate
                            about travel. Every day, we inspire and reach millions of travelers
                            across 90 local websites in 41 languages. <br />
                            <br />
                            So when it comes to booking the perfect hotel, vacation rental,
                            resort, apartment, guest house, or tree house — we’ve got you
                            covered.
                        </p>
                        <p
                            style={{
                                display: "inline-block",
                                fontWeight: 600,
                                borderBottom: "4px solid var(--main-color)",
                                paddingBottom: "5px",
                            }}
                        >
                            READ MORE
                        </p>
                    </Col>

                    {/* Right side: Images */}
                    <Col
                        lg={6}
                        md={12}
                        style={{
                            display: "flex",
                            flexDirection: "row", // xếp dọc
                            alignItems: "center", // căn giữa theo chiều ngang
                            gap: "35px", // khoảng cách giữa 2 ảnh
                        }}
                    >
                        {/* Ảnh 1 */}
                        <img
                            src="https://lh3.googleusercontent.com/proxy/Y16BeNVz6hzGj6N4RpNrn_92xEvPTKhWFPs3xU4j9RQeKks3Onmjv7kWd55WE-2KDUPLaiccX7ROsJqQ-2nYJ6UOVKZOuR4_pUR48pPa"
                            alt="Hotel exterior 1"
                            style={{
                                width: "100%", // to hết cột
                                borderRadius: "12px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                                objectFit: "cover",
                                height: "420px", // chiều cao cố định, bạn có thể chỉnh
                            }}
                        />

                        {/* Ảnh 2 */}
                        <img
                            src="https://hoangthanhthanglong.vn/wp-content/uploads/2023/05/lythaito6.jpg"
                            alt="Hotel exterior 2"
                            style={{
                                width: "100%",
                                borderRadius: "12px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                objectFit: "cover",
                                height: "420px",
                            }}
                        />
                    </Col>


                </Row>
            </Container>
            <hr style={{ marginBottom: "100px" }}></hr>
            <ServiceSection />
            <TestimonialsSection/>
            <Row className="justify-content-center">
                <Col lg={9}>
                    <Container style={{ marginTop: "80px", marginBottom: "100px", textAlign: "center" }}>
                        {/* Heading */}
                        <p
                            style={{
                                textTransform: "uppercase",
                                color: "var(--main-color)",
                                fontWeight: "600",
                                marginBottom: "8px",
                                letterSpacing: "2px",
                            }}
                        >
                            Hotel News
                        </p>
                        <h1 style={{ fontWeight: "700", marginBottom: "50px" }}>Our Blog & Event</h1>

                        {/* Blog Grid */}
                        <Row className="justify-content-center g-4">
                            {blogs.map((blog, i) => (
                                <Col key={i} lg={4} md={6}>
                                    <Card
                                        style={{
                                            border: "none",
                                            borderRadius: "10px",
                                            overflow: "hidden",
                                            position: "relative",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {/* Image */}
                                        <Card.Img
                                            src={blog.image}
                                            alt={blog.title}
                                            style={{
                                                height: "350px",
                                                objectFit: "cover",
                                                transition: "transform 0.4s ease",
                                            }}
                                        />
                                        {/* Overlay content */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "0",
                                                left: "0",
                                                right: "0",
                                                padding: "25px",
                                                color: "#fff",
                                                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 70%)",
                                                textAlign: "left",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    backgroundColor: "var(--main-color)",
                                                    padding: "4px 10px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    textTransform: "uppercase",
                                                    marginBottom: "8px",
                                                    display: "inline-block",
                                                }}
                                            >
                                                {blog.category}
                                            </span>
                                            <h5 style={{ fontWeight: "700", marginTop: "10px" }}>{blog.title}</h5>
                                            <div style={{ fontSize: "14px", marginTop: "10px", opacity: "0.9" }}>
                                                <FaClock style={{ marginRight: "6px" }} />
                                                {blog.date}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </Col>
            </Row>
        </>
    );
};

export default Home;
