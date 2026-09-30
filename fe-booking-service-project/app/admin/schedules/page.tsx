"use client";

import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";

const TEAL = "#0f766e";

export default function AdminSchedulesPage() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: "#0f172a" }}>
            Lịch làm việc
          </h1>
          <p className="text-secondary mb-0">Gán ca làm cho nhân viên theo ngày.</p>
        </div>
        <Button className="border-0 fw-semibold" style={{ background: TEAL }}>
          Thêm lịch
        </Button>
      </div>

      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
        <Card.Body className="p-3 p-md-4">
          <Row className="g-3 align-items-end">
            <Col md={6}>
              <Form.Group controlId="filterStaff">
                <Form.Label>Nhân viên</Form.Label>
                <Form.Select defaultValue="">
                  <option value="">Tất cả</option>
                  <option value="1">Nguyễn Văn A</option>
                  <option value="2">Trần Thị B</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="filterDate">
                <Form.Label>Ngày</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Nhân viên</th>
                <th>Ngày</th>
                <th>Bắt đầu</th>
                <th>Kết thúc</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nguyễn Văn A</td>
                <td>29/09/2026</td>
                <td>08:00</td>
                <td>12:00</td>
                <td className="text-end">
                  <Button variant="outline-secondary" size="sm" className="me-2">
                    Sửa
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    Xóa
                  </Button>
                </td>
              </tr>
              <tr>
                <td>Trần Thị B</td>
                <td>29/09/2026</td>
                <td>13:00</td>
                <td>18:00</td>
                <td className="text-end">
                  <Button variant="outline-secondary" size="sm" className="me-2">
                    Sửa
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    Xóa
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm / sửa lịch làm việc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="scheduleStaff">
              <Form.Label>Nhân viên</Form.Label>
              <Form.Select defaultValue="">
                <option value="" disabled>
                  Chọn nhân viên
                </option>
                <option value="1">Nguyễn Văn A</option>
                <option value="2">Trần Thị B</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="scheduleDate">
              <Form.Label>Ngày làm</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="scheduleStart">
                  <Form.Label>Giờ bắt đầu</Form.Label>
                  <Form.Control type="time" defaultValue="08:00" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="scheduleEnd">
                  <Form.Label>Giờ kết thúc</Form.Label>
                  <Form.Control type="time" defaultValue="12:00" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Đóng</Button>
          <Button className="border-0" style={{ background: TEAL }}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
