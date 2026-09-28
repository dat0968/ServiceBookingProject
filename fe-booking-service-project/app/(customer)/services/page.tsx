"use client";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Pagination from 'react-bootstrap/Pagination';
export default function Services() {
  let active = 2;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>,
    );
  }
  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="py-4 py-md-5 flex-grow-1">
        <div className="mb-4">
          <h1 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
            Danh sách dịch vụ
          </h1>
          <p className="text-secondary mb-0">
            Chọn dịch vụ phù hợp rồi đặt lịch.
          </p>
        </div>

        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
          <Card.Body className="p-3 p-md-4">
            <Col>
              <Form.Group controlId="searchService">
                <Form.Label>Tìm dịch vụ</Form.Label>
                <Form.Control type="search" placeholder="Nhập tên dịch vụ" />
              </Form.Group>
            </Col>
          </Card.Body>
        </Card>

        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4 d-flex flex-column">
                <Card.Title className="fw-semibold">Cắt tóc</Card.Title>
                <Card.Text className="text-secondary flex-grow-1">
                  Tạo kiểu tóc gọn gàng, phù hợp khuôn mặt.
                </Card.Text>
                <div className="d-flex justify-content-between small mb-3">
                  <span className="text-secondary">45 phút</span>
                  <span className="fw-semibold" style={{ color: "#0f766e" }}>
                    150.000 đ
                  </span>
                </div>
                <Button className="w-100 border-0 fw-semibold" style={{ background: "#0f766e" }}>
                  Đặt lịch
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4 d-flex flex-column">
                <Card.Title className="fw-semibold">Gội đầu</Card.Title>
                <Card.Text className="text-secondary flex-grow-1">
                  Gội thư giãn, chăm sóc da đầu.
                </Card.Text>
                <div className="d-flex justify-content-between small mb-3">
                  <span className="text-secondary">30 phút</span>
                  <span className="fw-semibold" style={{ color: "#0f766e" }}>
                    80.000 đ
                  </span>
                </div>
                <Button className="w-100 border-0 fw-semibold" style={{ background: "#0f766e" }}>
                  Đặt lịch
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4 d-flex flex-column">
                <Card.Title className="fw-semibold">Nhuộm tóc</Card.Title>
                <Card.Text className="text-secondary flex-grow-1">
                  Nhuộm màu thời trang, lên màu đều.
                </Card.Text>
                <div className="d-flex justify-content-between small mb-3">
                  <span className="text-secondary">90 phút</span>
                  <span className="fw-semibold" style={{ color: "#0f766e" }}>
                    350.000 đ
                  </span>
                </div>
                <Button className="w-100 border-0 fw-semibold" style={{ background: "#0f766e" }}>
                  Đặt lịch
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4 d-flex flex-column">
                <Card.Title className="fw-semibold">Uốn tóc</Card.Title>
                <Card.Text className="text-secondary flex-grow-1">
                  Uốn xoăn tự nhiên, giữ nếp lâu.
                </Card.Text>
                <div className="d-flex justify-content-between small mb-3">
                  <span className="text-secondary">120 phút</span>
                  <span className="fw-semibold" style={{ color: "#0f766e" }}>
                    450.000 đ
                  </span>
                </div>
                <Button className="w-100 border-0 fw-semibold" style={{ background: "#0f766e" }}>
                  Đặt lịch
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4 d-flex flex-column">
                <Card.Title className="fw-semibold">Tẩy tóc</Card.Title>
                <Card.Text className="text-secondary flex-grow-1">
                  Tẩy sáng màu, chuẩn bị nhuộm.
                </Card.Text>
                <div className="d-flex justify-content-between small mb-3">
                  <span className="text-secondary">75 phút</span>
                  <span className="fw-semibold" style={{ color: "#0f766e" }}>
                    280.000 đ
                  </span>
                </div>
                <Button className="w-100 border-0 fw-semibold" style={{ background: "#0f766e" }}>
                  Đặt lịch
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4 d-flex flex-column">
                <Card.Title className="fw-semibold">Phục hồi tóc</Card.Title>
                <Card.Text className="text-secondary flex-grow-1">
                  Dưỡng ẩm, giảm khô xơ và chẻ ngọn.
                </Card.Text>
                <div className="d-flex justify-content-between small mb-3">
                  <span className="text-secondary">60 phút</span>
                  <span className="fw-semibold" style={{ color: "#0f766e" }}>
                    220.000 đ
                  </span>
                </div>
                <Button className="w-100 border-0 fw-semibold" style={{ background: "#0f766e" }}>
                  Đặt lịch
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Pagination style={{justifySelf: "center", marginTop: "20px"}}>{items}</Pagination>
      </Container>
    </div>
  );
}
