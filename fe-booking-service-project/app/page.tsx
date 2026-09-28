"use client";

import Link from "next/link";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header
        className="d-flex justify-content-between align-items-center px-3 px-md-4 py-3"
        style={{ background: "#0f766e" }}
      >
        <Link href="/" className="text-white text-decoration-none fw-bold fs-5">
          Service Booking
        </Link>
        <nav className="d-flex align-items-center gap-3">
          <Link
            href="/login"
            className="btn btn-light btn-sm fw-semibold"
          >
            Đăng nhập
          </Link>
        </nav>
      </header>

      <section
        className="text-white py-5"
        style={{
          background:
            "linear-gradient(160deg, #0f766e 0%, #115e59 42%, #0f172a 100%)",
        }}
      >
        <Container className="py-4 py-md-5">
          <Row className="align-items-center g-4">
            <Col md={7}>
              <p className="text-uppercase small mb-2" style={{ letterSpacing: 1.2, opacity: 0.85 }}>
                Đặt lịch nhanh chóng
              </p>
              <h1 className="display-5 fw-bold mb-3">
                Đặt lịch dịch vụ chỉ trong vài bước
              </h1>
              <p className="fs-5 mb-4" style={{ maxWidth: 540, opacity: 0.9 }}>
                Chọn dịch vụ, xem thời lượng và giá rõ ràng, rồi đặt lịch đúng lúc bạn cần.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link href="/services">
                  <Button
                    className="px-4 py-2 fw-semibold border-0"
                    style={{ background: "#fff", color: "#0f766e" }}
                  >
                    Xem dịch vụ
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline-light" className="px-4 py-2 fw-semibold">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h2 className="fw-bold text-center mb-4" style={{ color: "#0f172a" }}>
            Cách đặt lịch
          </h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <Card.Body className="p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3 fw-bold text-white"
                    style={{ width: 40, height: 40, borderRadius: 10, background: "#0f766e" }}
                  >
                    1
                  </div>
                  <Card.Title className="fw-semibold">Chọn dịch vụ</Card.Title>
                  <Card.Text className="text-secondary mb-0">
                    Xem danh sách dịch vụ, thời lượng và giá trước khi đặt.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <Card.Body className="p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3 fw-bold text-white"
                    style={{ width: 40, height: 40, borderRadius: 10, background: "#0f766e" }}
                  >
                    2
                  </div>
                  <Card.Title className="fw-semibold">Chọn thời gian</Card.Title>
                  <Card.Text className="text-secondary mb-0">
                    Đặt lịch vào khung giờ phù hợp với bạn.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <Card.Body className="p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3 fw-bold text-white"
                    style={{ width: 40, height: 40, borderRadius: 10, background: "#0f766e" }}
                  >
                    3
                  </div>
                  <Card.Title className="fw-semibold">Xác nhận</Card.Title>
                  <Card.Text className="text-secondary mb-0">
                    Nhận xác nhận lịch hẹn và theo dõi trạng thái đặt lịch.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <footer className="mt-auto py-3 text-center text-secondary small" style={{ background: "#fff" }}>
        Service Booking
      </footer>
    </div>
  );
}
