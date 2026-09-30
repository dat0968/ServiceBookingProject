"use client";

import { Badge, Button, Card, Form, Modal, Table } from "react-bootstrap";

const TEAL = "#0f766e";

export default function AdminStaffsPage() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: "#0f172a" }}>
            Nhân viên
          </h1>
          <p className="text-secondary mb-0">Thêm, sửa và bật/tắt tài khoản nhân viên.</p>
        </div>
        <Button className="border-0 fw-semibold" style={{ background: TEAL }}>
          Thêm nhân viên
        </Button>
      </div>

      <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-semibold">Nguyễn Văn A</td>
                <td>a.staff@email.com</td>
                <td>
                  <Badge bg="success">Đang làm</Badge>
                </td>
                <td className="text-end">
                  <Button variant="outline-secondary" size="sm" className="me-2">
                    Sửa
                  </Button>
                  <Button variant="outline-warning" size="sm">
                    Tắt
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="fw-semibold">Trần Thị B</td>
                <td>b.staff@email.com</td>
                <td>
                  <Badge bg="secondary">Ngưng</Badge>
                </td>
                <td className="text-end">
                  <Button variant="outline-secondary" size="sm" className="me-2">
                    Sửa
                  </Button>
                  <Button variant="outline-success" size="sm">
                    Bật
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm / sửa nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="staffName">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control placeholder="Nguyễn Văn A" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="staffEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="staff@email.com" />
            </Form.Group>
            <Form.Check type="switch" id="staffActive" label="Đang làm việc" defaultChecked />
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
