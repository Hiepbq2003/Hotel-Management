import React, { useState, useEffect } from 'react';
import api from '../api/apiConfig';
import { FaBed, FaCalendarCheck, FaDollarSign, FaUsers, FaCheck, FaTimes, FaUserTie } from 'react-icons/fa';

// --- Constants ---
// Cập nhật để cho phép các vai trò khác truy cập Dashboard
const ALLOWED_ACCESS_ROLES = ['ADMIN', 'MANAGER', 'RECEPTION']; 

// --- UTILITY FUNCTIONS ---

// Hàm định dạng tiền tệ (VND)
const formatVND = (amount) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount === null) return '0 VND';
    
    return numAmount.toLocaleString('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0
    }).replace('₫', 'VND');
};

// Hàm trích xuất lỗi chi tiết
const getErrorMessage = (err) => {
    if (err && err.message === "Request timeout") {
        return "Server không phản hồi (Timeout).";
    }
    if (err && err.message && err.message.includes("Failed to fetch")) {
        return "Lỗi kết nối mạng.";
    }
    if (err && err.status === 403) {
        return "Không có quyền truy cập (403 Forbidden).";
    }
    if (err.status === 401) {
        return "Token hết hạn hoặc không hợp lệ (Vui lòng đăng nhập lại).";
    }
    
    // Logic xử lý lỗi JSON từ backend (đã được sửa lại để ổn định hơn)
    let message = "Lỗi không xác định.";
    if (err && err.message) message = err.message;
    if (err && err.data && typeof err.data === 'object' && (err.data.message || err.data.error)) {
        message = err.data.message || err.data.error;
    }
    return message;
};


// --- CHART COMPONENTS (Pure CSS/HTML Replacement) ---

// 1. Biểu đồ Tròn (Doughnut Chart Replacement)
const DoughnutPlaceholder = ({ available, booked, total }) => {
    if (total === 0) {
        return <p className="text-muted text-center pt-5">Không có dữ liệu phòng.</p>;
    }

    const availablePercent = total > 0 ? (available / total) * 100 : 0;
    const bookedPercent = total > 0 ? (booked / total) * 100 : 0;

    return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100">
            {/* Vòng tròn hiển thị tỷ lệ */}
            <div 
                className="rounded-circle shadow-sm" 
                style={{
                    width: '150px',
                    height: '150px',
                    background: `conic-gradient(#28a745 0% ${availablePercent}%, #dc3545 ${availablePercent}% 100%)`,
                    clipPath: 'polygon(50% 0%, 50% 15%, 100% 15%, 100% 85%, 50% 85%, 50% 100%, 0% 100%, 0% 0%)'
                }}
            >
                <div className="d-flex align-items-center justify-content-center h-100">
                    <span className="fw-bold text-dark fs-5">{total}</span>
                </div>
            </div>
            
            {/* Chú giải */}
            <div className="mt-3 text-start w-75">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-success me-2"></span>
                    <span className="text-muted small">Phòng Trống: </span>
                    <span className="fw-bold ms-auto">{available} ({availablePercent.toFixed(1)}%)</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-danger me-2"></span>
                    <span className="text-muted small">Phòng Đã Đặt: </span>
                    <span className="fw-bold ms-auto">{booked} ({bookedPercent.toFixed(1)}%)</span>
                </div>
            </div>
        </div>
    );
};

// 2. Biểu đồ Đường (Line Chart Replacement -> Vertical Bar Chart)
const RevenueBarChart = ({ data }) => {
    const maxRevenue = Math.max(...data.values);

    return (
        <div className="d-flex align-items-end justify-content-around h-100 p-3" style={{ borderLeft: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
            {data.values.map((value, index) => {
                const heightPercent = maxRevenue > 0 ? (value / maxRevenue) * 90 : 0; // 90% chiều cao tối đa
                const displayValue = (value / 1000000).toFixed(1);

                return (
                    <div key={index} className="d-flex flex-column align-items-center" style={{ width: '10%' }}>
                        {/* Cột biểu đồ */}
                        <div 
                            className="bg-info rounded-top shadow-sm"
                            style={{ 
                                height: `${heightPercent}%`, 
                                width: '80%', 
                                transition: 'height 0.5s ease-out' 
                            }}
                            title={`${formatVND(value)}`} // Tooltip khi hover
                        ></div>
                        {/* Giá trị trên đỉnh cột */}
                        <small className="text-muted mt-1" style={{ fontSize: '0.65rem' }}>{displayValue}Tr</small>
                        {/* Nhãn ngày */}
                        <small className="mt-1 fw-bold" style={{ fontSize: '0.7rem' }}>{data.labels[index]}</small>
                    </div>
                );
            })}
        </div>
    );
};

// Hàm tạo dữ liệu doanh thu giả lập 7 ngày
const generateRevenueData = (monthlyRevenue) => {
    const revenue = monthlyRevenue ? Number(monthlyRevenue) : 50000000;
    const baseDailyRevenue = revenue / 30;
    
    const labels = [];
    const values = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }));
        
        const dailyValue = Math.max(0, baseDailyRevenue + (Math.random() - 0.5) * baseDailyRevenue * 0.5);
        values.push(Math.round(dailyValue / 1000000) * 1000000); // Làm tròn đến hàng triệu
    }
    
    return { labels, values };
};


const DashBoard = () => {
    const [stats, setStats] = useState({
        totalRooms: 0,
        availableRooms: 0,
        bookedRooms: 0,
        totalMonthlyRevenue: 0,
        totalAnnualRevenue: 0,
        totalEmployees: null, 
        bookingsToday: 0, 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Sử dụng useState để lưu trữ dữ liệu cho biểu đồ Bar mới
    const [revenueChartData, setRevenueChartData] = useState(generateRevenueData(0));
    
    const currentUserRole = localStorage.getItem('userRole') ? localStorage.getItem('userRole').toUpperCase() : '';

    // --- Data Fetching Logic ---
    const fetchDashboardStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/dashboard/stats'); 
            const data = response.data || response; 

            setStats({
                ...data,
                bookingsToday: data.bookingsToday !== undefined ? data.bookingsToday : 0, 
            });
            
            // Cập nhật biểu đồ doanh thu dựa trên dữ liệu mới
            setRevenueChartData(generateRevenueData(data.totalMonthlyRevenue));
            
            setError(null);
        } catch (err) {
            console.error("Lỗi tải dữ liệu Dashboard:", err);
            const errorMessage = getErrorMessage(err);
            setError(`Không thể tải dữ liệu Dashboard. ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // --- Side Effects (Initial Load & Permission Check) ---
    useEffect(() => {
        if (!ALLOWED_ACCESS_ROLES.includes(currentUserRole)) {
            setError(`Bạn không có quyền truy cập trang Dashboard này. Chỉ ${ALLOWED_ACCESS_ROLES.join(', ')} mới được phép.`);
            setLoading(false);
            return;
        }
        
        fetchDashboardStats();
    }, [currentUserRole]);

    // Chuẩn bị dữ liệu hiển thị cho các Stats Cards
    const statsData = [
        { 
            title: "Tổng số Phòng", 
            value: stats.totalRooms, 
            icon: FaBed, 
            bgColor: "bg-primary", 
            iconColor: "#ffffff"
        },
        { 
            title: "Phòng Trống", 
            value: stats.availableRooms, 
            icon: FaCheck, 
            bgColor: "bg-success",
            iconColor: "#ffffff"
        },
        { 
            title: "Phòng Đã Đặt",
            value: stats.bookedRooms, 
            icon: FaTimes, 
            bgColor: "bg-danger",
            iconColor: "#ffffff"
        },
        {
            title: "Đặt phòng hôm nay",
            value: stats.bookingsToday,
            icon: FaCalendarCheck, 
            bgColor: "bg-info",
            iconColor: "#ffffff"
        },
        { 
            title: "Tổng Thu nhập (Tháng)", 
            value: formatVND(stats.totalMonthlyRevenue), 
            icon: FaDollarSign, 
            bgColor: "bg-warning",
            iconColor: "#ffffff"
        },
        { 
            title: "Tổng Thu nhập (Năm)", 
            value: formatVND(stats.totalAnnualRevenue), 
            icon: FaDollarSign, 
            bgColor: "bg-secondary",
            iconColor: "#ffffff"
        },
        // Thẻ nhân viên chỉ hiển thị nếu có dữ liệu
        ...(stats.totalEmployees !== null ? [{ 
            title: "Tổng số Nhân viên", 
            value: stats.totalEmployees, 
            icon: FaUserTie, // Dùng FaUserTie cho Nhân viên
            bgColor: "bg-dark", 
            iconColor: "#ffffff"
        }] : [])
    ];
    
    // --- RENDER ---

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Đang tải dữ liệu Dashboard từ API...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="alert alert-danger" role="alert">
                    <strong>Lỗi:</strong> {error}
                    <button onClick={fetchDashboardStats} className="btn btn-sm btn-link text-danger">Thử lại</button>
                </div>
            </div>
        );
    }


    return (
        <div className="container-fluid py-4">
            <h1 className='text-center mb-4 text-primary fw-bold'>
                Bảng Điều Khiển Quản Lý Khách Sạn
            </h1>
            
            <p className='text-center text-muted mb-5'>
                Chào mừng, {currentUserRole.toUpperCase()}. Dưới đây là tổng quan hiệu suất hiện tại.
            </p>

            {/* Hàng chứa các ô thống kê (Stats Cards) */}
            <div className="row">
                {statsData.map((stat, index) => (
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4" key={index}> 
                        <div className={`card text-white ${stat.bgColor} shadow-lg h-100 rounded-3`}>
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-8">
                                        <p className="card-title text-white mb-1 fw-bold opacity-75">{stat.title}</p>
                                        <h3 className="card-text fw-bold text-truncate">{stat.value}</h3>
                                    </div>
                                    <div className="col-4 text-end">
                                        {stat.icon && <stat.icon size={40} style={{ color: stat.iconColor }} />}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-transparent border-top-0 pt-0 pb-2">
                                <small className="text-white opacity-75">Cập nhật theo thời gian thực</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <hr className="my-5 border-2 border-light opacity-50"/>

            {/* Khu vực Biểu đồ/Bảng dữ liệu */}
            <div className="row">
                {/* Biểu đồ Doanh thu (Bar Chart Pure CSS) */}
                <div className="col-lg-8 mb-4">
                    <div className="card shadow h-100 rounded-3">
                        <div className="card-header bg-light fw-bold text-primary">
                            Biến động Doanh thu 7 ngày gần nhất (Triệu VND)
                        </div>
                        <div className="card-body" style={{ height: '400px' }}>
                            <RevenueBarChart data={revenueChartData} />
                        </div>
                    </div>
                </div>
                
                {/* Biểu đồ Trạng thái Phòng (Doughnut Chart Pure CSS) */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow h-100 rounded-3">
                        <div className="card-header bg-light fw-bold text-primary">
                            Tỷ lệ Trạng thái Phòng
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                            <DoughnutPlaceholder 
                                available={stats.availableRooms} 
                                booked={stats.bookedRooms} 
                                total={stats.totalRooms}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <hr className="my-5 border-2 border-light opacity-50"/>

            {/* Bảng đặt phòng sắp tới (Giữ nguyên Placeholder) */}
            <div className="row">
                <div className="col-12">
                    <div className="card shadow rounded-3">
                        <div className="card-header bg-light fw-bold text-primary">
                            Danh sách Đặt phòng Sắp tới (Pending/Reserved)
                        </div>
                        <div className="card-body">
                            <p className="text-muted text-center pt-3 pb-3">
                                [Vị trí hiển thị Bảng Đặt phòng sắp tới - Cần thêm API để lấy danh sách này]
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;