import React, { useState, useEffect } from 'react';
import axios from 'axios';
// ⚠️ Cần cài đặt và import từ thư viện như react-icons/fa
import { FaBed, FaCalendarCheck, FaDollarSign, FaUsers, FaCheck, FaTimes } from 'react-icons/fa';

// 💡 GIẢ ĐỊNH: BASE_URL được lấy từ file apiConfig.js của bạn
// Ví dụ: const BASE_URL = 'http://localhost:8080/api';
const BASE_URL = 'http://localhost:8080/api'; 

// Hàm định dạng tiền tệ (VND)
const formatVND = (amount) => {
    // Chuyển đổi từ số (có thể là chuỗi từ JSON) sang định dạng tiền tệ
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount === null) return '0 VND';
    
    return numAmount.toLocaleString('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0
    });
};

const DashBoard = () => {
    const [stats, setStats] = useState({
        totalRooms: 0,
        availableRooms: 0,
        bookedRooms: 0,
        totalMonthlyRevenue: 0,
        totalAnnualRevenue: 0,
        totalEmployees: null, // Đặt null để ẩn nếu không phải admin
        bookingsToday: 0, // Giả định thêm trường này cho "Đặt phòng hôm nay"
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 💡 GIẢ LẬP: Lấy Role và Token. 
    // Trong thực tế, bạn sẽ lấy từ Context, Redux, hoặc hook xác thực.
    const userRole = localStorage.getItem('userRole') || 'ADMIN'; // Mặc định là ADMIN để test
    const authToken = localStorage.getItem('authToken') || 'YOUR_JWT_TOKEN'; // Thay bằng token thực tế

    // Hàm fetch dữ liệu từ Backend
    const fetchDashboardStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/admin/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${authToken}` 
                }
            });

            // Cập nhật state với dữ liệu API trả về (bao gồm các trường của DashboardStatsResponse)
            setStats({
                ...response.data,
                // Giả lập thêm bookingsToday nếu backend chưa có (hoặc bạn có thể fetch riêng)
                bookingsToday: 15, 
            });
            
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu Dashboard:", err);
            // Kiểm tra lỗi 403 (Forbidden) hoặc network
            const errorMessage = err.response && err.response.status === 403 
                               ? "Bạn không có quyền truy cập trang này (403 Forbidden)."
                               : "Không thể tải dữ liệu thống kê. Vui lòng kiểm tra kết nối API.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component được load
    useEffect(() => {
        // Chỉ fetch nếu có token
        if (authToken && authToken !== 'YOUR_JWT_TOKEN') {
            fetchDashboardStats();
        } else {
            // Nếu không có token, vẫn hiển thị, nhưng báo lỗi hoặc dùng mock data
            setError("Người dùng chưa được xác thực hoặc thiếu JWT Token.");
            setLoading(false);
        }
    }, []);
    
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
            title: "Phòng Đã Đặt", // (Đang ở/Occupied)
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
        // Thẻ này chỉ hiển thị khi tổng nhân viên khác null (được backend trả về cho Admin)
        { 
            title: "Tổng số Nhân viên", 
            value: stats.totalEmployees, 
            icon: FaUsers, 
            bgColor: "bg-secondary", 
            adminOnly: true // Đánh dấu là thẻ chỉ dành cho admin
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
            
            {/* Thông báo vai trò (tùy chọn) */}
            <p className='text-center text-muted'>
                {stats.totalEmployees !== null ? `Bạn đang xem Dashboard với vai trò ${userRole.toUpperCase()}.` : 'Chào mừng đến với Dashboard.'}
            </p>

            {/* Hàng chứa các ô thống kê (Stats Cards) */}
            <div className="row">
                {statsToDisplay.map((stat, index) => (
                    // Sử dụng col-xl-2.4 hoặc col-xl-3 tùy theo số lượng thẻ bạn muốn trên 1 hàng
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