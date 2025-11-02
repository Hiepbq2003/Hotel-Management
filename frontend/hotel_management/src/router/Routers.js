import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../publicPage/Layout";
import Home from "../publicPage/Home/Home";
import Rooms from "../publicPage/Rooms";
import RoomDetail from "../publicPage/RoomDetail";
import Login from "../publicPage/Login/Login";
import AboutUs from "../publicPage/AboutUs";
import Contact from "../publicPage/Contact";
import RoomTypeManagement from "../manager/RoomTypeManagement";
import DashBoard from "../adminArea/DashBoard";
import Manager from "../manager/Manager";
import Profile from "../publicPage/Profile";
import CheckInPage from "../staffPage/CheckInPage";
import Reception from "../staffPage/Reception";
import CheckOutPage from "../staffPage/CheckOutPage";
import CheckRoom from "../staffPage/CheckRoom";
import Admin from "../admin/Admin";
import UserManagement from "../admin/UserManagement";
import CustomerManagement from "../adminArea/CustomerManagement";

function Routers() {
  return (
    <Router>
      <Routes>
        {/* Layout chung cho trang public */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="rooms/:id" element={<RoomDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Các route riêng */}
        <Route path="/login" element={<Login />} />

        {/* ROUTE DÀNH CHO MANAGER */}
        <Route path="/manager" element={<Manager />}>
          <Route index element={<DashBoard />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="room-types" element={<RoomTypeManagement />} />
          <Route path="customer-management" element={<CustomerManagement />} />
        </Route>

        {/* *** ROUTE DÀNH CHO ADMIN *** */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<DashBoard />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="user-management" element={<UserManagement />} />
        </Route>
        <Route path="/reception" element={<Reception />}>
          <Route index element={<CheckInPage />} />
          <Route path="check-in" element={<CheckInPage />} />
          <Route path="check-out" element={<CheckOutPage />} />
          <Route path="check-room" element={<CheckRoom />} />
        </Route>
        {/* Route 404 để debug */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default Routers;