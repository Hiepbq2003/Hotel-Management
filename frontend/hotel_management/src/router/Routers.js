import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../publicPage/Layout";
import Home from "../publicPage/Home";
import Rooms from "../publicPage/Rooms";
import RoomDetail from "../publicPage/RoomDetail";
import Login from "../publicPage/Login";
import RoomTypeManagement from "../manager/RoomTypeManagement";

function Routers() {
  return (
    <Router>
      <Routes>
        {/* Layout chung cho trang public */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="room/:id" element={<RoomDetail />} />
        </Route>

        {/* Các route riêng */}
        <Route path="/login" element={<Login />} />
        <Route path="/manager/roomtypes" element={<RoomTypeManagement />} />

        {/* Route 404 để debug */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default Routers;

