import React from 'react';
import { Row, Col } from 'react-bootstrap'
import {Outlet} from "react-router-dom";
import ManagerSidebar from './ManagerSidebar';
const Manager = () => {
    return (
        <div>
            <Row className="d-flex">
                <Col lg={2}>
                    <ManagerSidebar />
                </Col>
                <Col lg={10}>
                    <Outlet />
                </Col>
            </Row>
        </div>
    );
};

export default Manager;
