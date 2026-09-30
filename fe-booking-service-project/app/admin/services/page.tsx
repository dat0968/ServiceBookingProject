
"use client";

import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Table,
  Spinner,
} from "react-bootstrap";
import { useServices } from "@/hooks/useServices";
import useServicesAdmin from "@/hooks/useServicesAdmin";

const TEAL = "#0f766e";

export default function AdminServicesPage() {
  const {
    services,
    search,
    page,
    totalPages,
    loading,
    error,
    handleSearch,
    handlePageChange,
    fetchServices,
  } = useServices();

  const {
    showModal,
    isEditing,
    form,
    submitting,
    formError,
    handleAdd,
    handleEdit,
    handleClose,
    handleChange,
    handleSubmit,
    handleCancel
  } = useServicesAdmin(fetchServices);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="h3 fw-bold mb-1">
            Quản lý dịch vụ
          </h1>
          <p className="text-secondary mb-0">
            Thêm, sửa và bật/tắt dịch vụ.
          </p>
        </div>

        <Button
          onClick={handleAdd}
          className="border-0 fw-semibold"
          style={{ background: TEAL }}
        >
          Thêm dịch vụ
        </Button>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-3 p-md-4">
          <Row className="g-3 align-items-end">
            <Col>
              <Form.Group controlId="adminSearchService">
                <Form.Label>Tìm dịch vụ</Form.Label>
                <Form.Control
                  onChange={(e) => handleSearch(e.target.value)}
                  value={search}
                  type="search"
                  placeholder="Nhập tên dịch vụ"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-secondary mt-2">
            Đang tải danh sách dịch vụ...
          </p>
        </div>
      ) : (
        <>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Tên</th>
                    <th>Thời lượng</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <div className="fw-semibold">
                          {service.nameService}
                        </div>
                        <div className="text-secondary small">
                          {service.descriptionService}
                        </div>
                      </td>

                      <td>{service.durationMinutes} phút</td>

                      <td>
                        {service.price.toLocaleString("vi-VN")} đ
                      </td>

                      <td>
                        <Badge bg={service.isActive ? "success" : "dark"}>
                          {service.isActive ? "Đang bán" : "Ngưng bán"}
                        </Badge>
                      </td>

                      <td className="text-end">
                        <Button
                          onClick={() => handleEdit(service)}
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                        >
                          Sửa
                        </Button>

                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleCancel(service.id, !service.isActive)}
                        >
                          {service.isActive ? "Tắt" : "Bật"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

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

      {/* Modal thêm / sửa dịch vụ */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        backdrop={submitting ? "static" : true}
        keyboard={!submitting}
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton={!submitting}>
            <Modal.Title>
              {isEditing ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {formError && (
              <Alert variant="danger">
                {formError}
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="serviceName">
              <Form.Label>Tên dịch vụ</Form.Label>
              <Form.Control
                name="nameService"
                value={form.nameService}
                onChange={handleChange}
                placeholder="Ví dụ: Cắt tóc"
                required
                maxLength={200}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="serviceDesc">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                name="descriptionService"
                value={form.descriptionService ?? ""}
                onChange={handleChange}
                rows={3}
                placeholder="Mô tả ngắn"
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="serviceDuration">
                  <Form.Label>Thời lượng (phút)</Form.Label>
                  <Form.Control
                    type="number"
                    name="durationMinutes"
                    value={form.durationMinutes}
                    onChange={handleChange}
                    min={1}
                    step={1}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="servicePrice">
                  <Form.Label>Giá (đ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min={0}
                    step="any"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button
              type="submit"
              className="border-0"
              style={{ background: TEAL }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Đang lưu...
                </>
              ) : (
                isEditing ? "Cập nhật" : "Thêm dịch vụ"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
