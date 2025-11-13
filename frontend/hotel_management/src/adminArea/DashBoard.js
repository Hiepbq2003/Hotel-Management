import React, { useState, useEffect } from 'react';
// 💡 GIẢ ĐỊNH: api được import từ file apiConfig.js
import api from '../api/apiConfig';
import { FaBed, FaCalendarCheck, FaDollarSign, FaUsers, FaCheck, FaTimes } from 'react-icons/fa';

const ALLOWED_ACCESS_ROLES = ['ADMIN']; 

// Hàm định dạng tiền tệ (VND) - Giữ nguyên
const formatVND = (amount) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount === null) return '0 VND';
    
    return numAmount.toLocaleString('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0
    });
};

// Hàm trích xuất lỗi chi tiết (Theo phong cách UserManagement)
const getErrorMessage = (err) => {
    if (err.response && err.response.data) {
        // Kiểm tra nếu body là string (thường là lỗi IllegalArgumentException)
        if (typeof err.response.data === 'string') {
            // Cắt bớt stacktrace nếu quá dài
            return err.response.data.substring(0, 200) + (err.response.data.length > 200 ? '...' : '');
        }
        // Nếu là JSON (thường là lỗi validation 400 hoặc cấu trúc lỗi khác)
        if (typeof err.response.data === 'object' && err.response.data.message) {
            return err.response.data.message;
        }
        // Nếu là JSON từ API reset pass mới
        if (typeof err.response.data === 'object' && err.response.data.error) {
            return err.response.data.error;
        }
        // Nếu là string lỗi không xác định
        if (typeof err.response.data === 'string') {
            return err.response.data;
        }
    }
    return "Lỗi không xác định hoặc lỗi kết nối mạng.";
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
    
    // Lấy giá trị hiện tại cho hiển thị và kiểm tra quyền (Phong cách UserManagement)
    const currentUserRole = localStorage.getItem('userRole') ? localStorage.getItem('userRole').toUpperCase() : '';
    // const currentUserId = localStorage.getItem('userId');

    // --- Data Fetching Logic (Sử dụng api.get) ---
    const fetchDashboardStats = async () => {
        setLoading(true);
        setError(null);
        try {
            // Sử dụng api.get thay vì raw fetch
            // Giả định apiConfig đã cấu hình Base URL và JWT Authorization Header
            const response = await api.get('/admin/dashboard/stats'); 
            
            // api utility thường trả về data trực tiếp hoặc là một object có trường data
            const data = response.data || response; 

            setStats({
                // Giả định cấu trúc data khớp với DashboardStatsResponse DTO của backend
                ...data,
                // Giữ nguyên logic fallback/mock nếu cần
                bookingsToday: data.bookingsToday !== undefined ? data.bookingsToday : 15, 
            });
            setError(null);
        } catch (err) {
            console.error("Lỗi tải dữ liệu Dashboard:", err);
            // Sử dụng hàm getErrorMessage để trích xuất lỗi
            const errorMessage = getErrorMessage(err);
            setError(`Không thể tải dữ liệu Dashboard. ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // --- Side Effects (Initial Load & Permission Check - Phong cách UserManagement) ---
    useEffect(() => {
        // 1. Kiểm tra quyền truy cập
        if (!ALLOWED_ACCESS_ROLES.includes(currentUserRole)) {
            setError('Bạn không có quyền truy cập trang Dashboard này. Chỉ Admin mới được phép.');
            setLoading(false);
            return;
        }
        
        // 2. Kiểm tra JWT token (giả sử apiConfig chưa kiểm tra)
        // Trong UserManagement không kiểm tra token ở đây vì api utility lo. Ta cũng bỏ qua.
        
        fetchDashboardStats();
    }, [currentUserRole]); // Phụ thuộc vào currentUserRole

    // Chuẩn bị dữ liệu hiển thị (Giữ nguyên)
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

    // Xử lý trạng thái Loading
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

    // Xử lý trạng thái Lỗi
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
            <h1 className='text-center mb-4 text-primary'>
                Bảng Điều Khiển Quản Lý
            </h1>
            
            <p className='text-center text-muted'>
                {stats.totalEmployees !== null ? `Bạn đang xem Dashboard với vai trò ${currentUserRole.toUpperCase()}.` : 'Chào mừng đến với Dashboard.'}
            </p>

            {/* Hàng chứa các ô thống kê (Stats Cards) */}
            <div className="row">
                {statsToDisplay.map((stat, index) => (
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4" key={index}> 
                        <div className={`card text-white ${stat.bgColor} shadow-lg h-100`}>
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-8">
                                        <p className="card-title text-white mb-1 fw-bold">{stat.title}</p>
                                        <h3 className="card-text fw-bold">{stat.value}</h3>
                                    </div>
                                    <div className="col-4 text-end">
                                        {stat.icon && <stat.icon size={40} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <hr className="my-4"/>

            {/* Khu vực Biểu đồ/Bảng dữ liệu */}
            <div className="row">
                {/* Biểu đồ Doanh thu */}
                <div className="col-lg-8 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-header bg-light fw-bold">
                            Doanh thu 7 ngày gần nhất
                        </div>
                        <div className="card-body" style={{ height: '300px' }}>
                            <p className="text-muted text-center pt-5">
                                [Vị trí hiển thị Biểu đồ Doanh thu thực tế]
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Biểu đồ Trạng thái Phòng */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-header bg-light fw-bold">
                            Tỷ lệ Phòng Trống/Đã Đặt
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                            <p className="text-muted text-center">
                                Tổng phòng: **{stats.totalRooms}**<br/>
                                Phòng trống: **{stats.availableRooms}** ({stats.totalRooms > 0 ? ((stats.availableRooms / stats.totalRooms) * 100).toFixed(1) : 0}%)<br/>
                                Phòng đã đặt: **{stats.bookedRooms}** ({stats.totalRooms > 0 ? ((stats.bookedRooms / stats.totalRooms) * 100).toFixed(1) : 0}%)<br/>
                                [Vị trí hiển thị Biểu đồ Tròn]
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bảng đặt phòng sắp tới */}
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-header bg-light fw-bold">
                            Danh sách Đặt phòng Sắp tới
                        </div>
                        <div className="card-body">
                            <p className="text-muted text-center">
                                [Vị trí hiển thị Bảng Đặt phòng sắp tới]
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;