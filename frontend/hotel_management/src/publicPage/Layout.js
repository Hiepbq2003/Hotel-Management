import { Outlet, useLocation } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Row, Col } from "react-bootstrap";
const Layout = () => {
    const location = useLocation();

    // Ẩn Breadcrumbs trên các route không cần thiết
    const hideBreadcrumbRoutes = [
        "/",
        "/home",
        "/login",
        "/manager",
        "/manager/dashboard",
        "/admin",
        "/admin/dashboard",
        "/reception",
        "/reception/check-in"
    ];

    const shouldShowBreadcrumbs = !hideBreadcrumbRoutes.includes(location.pathname);

    return (
        <>
            <Header />
            <Row className="justify-content-center">
                <Col md={10}>
                    {shouldShowBreadcrumbs && <Breadcrumbs />}
                </Col>
            </Row>
            {/* Hiển thị Breadcrumbs nếu không nằm trong danh sách ẩn */}


            <Outlet />
            <Footer />
        </>
    );
};

export default Layout;