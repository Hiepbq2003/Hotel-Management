import React from 'react';
// Nếu bạn sử dụng các biểu tượng, bạn sẽ cần import chúng (ví dụ: react-icons)
// import { FaBed, FaCalendarCheck, FaDollarSign, FaUsers } from 'react-icons/fa';

const DashBoard = () => {
    // Dữ liệu giả định cho các ô thống kê (stats)
    const stats = [
        { title: "Tổng số Phòng", value: 120, icon: "FaBed", bgColor: "bg-primary" },
        { title: "Đặt phòng hôm nay", value: 15, icon: "FaCalendarCheck", bgColor: "bg-success" },
        { title: "Tổng Thu nhập (Tháng)", value: "50,000,000 VND", icon: "FaDollarSign", bgColor: "bg-warning" },
        { title: "Nhân viên", value: 35, icon: "FaUsers", bgColor: "bg-info" },
    ];

    return (
        <div className="container-fluid py-4">
            <h1 className='text-center mb-4'>
                Bảng Điều Khiển Quản Lý
            </h1>

            {/* Hàng chứa các ô thống kê (Stats Cards) */}
            <div className="row">
                {stats.map((stat, index) => (
                    <div className="col-lg-3 col-md-6 col-sm-12 mb-4" key={index}>
                        <div className={`card text-white ${stat.bgColor} shadow`}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-8">
                                        <h5 className="card-title text-white">{stat.title}</h5>
                                        <h2 className="card-text">{stat.value}</h2>
                                    </div>
                                    <div className="col-4 text-right">
                                        {/* Thay thế bằng icon thực tế nếu có */}
                                        <i className={`fa-3x ${stat.icon}`} aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="card-footer bg-transparent border-0">
                                <small>Chi tiết hơn</small>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>
            
            <hr/>

            {/* Khu vực Biểu đồ/Bảng dữ liệu */}
            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card shadow">
                        <div className="card-header bg-light">
                            Doanh thu 7 ngày gần nhất
                        </div>
                        <div className="card-body" style={{ height: '300px' }}>
                            {/* Khu vực này sẽ hiển thị Biểu đồ (ví dụ: Chart.js, Recharts) */}
                            <p className="text-muted text-center pt-5">
                                [Vị trí hiển thị Biểu đồ Doanh thu]
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 mb-4">
                    <div className="card shadow">
                        <div className="card-header bg-light">
                            Phòng Trống/Phòng Đã Đặt
                        </div>
                        <div className="card-body" style={{ height: '300px' }}>
                            {/* Khu vực này sẽ hiển thị Biểu đồ Tròn (ví dụ: Pie Chart) */}
                            <p className="text-muted text-center pt-5">
                                [Vị trí hiển thị Biểu đồ Trạng thái Phòng]
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-header bg-light">
                            Danh sách Đặt phòng Sắp tới
                        </div>
                        <div className="card-body">
                            {/* Khu vực này sẽ hiển thị một Bảng dữ liệu (ví dụ: React Table) */}
                            <p className="text-muted text-center">
                                [Vị trí hiển thị Bảng Đặt phòng]
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;