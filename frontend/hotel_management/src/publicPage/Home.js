import React from "react";
import { Carousel, Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaRegCalendarAlt, FaClock } from "react-icons/fa";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import {
    FaMapMarkerAlt,
    FaUtensils,
    FaBaby,
    FaTshirt,
    FaCar,
    FaCocktail,
} from "react-icons/fa";
const Home = () => {
    const images = [
        "https://peridotgrandhotel.com/wp-content/uploads/2022/09/2.-Lobby-Area-2-2000.jpg",
        "https://peridotgrandhotel.com/wp-content/uploads/2025/05/22th416454.jpg",
        "https://peridotgrandhotel.com/wp-content/uploads/2022/09/Ignite-Sky-Bar-Birdeye.jpg"
    ];
    const services = [
        { icon: <FaMapMarkerAlt />, title: "Travel Plan" },
        { icon: <FaUtensils />, title: "Catering Service" },
        { icon: <FaBaby />, title: "Babysitting" },
        { icon: <FaTshirt />, title: "Laundry" },
        { icon: <FaCar />, title: "Hire Driver" },
        { icon: <FaCocktail />, title: "Bar & Drink" },
    ];
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
            {/* Hero section */}
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
                                    opacity: 0.97,
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
            {/* Services Section */}
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
            {/* Testimonials Section */}
            <Container
                fluid
                style={{
                    backgroundColor: "#f9f9f9",
                    padding: "100px 0",
                    textAlign: "center",
                    position: "relative",
                    height: "600px"
                }}
            >
                <Container style={{ maxWidth: "900px" }}>
                    <p
                        style={{
                            textTransform: "uppercase",
                            color: "var(--main-color)",
                            fontWeight: 700,
                            letterSpacing: "1px",
                            marginBottom: "10px",
                        }}
                    >
                        Testimonials
                    </p>
                    <h1
                        style={{
                            fontWeight: 700,
                            fontSize: "2.8rem",
                            marginBottom: "40px",
                            color: "#222",
                        }}
                    >
                        What Customers Say?
                    </h1>

                    <Carousel
                        controls={true}
                        indicators={false}
                        interval={6000}
                        prevIcon={
                            <span
                                aria-hidden="true"
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                    width: "45px",
                                    height: "45px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#555",
                                    border: "1px solid #ddd",
                                }}
                            >
                                <IoIosArrowRoundBack style={{ fontSize: "30px" }} />
                            </span>
                        }
                        nextIcon={
                            <span
                                aria-hidden="true"
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                    width: "45px",
                                    height: "45px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#555",
                                    border: "1px solid #ddd",
                                }}
                            >
                                <IoIosArrowRoundForward style={{ fontSize: "30px" }} />
                            </span>
                        }
                        style={{
                            position: "relative",
                        }}
                    >
                        {/* Dịch vị trí 2 nút ra xa hơn */}
                        <style>
                            {`
                            .carousel-control-prev {
                             left: -140px !important; /* di chuyển nút trái ra xa */
                            }
                            .carousel-control-next {
                             right: -140px !important; /* di chuyển nút phải ra xa */
                            }
                        `}
                        </style>
                        <Carousel.Item>
                            <p
                                style={{
                                    fontSize: "1.1rem",
                                    color: "#555",
                                    lineHeight: "1.9",
                                    marginBottom: "30px",
                                }}
                            >
                                After a construction project took longer than expected, my husband, my daughter
                                and I needed a place to stay for a few nights. As a Chicago resident, we know a
                                lot about our city, neighborhood and the types of housing options available and
                                absolutely love our vacation at Sona Hotel.
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "15px",
                                }}
                            >
                                <span style={{ color: "#f5b50a", fontSize: "1.3rem" }}>★★★★★</span>
                                <span style={{ fontWeight: "600", color: "#222" }}>
                                    - Alexander Vasquez
                                </span>
                            </div>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tripadvisor_Logo_circle-green_vertical-lockup_registered.svg/120px-Tripadvisor_Logo_circle-green_vertical-lockup_registered.svg.png"
                                alt="Tripadvisor"
                                style={{ width: "80px", marginTop: "20px" }}
                            />
                        </Carousel.Item>

                        <Carousel.Item>
                            <p
                                style={{
                                    fontSize: "1.1rem",
                                    color: "#555",
                                    lineHeight: "1.9",
                                    marginBottom: "30px",
                                }}
                            >
                                The staff were extremely friendly and professional, and the rooms were clean and
                                luxurious. I highly recommend Sona Hotel for anyone seeking a relaxing and
                                memorable stay.
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "15px",
                                }}
                            >
                                <span style={{ color: "#f5b50a", fontSize: "1.3rem" }}>★★★★★</span>
                                <span style={{ fontWeight: "600", color: "#222" }}>
                                    - Maria Johnson
                                </span>
                            </div>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tripadvisor_Logo_circle-green_vertical-lockup_registered.svg/120px-Tripadvisor_Logo_circle-green_vertical-lockup_registered.svg.png"
                                alt="Tripadvisor"
                                style={{ width: "80px", marginTop: "20px" }}
                            />
                        </Carousel.Item>
                    </Carousel>
                </Container>
            </Container>
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
