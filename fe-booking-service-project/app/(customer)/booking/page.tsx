"use client";

import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import AppToast from "@/components/app-toast";
import useBooking from "@/hooks/useBooking";

const TEAL = "#0f766e";

export default function BookingPage() {
  const {
    services,
    selectedService,
    form,
    loadingServices,
    submitting,
    error,
    handleServiceChange,
    handleDateChange,
    handleTimeChange,
    handleNoteChange,
    handleSubmit,
    toast,
    setToast
  } = useBooking();

  return (
    <Container className="py-4 py-md-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">
          Đặt lịch
        </h1>

        <p className="text-secondary mb-0">
          Chọn dịch vụ, ngày và thời gian bạn muốn đặt lịch.
        </p>
      </div>

      <Row className="g-4">
        {/* Form */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Form>
                <Row className="g-3">

                  {/* Service */}
                  <Col md={6}>
                    <Form.Group controlId="bookingService">
                      <Form.Label>Dịch vụ</Form.Label>

                      <Form.Select
                        value={form.serviceId}
                        onChange={(e) =>
                          handleServiceChange(
                            e.target.value
                              ? Number(e.target.value)
                              : ""
                          )
                        }
                        disabled={loadingServices}
                      >
                        <option value="">
                          {loadingServices
                            ? "Đang tải dịch vụ..."
                            : "Chọn dịch vụ"}
                        </option>

                        {services.map((service) => (
                          <option
                            key={service.id}
                            value={service.id}
                          >
                            {service.nameService} —{" "}
                            {service.durationMinutes} phút —{" "}
                            {service.price.toLocaleString("vi-VN")} đ
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Date */}
                  <Col md={6}>
                    <Form.Group controlId="bookingDate">
                      <Form.Label>Ngày</Form.Label>

                      <Form.Control
                        type="date"
                        value={form.bookingDate}
                        onChange={(e) =>
                          handleDateChange(e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>

                  {/* Time */}
                  <Col xs={12}>
                    <Form.Group controlId="bookingTime">
                      <Form.Label>Thời gian</Form.Label>

                      <Form.Control
                        type="time"
                        value={form.startTime}
                        onChange={(e) =>
                          handleTimeChange(e.target.value)
                        }
                      />

                      <Form.Text className="text-secondary">
                        Bạn có thể chọn thời gian mong muốn.
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  {/* Note */}
                  <Col xs={12}>
                    <Form.Group controlId="bookingNote">
                      <Form.Label>Ghi chú</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={form.customerNote}
                        onChange={(e) =>
                          handleNoteChange(e.target.value)
                        }
                        placeholder="Ví dụ: muốn cắt ngắn, không dùng gel..."
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Error */}
                {error && (
                  <div className="text-danger mt-3">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="mt-4 w-100 py-2 fw-semibold border-0"
                  style={{
                    background: TEAL,
                  }}
                >

                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang đặt lịch...
                    </>
                  ) : (
                    "Xác nhận đặt lịch"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Summary */}
        <Col lg={4}>
          <Card
            className="border-0 shadow-sm"
            style={{ borderRadius: 16 }}
          >
            <Card.Body className="p-4">
              <h2 className="h5 fw-semibold mb-3">
                Tóm tắt
              </h2>

              {/* Service */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">
                  Dịch vụ
                </span>

                <span className="fw-semibold text-end ms-3">
                  {selectedService?.nameService ?? "-"}
                </span>
              </div>

              {/* Duration */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">
                  Thời lượng
                </span>

                <span>
                  {selectedService
                    ? `${selectedService.durationMinutes} phút`
                    : "-"}
                </span>
              </div>

              {/* Date */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">
                  Ngày
                </span>

                <span>
                  {form.bookingDate || "-"}
                </span>
              </div>

              {/* Time */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">
                  Thời gian bắt đầu
                </span>

                <span>
                  {form.startTime || "-"}
                </span>
              </div>

              <hr />

              {/* Price */}
              <div className="d-flex justify-content-between">
                <span className="fw-semibold">
                  Giá
                </span>

                <span
                  className="fw-bold"
                  style={{ color: TEAL }}
                >
                  {selectedService
                    ? `${selectedService.price.toLocaleString(
                      "vi-VN"
                    )} đ`
                    : "-"}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <AppToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />
    </Container>
  );
}