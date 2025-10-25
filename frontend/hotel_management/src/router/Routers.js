import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../publicPage/Layout";
import Home from "../publicPage/Home";
import Rooms from "../publicPage/Rooms";
import RoomDetail from "../publicPage/RoomDetail";
import Login from "../publicPage/Login/Login";
import AboutUs from "../publicPage/AboutUs";
import Contact from "../publicPage/Contact";
import RoomTypeManagement from "../manager/RoomTypeManagement";
import ManagerDashBoard from "../manager/ManagerDashBoard";
import Manager from "../manager/Manager";
import Profile from "../publicPage/Profile";
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
        <Route path="/manager" element={<Manager/>}>
          <Route index element={<ManagerDashBoard />} />
          <Route path="dashboard" element={<ManagerDashBoard />} />
          <Route path="room-types" element={<RoomTypeManagement />} />
        </Route>
       

        {/* Route 404 để debug */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default Routers;

