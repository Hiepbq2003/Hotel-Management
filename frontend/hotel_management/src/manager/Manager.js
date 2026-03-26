import React from 'react';
import { Row, Col } from 'react-bootstrap'
import {Outlet} from "react-router-dom";
import Sidebar from '../adminArea/Sidebar'; 
import WorkspaceHeader from '../components/WorkspaceHeader';

const Manager = () => {
    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Row className="d-flex w-100 m-0">
                <Col lg={2} className="p-0">
                    <Sidebar role="MANAGER" /> 
                </Col>
                <Col lg={10} className="p-0" style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
                    <WorkspaceHeader />
                    <div className="p-4">
                        <Outlet />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Manager;