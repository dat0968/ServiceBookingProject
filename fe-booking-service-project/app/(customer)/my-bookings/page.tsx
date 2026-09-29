"use client";

import { Button, Card, Col, Container, Form, Modal, Pagination, Row, Table, } from "react-bootstrap";
import { formatDateTime } from "@/helper/stringHelper"
import AppToast from "@/components/app-toast";
import StatusBadge from "@/components/status-badge";
import useMyBookings from "@/hooks/useMyBookings";

const TEAL = "#0f766e";

export default function MyBookingsPage() {
  const {
    bookings,
    query,
    loading,
    error,
    toast,
    setToast,
    showCancelModal,
    cancelReason,
    cancelling,
    handleDateChange,
    handleStatusChange,
    handlePageChange,
    handleOpenCancelModal,
    handleCloseCancelModal,
    handleCancelBooking,
    setCancelReason,
  } = useMyBookings();

  return (
    <Container className="py-4 py-md-5">
      <div className="mb-4">
        <h1
          className="fw-bold mb-1"
          style={{ color: "#0f172a" }}
        >
          Lịch của tôi
        </h1>

        <p className="text-secondary mb-0">
          Theo dõi và hủy lịch hẹn khi cần.
        </p>
      </div>

      {/* Filter */}
      <Card
        className="border-0 shadow-sm mb-4"
        style={{ borderRadius: 16 }}
      >
        <Card.Body className="p-3 p-md-4">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group controlId="myBookingDate">
                <Form.Label>Ngày</Form.Label>

                <Form.Control
                  type="date"
                  value={query.date}
                  onChange={(e) =>
                    handleDateChange(e.target.value)
                  }
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="myBookingStatus">
                <Form.Label>
                  Trạng thái
                </Form.Label>

                <Form.Select
                  value={query.status}
                  onChange={(e) =>
                    handleStatusChange(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Tất cả
                  </option>

                  <option value="Pending">
                    Chờ xác nhận
                  </option>

                  <option value="Confirmed">
                    Đã xác nhận
                  </option>

                  <option value="Completed">
                    Hoàn thành
                  </option>

                  <option value="Cancelled">
                    Đã hủy
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Button
                type="button"
                className="w-100 border-0 fw-semibold"
                style={{ background: TEAL }}
                onClick={() => handlePageChange(1)}
              >
                Lọc
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error */}
      {error && (
        <div className="text-danger mb-3">
          {error}
        </div>
      )}

      {/* Table */}
      <Card
        className="border-0 shadow-sm"
        style={{ borderRadius: 16 }}
      >
        <Card.Body className="p-0">
          <Table
            responsive
            hover
            className="mb-0 align-middle"
          >
            <thead className="table-light">
              <tr>
                <th>Mã</th>
                <th>Dịch vụ</th>
                <th>Nhân viên</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : bookings?.data.length ? (
                bookings.data.map((booking) => (
                  <tr key={booking.id}>
                    <td className="fw-semibold">
                      {booking.bookingCode}
                    </td>

                    <td>
                      {booking.serviceName}
                    </td>

                    <td>
                      {booking.staffName && booking.staffName.trim() !== "" ? booking.staffName + `(id:${booking.staffId})` : "Chưa được ủy thác"}
                    </td>

                    <td>
                      {formatDateTime(booking.startTime)}
                      {" – "}
                      {formatDateTime(booking.endTime)}
                    </td>

                    <td>
                      <StatusBadge
                        status={booking.statusBooking}
                      />
                    </td>

                    <td className="text-end">
                      {booking.statusBooking == "Pending" && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleOpenCancelModal(booking.id)}
                        >
                          Hủy
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4 text-secondary"
                  >
                    Không có lịch đặt.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Pagination */}
      {bookings && bookings.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination className="mb-0">
            {Array.from(
              {
                length: bookings.totalPages,
              },
              (_, index) => index + 1
            ).map((page) => (
              <Pagination.Item
                key={page}
                active={page === bookings.page}
                onClick={() =>
                  handlePageChange(page)
                }
              >
                {page}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
      <Modal
        show={showCancelModal}
        onHide={handleCloseCancelModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Hủy lịch hẹn</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="cancelReason">
            <Form.Label>
              Lý do hủy <span className="text-danger">*</span>
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập lý do hủy lịch..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              disabled={cancelling}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseCancelModal}
            disabled={cancelling}
          >
            Đóng
          </Button>

          <Button
            variant="danger"
            onClick={handleCancelBooking}
            disabled={cancelling || !cancelReason.trim()}
          >
            {cancelling ? "Đang hủy..." : "Xác nhận hủy"}
          </Button>
        </Modal.Footer>
      </Modal>
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