"use client";
import { useServices } from "@/hooks/useServices";
import Link from "next/link";
import { Button, Card, Col, Container, Form, Row, Alert, Spinner } from "react-bootstrap";
import Pagination from 'react-bootstrap/Pagination';
export default function Services() {
  const {
    services,
    search,
    page,
    totalPages,
    loading,
    error,
    handleSearch,
    handlePageChange,
  } = useServices();

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item key={number} active={number === page}>
        {number}
      </Pagination.Item>,
    );
  }
  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="py-4 py-md-5 flex-grow-1">
        <div className="mb-4">
          <h1 className="fw-bold mb-1">
            Danh sách dịch vụ
          </h1>
          <p className="text-secondary mb-0">
            Chọn dịch vụ phù hợp rồi đặt lịch.
          </p>
        </div>

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-3 p-md-4">
            <Form.Group controlId="searchService">
              <Form.Label>Tìm dịch vụ</Form.Label>
              <Form.Control onChange={(e) => handleSearch(e.target.value)} value={search} type="search" placeholder="Nhập tên dịch vụ" />
            </Form.Group>
          </Card.Body>
        </Card>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (<div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-secondary mt-2">
            Đang tải danh sách dịch vụ...
          </p>
        </div>) : (
          <>
            <Row className="g-4">
              {services.map((service) => (
                <Col md={6} lg={4}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="p-4 d-flex flex-column">
                      <Card.Title className="fw-semibold">{service.nameService}</Card.Title>
                      <Card.Text className="text-secondary flex-grow-1">
                        {service.descriptionService}
                      </Card.Text>
                      <div className="d-flex justify-content-between small mb-3">
                        <span className="text-secondary">{service.durationMinutes} phút</span>
                        <span className="fw-semibold" style={{ color: "#0f766e" }}>
                          {service.price} đ
                        </span>
                      </div>
                      <Link href="/booking" className="mt-auto">
                        <Button className="w-100 border-0 fw-semibold" style={{ background: "#0f766e" }}>
                          Đặt lịch
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.Prev
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  />

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((number) => (
                    <Pagination.Item
                      key={number}
                      active={number === page}
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </Pagination.Item>
                  ))}

                  <Pagination.Next
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}

      </Container>
    </div>
  );
}
