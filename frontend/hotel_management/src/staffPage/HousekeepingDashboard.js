import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner } from 'react-bootstrap';

const HousekeepingDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const url = user?.role === 'admin' || user?.role === 'manager' 
                ? 'http://localhost:8083/api/tasks/housekeeping'
                : `http://localhost:8083/api/tasks/housekeeping/staff/${user?.id}`;

            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'PENDING': return <Badge bg="warning">Pending</Badge>;
            case 'ASSIGNED': return <Badge bg="info">Assigned</Badge>;
            case 'IN_PROGRESS': return <Badge bg="primary">In Progress</Badge>;
            case 'COMPLETED': return <Badge bg="success">Completed</Badge>;
            case 'CANCELLED': return <Badge bg="danger">Cancelled</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Container fluid>
            <h2 className="mb-4">Housekeeping Tasks</h2>
            
            <Card className="shadow-sm">
                <Card.Body>
                    {loading ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Room</th>
                                    <th>Type</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.length > 0 ? tasks.map(t => (
                                    <tr key={t.id}>
                                        <td>#{t.id}</td>
                                        <td>{t.roomNumber || (t.room ? t.room.roomNumber : 'N/A')}</td>
                                        <td>{t.type}</td>
                                        <td>{t.priority}</td>
                                        <td>{getStatusBadge(t.status)}</td>
                                        <td>{t.notes}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted p-4">
                                            No tasks assigned currently.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default HousekeepingDashboard;
