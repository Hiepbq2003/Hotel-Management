import React from 'react';
import { Carousel, Container} from "react-bootstrap";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
const TestimonialsSection = () => {
    return (
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
    );
};

export default TestimonialsSection;