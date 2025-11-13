import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Row, 
    Col, 
    Spinner, 
    Alert, 
    Badge,
    Card, // Sử dụng Card component của React Bootstrap
    Button
} from 'react-bootstrap'; 
// Cần cài đặt và import từ thư viện react-icons/fa
import { FaBed, FaCalendarCheck, FaDollarSign, FaUsers, FaCheck, FaTimes } from 'react-icons/fa';

// --- Constants ---
// 💡 GIẢ ĐỊNH: BASE_URL được lấy từ file apiConfig.js
const BASE_URL = 'http://localhost:8080/api'; 
const API_ENDPOINT = '/admin/dashboard/stats';

// --- Helper Functions ---

// Hàm định dạng tiền tệ (VND)
const formatVND = (amount) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount === null) return '0 VND';
    
    return numAmount.toLocaleString('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0
    });
};

// Hàm lấy variant màu cho role (dựa trên UserManagement)
const getRoleVariant = (role) => {
    switch (role.toUpperCase()) {
        case 'ADMIN': return 'danger';
        case 'MANAGER': return 'warning';
        case 'RECEPTION': return 'info';
        case 'HOUSEKEEPING': return 'primary';
        default: return 'secondary';
    }
}

// Hàm trích xuất lỗi (Đã được điều chỉnh để hoạt động với Fetch API response)
const getErrorMessage = (error, status) => {
    // 1. Lỗi phân quyền/HTTP Status
    if (status === 403) {
        return "403 Forbidden: Bạn không có quyền truy cập vào Dashboard này.";
    }
    if (status) {
        return `Lỗi HTTP: ${status}. Không thể tải dữ liệu thống kê.`;
    }
    
    // 2. Lỗi mạng/Response body
    if (error instanceof Error) {
        return error.message;
    }
    
    // 3. Giả định lỗi từ body response (theo format JSON của backend)
    if (typeof error === 'object' && error !== null) {
        if (error.message) {
             return error.message;
        }
        if (error.error) {
             return error.error;
        }
    }
    
    return "Lỗi không xác định hoặc lỗi kết nối mạng.";
};

// --- Dashboard Component ---

const DashBoard = () => {
    const [stats, setStats] = useState({
        totalRooms: 0,
        availableRooms: 0,
        bookedRooms: 0,
        totalMonthlyRevenue: 0,
        totalAnnualRevenue: 0,
        totalEmployees: null, 
        bookingsToday: 0, // Giả định
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Lấy Role và Token bảo mật
    const userRole = localStorage.getItem('userRole') || 'STAFF'; 
    const authToken = localStorage.getItem('authToken'); 

    // Hàm fetch dữ liệu sử dụng Fetch API (kèm logic bảo mật)
    const fetchDashboardStats = async () => {
        setLoading(true);
        setError(null);
        
        if (!authToken) {
            setError("Lỗi xác thực: Không tìm thấy Token đăng nhập.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                }
            });

            // 1. Xử lý lỗi HTTP Status
            if (!response.ok) {
                let errorBody = {};
                try {
                    // Cố gắng đọc body nếu có
                    errorBody = await response.json();
                } catch (e) {
                    // Nếu không phải JSON, bỏ qua
                }
                
                // Sử dụng hàm getErrorMessage để format lỗi
                const parsedError = getErrorMessage(errorBody, response.status);
                throw new Error(parsedError);
            }

            // 2. Parse dữ liệu thành công
            const data = await response.json();

            // Cập nhật state
            setStats({
                ...data,
                bookingsToday: 15, // Dữ liệu giả lập tạm thời cho Booking hôm nay (nếu backend chưa có)
            });
            
        } catch (err) {
            console.error("Lỗi tải dữ liệu Dashboard:", err);
            setError(err.message || "Lỗi không xác định khi giao tiếp với API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, [authToken]); // Dependency: Chạy lại khi token thay đổi

    
    // Chuẩn bị dữ liệu hiển thị từ state đã fetch
    const statsData = [
        { 
            title: "Tổng số Phòng", 
            value: stats.totalRooms, 
            icon: FaBed, 
            bgColor: "bg-primary" 
        },
        { 
            title: "Phòng Trống", 
            value: stats.availableRooms, 
            icon: FaCheck, 
            bgColor: "bg-success" 
        },
        { 
            title: "Phòng Đã Đặt",
            value: stats.bookedRooms, 
            icon: FaTimes, 
            bgColor: "bg-danger" 
        },
        {
            title: "Đặt phòng hôm nay",
            value: stats.bookingsToday,
            icon: FaCalendarCheck, 
            bgColor: "bg-info" 
        },
        { 
            title: "Tổng Thu nhập (Tháng)", 
            value: formatVND(stats.totalMonthlyRevenue), 
            icon: FaDollarSign, 
            bgColor: "bg-warning" 
        },
        { 
            title: "Tổng Thu nhập (Năm)", 
            value: formatVND(stats.totalAnnualRevenue), 
            icon: FaDollarSign, 
            bgColor: "bg-dark" 
        },
        // Thẻ này chỉ hiển thị khi backend trả về giá trị (tức là khi người dùng có quyền Admin/Manager)
        { 
            title: "Tổng số Nhân viên", 
            value: stats.totalEmployees, 
            icon: FaUsers, 
            bgColor: "bg-secondary", 
            adminOnly: true 
        },
    ];

    // Lọc các thẻ thống kê: chỉ hiển thị thẻ Nhân viên nếu totalEmployees không null
    const statsToDisplay = stats.totalEmployees !== null 
        ? statsData 
        : statsData.filter(stat => !stat.adminOnly);
        
    // Hàm ánh xạ màu nền Bootstrap
    const getBgColorClass = (stat) => {
        const variantMap = {
            "bg-primary": "primary",
            "bg-success": "success",
            "bg-danger": "danger",
            "bg-info": "info",
            "bg-warning": "warning",
            "bg-dark": "dark",
            "bg-secondary": "secondary",
        };
        return variantMap[stat.bgColor] || 'secondary';
    };


    // --- Conditional Rendering ---
    
    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-3">Đang tải dữ liệu Dashboard từ API...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger" className="text-center">
                    <Alert.Heading>Lỗi Tải Dữ Liệu</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <Button variant="outline-danger" onClick={fetchDashboardStats}>
                        Thử tải lại
                    </Button>
                </Alert>
            </Container>
        );
    }


    return (
        <Container fluid className="my-4">
            <Row className="mb-4">
                <Col className="text-center">
                    <h2 className="text-primary display-6 fw-bold">📊 Bảng Điều Khiển Quản Lý</h2>
                    <p className="lead text-muted">
                        Quyền hạn: <Badge bg={getRoleVariant(userRole)} className="fs-6">{userRole.toUpperCase()}</Badge>
                    </p>
                </Col>
            </Row>

            {/* Hàng chứa các ô thống kê (Stats Cards) */}
            <Row className="g-4"> 
                {statsToDisplay.map((stat, index) => (
                    // Sử dụng Col xs=12, md=6, lg=4, xl=3 để đảm bảo Responsive
                    <Col xs={12} md={6} lg={4} xl={3} key={index}>
                        <Card 
                            bg={getBgColorClass(stat)} 
                            text="white" 
                            className="shadow-lg h-100 border-0"
                        >
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <Card.Title className="text-uppercase mb-1 fs-6">{stat.title}</Card.Title>
                                        <Card.Text className="fs-3 fw-bold">{stat.value}</Card.Text>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {stat.icon && <stat.icon size={40} className="opacity-75" />}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            
            <hr className="my-5"/>

            {/* Khu vực Biểu đồ/Bảng dữ liệu */}
            <Row className="g-4">
                {/* Biểu đồ Doanh thu */}
                <Col lg={8}>
                    <Card className="shadow-lg h-100">
                        <Card.Header className="fw-bold bg-light">
                            💰 Biểu đồ Doanh thu (Monthly/Annual trend)
                        </Card.Header>
                        <Card.Body style={{ minHeight: '300px' }}>
                            <p className="text-muted text-center pt-5">
                                [Vị trí hiển thị Biểu đồ Doanh thu chi tiết theo ngày/tháng]
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Tỷ lệ Phòng Trống/Đã Đặt */}
                <Col lg={4}>
                    <Card className="shadow-lg h-100">
                        <Card.Header className="fw-bold bg-light">
                             Tỷ lệ Phòng
                        </Card.Header>
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                            <h4 className="mb-3 text-secondary">Phân bổ hiện tại</h4>
                            <p className="fs-5">
                                Tổng phòng: <Badge bg="primary">{stats.totalRooms}</Badge><br/>
                                Phòng trống: <Badge bg="success">{stats.availableRooms}</Badge> ({stats.totalRooms > 0 ? ((stats.availableRooms / stats.totalRooms) * 100).toFixed(1) : 0}%)<br/>
                                Phòng đã đặt: <Badge bg="danger">{stats.bookedRooms}</Badge> ({stats.totalRooms > 0 ? ((stats.bookedRooms / stats.totalRooms) * 100).toFixed(1) : 0}%)<br/>
                            </p>
                            <p className="text-muted mt-3">
                                [Vị trí hiển thị Biểu đồ Tròn]
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            {/* Bảng đặt phòng sắp tới */}
            <Row className="mt-5">
                <Col xs={12}>
                    <Card className="shadow-lg">
                        <Card.Header className="fw-bold bg-light">
                            🗓️ Danh sách Đặt phòng Sắp tới
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted text-center">
                                [Vị trí hiển thị Bảng Dữ liệu các Reservation sắp đến]
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashBoard;