import React, { useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs'; 

const MAIN_COLOR = '#fbb500'; 
const BORDER_COLOR = '#ebebeb'; 

const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3723.992339892998!2d105.8437285!3d21.0329925!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab60b5b50655%3A0xf0544b33b06056a7!2sPeridot%20Grand%20Luxury%20Boutique%20Hotel!5e0!3m2!1svi!2s!4v1761292384406!5m2!1svi!2s"; 

const ContactUs = () => {

    useEffect(() => {

    }, []);

    const contactInfoContainerStyle = {
        paddingRight: '30px',
    };

    const contactTitleStyle = {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#222',
        marginBottom: '20px',
    };

    const contactParagraphStyle = {
        color: '#555',
        lineHeight: '1.7',
        fontSize: '16px',
        marginBottom: '35px',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    const getTableRowStyle = (isLast) => ({
        borderBottom: isLast ? 'none' : `1px solid ${BORDER_COLOR}`,
    });

    const tableHeaderStyle = {
        color: '#555',
        fontSize: '16px',
        padding: '12px 0',
        fontWeight: '700',
        width: '100px', 
        verticalAlign: 'top',
    };

    const tableDataStyle = {
        color: '#222',
        fontSize: '16px',
        padding: '12px 0',
    };

    const formInputBaseStyle = {
        width: '100%',
        height: '50px',
        border: `1px solid ${BORDER_COLOR}`,
        padding: '0 20px',
        marginBottom: '30px',
        fontSize: '16px',
        color: '#555',
        borderRadius: '5px',
        outline: 'none',
        transition: 'border-color 0.3s', 
    };

    const formTextareaBaseStyle = {
        width: '100%',
        height: '140px',
        border: `1px solid ${BORDER_COLOR}`,
        padding: '15px 20px',
        marginBottom: '30px',
        fontSize: '16px',
        color: '#555',
        borderRadius: '5px',
        resize: 'none',
        outline: 'none',
        transition: 'border-color 0.3s', 
    };

    const submitButtonStyle = {
        backgroundColor: MAIN_COLOR,
        color: 'white',
        border: 'none',
        padding: '15px 35px',
        fontSize: '16px',
        fontWeight: '600',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        textTransform: 'uppercase',
    };

    const mapContainerStyle = {
        marginTop: '100px', 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 5px 25px rgba(0,0,0,0.1)',
    };

    const mapIframeStyle = {
        width: '100%',
        height: '470px',
        border: '0',
        display: 'block',
    };

    return (
        <div>
            <section style={{ padding: '100px 0', backgroundColor: 'white' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="contact-text" style={contactInfoContainerStyle}>
                                <h2 style={contactTitleStyle}>Contact Info</h2>
                                <p style={contactParagraphStyle}>
                                    Feel free to reach out to us for any inquiries, bookings, or collaborations. Our team is here to assist you.
                                </p>
                                <table style={tableStyle}>
                                    <tbody>
                                        <tr style={getTableRowStyle(false)}>
                                            <td style={tableHeaderStyle}>Address:</td>
                                            <td style={tableDataStyle}>856 Cordia Extension Apt. 356, Lake, US</td>
                                        </tr>
                                        <tr style={getTableRowStyle(false)}>
                                            <td style={tableHeaderStyle}>Phone:</td>
                                            <td style={tableDataStyle}>(12) 345 67890</td>
                                        </tr>
                                        <tr style={getTableRowStyle(false)}>
                                            <td style={tableHeaderStyle}>Email:</td>
                                            <td style={tableDataStyle}>info.colorlib@gmail.com</td>
                                        </tr>
                                        <tr style={getTableRowStyle(true)}> 
                                            <td style={tableHeaderStyle}>Fax:</td>
                                            <td style={tableDataStyle}>+(12) 345 67890</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-lg-7 offset-lg-1">
                            <form action="#" className="contact-form">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <input 
                                            type="text" 
                                            placeholder="Your Name" 
                                            style={formInputBaseStyle}
                                            onFocus={(e) => e.currentTarget.style.borderColor = MAIN_COLOR}
                                            onBlur={(e) => e.currentTarget.style.borderColor = BORDER_COLOR}
                                        />
                                    </div>
                                    <div className="col-lg-6">
                                        <input 
                                            type="text" 
                                            placeholder="Your Email" 
                                            style={formInputBaseStyle}
                                            onFocus={(e) => e.currentTarget.style.borderColor = MAIN_COLOR}
                                            onBlur={(e) => e.currentTarget.style.borderColor = BORDER_COLOR}
                                        />
                                    </div>
                                    <div className="col-lg-12">
                                        <textarea 
                                            placeholder="Your Message"
                                            style={formTextareaBaseStyle}
                                            onFocus={(e) => e.currentTarget.style.borderColor = MAIN_COLOR}
                                            onBlur={(e) => e.currentTarget.style.borderColor = BORDER_COLOR}
                                        ></textarea>
                                        <button 
                                            type="submit" 
                                            style={submitButtonStyle}

                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d89b00'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = MAIN_COLOR}
                                        >
                                            Submit Now
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="map" style={mapContainerStyle}>
                        <iframe
                            src={MAP_EMBED_URL} 
                            style={mapIframeStyle}
                            allowFullScreen=""
                            aria-hidden="false"
                            tabIndex="0"
                            title="Google Map Location"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;