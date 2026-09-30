"use client";

import { Button, Card, Col, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import StatusBadge from "@/components/status-badge";

const TEAL = "#0f766e";

export default function AdminBookingsPage() {
  return (
    <>
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1" style={{ color: "#0f172a" }}>
          Quản lý đặt lịch
        </h1>
        <p className="text-secondary mb-0">Xem, xác nhận, hoàn thành hoặc hủy lịch.</p>
      </div>

      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
        <Card.Body className="p-3 p-md-4">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group controlId="adminBookingDate">
                <Form.Label>Ngày</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="adminBookingStatus">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select defaultValue="">
                  <option value="">Tất cả</option>
                  <option value="Pending">Chờ xác nhận</option>
                  <option value="Confirmed">Đã xác nhận</option>
                  <option value="Completed">Hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button className="w-100 border-0 fw-semibold" style={{ background: TEAL }}>
                Lọc
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã</th>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Nhân viên</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-semibold">BK20260929001</td>
                <td>
                  <div>Lê Minh</div>
                  <div className="text-secondary small">minh@email.com</div>
                </td>
                <td>Cắt tóc</td>
                <td>Nguyễn Văn A</td>
                <td>29/09/2026 08:00 – 08:45</td>
                <td>
                  <StatusBadge status="Pending" />
                </td>
                <td className="text-end">
                  <Form.Select size="sm" className="d-inline-block w-auto me-2" defaultValue="Confirmed">
                    <option value="Confirmed">Xác nhận</option>
                    <option value="Completed">Hoàn thành</option>
                  </Form.Select>
                  <Button variant="outline-danger" size="sm">
                    Hủy
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="fw-semibold">BK20260928012</td>
                <td>
                  <div>Phạm Hoa</div>
                  <div className="text-secondary small">hoa@email.com</div>
                </td>
                <td>Nhuộm tóc</td>
                <td>Trần Thị B</td>
                <td>28/09/2026 14:00 – 15:30</td>
                <td>
                  <StatusBadge status="Confirmed" />
                </td>
                <td className="text-end">
                  <Form.Select size="sm" className="d-inline-block w-auto me-2" defaultValue="Completed">
                    <option value="Confirmed">Xác nhận</option>
                    <option value="Completed">Hoàn thành</option>
                  </Form.Select>
                  <Button variant="outline-danger" size="sm">
                    Hủy
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-center mt-4">
        <Pagination className="mb-0">
          <Pagination.Item active>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
        </Pagination>
      </div>

      <Modal show={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Hủy đặt lịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="adminCancelReason">
            <Form.Label>Lý do hủy</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Nhập lý do hủy" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Đóng</Button>
          <Button variant="danger">Xác nhận hủy</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
