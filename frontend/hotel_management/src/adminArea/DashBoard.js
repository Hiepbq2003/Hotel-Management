import React, { useState, useEffect } from 'react';
import api from '../api/apiConfig';
import { FaBed, FaCalendarCheck, FaDollarSign, FaUsers, FaCheck, FaTimes, FaUserTie } from 'react-icons/fa';

// --- Constants ---
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

// Hàm trích xuất lỗi chi tiết (Sử dụng phiên bản an toàn hơn để tránh TypeError)
const getErrorMessage = (err) => {
    if (!err) {
        return "Lỗi không xác định hoặc không có đối tượng lỗi.";
    }

    // 1. Kiểm tra Lỗi Status (403, 401)
    if (err.status === 403) {
        return "Lỗi 403: Không có quyền truy cập. Vui lòng kiểm tra lại quyền hạn hoặc đăng nhập.";
    }
    if (err.status === 401) {
        return "Lỗi 401: Token hết hạn hoặc không hợp lệ (Vui lòng đăng nhập lại).";
    }
    
    // 2. Kiểm tra Lỗi Timeout/Mạng (sử dụng String() an toàn)
    const errMessage = err.message ? String(err.message) : "";

    if (errMessage.includes("Request timeout")) {
        return "Server không phản hồi (Timeout).";
    }
    if (errMessage.includes("Failed to fetch")) {
        return "Lỗi kết nối mạng.";
    }
    
    // 3. Xử lý lỗi JSON từ backend
    let message = errMessage || "Lỗi không xác định.";
    if (err.data && typeof err.data === 'object' && (err.data.message || err.data.error)) {
        message = err.data.message || err.data.error;
    }
    
    return message;
};


// --- CHART COMPONENTS (Pure CSS/HTML Replacement) ---

// 1. Biểu đồ Tròn (Doughnut Chart Replacement) - Giữ nguyên
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
                    {/* CẬP NHẬT: Thay đổi width để phù hợp với 12 cột (7.5%) */}
                    <div key={index} className="d-flex flex-column align-items-center" style={{ width: data.values.length > 7 ? '7.5%' : '10%' }}>
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

// HÀM TẠO DỮ LIỆU BIỂU ĐỒ THÁNG (12 Tháng gần nhất)
const generateMonthlyTrendData = (annualRevenue) => {
    const numericAnnualRevenue = Number(annualRevenue);
    
    // Nếu doanh thu năm < 12 triệu VND (tức trung bình < 1 triệu/tháng), dùng giá trị mock 600 triệu VND (50M/tháng * 12)
    const mockAnnualRevenue = 600000000;
    const revenue = (numericAnnualRevenue && numericAnnualRevenue > 12000000) ? numericAnnualRevenue : mockAnnualRevenue;
    
    const baseMonthlyRevenue = revenue / 12; // Giá trị trung bình hàng tháng
    
    const labels = [];
    const values = [];
    
    const currentDate = new Date();
    // Lấy 12 tháng gần nhất
    for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        labels.push(`Tháng ${date.getMonth() + 1}`);
        
        // Tạo dữ liệu giả lập có biến động nhẹ cho từng tháng (biến động 40%)
        const monthlyValue = Math.max(0, baseMonthlyRevenue + (Math.random() - 0.5) * baseMonthlyRevenue * 0.4); 
        values.push(Math.round(monthlyValue / 1000000) * 1000000); // Làm tròn đến hàng triệu
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
    // Cập nhật: Sử dụng hàm tạo data 12 tháng và truyền 0 để kích hoạt mock annual data ban đầu
    const [revenueChartData, setRevenueChartData] = useState(generateMonthlyTrendData(0));
    
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
            
            // Cập nhật: Sử dụng totalAnnualRevenue để tạo trend 12 tháng
            setRevenueChartData(generateMonthlyTrendData(data.totalAnnualRevenue));
            
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
                        {/* Cập nhật tiêu đề sang Biến động 12 tháng */}
                        <div className="card-header bg-light fw-bold text-primary">
                            Biến động Doanh thu 12 tháng gần nhất (Triệu VND)
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