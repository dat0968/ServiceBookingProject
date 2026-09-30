"use client";

import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

import StatusBadge from "@/components/status-badge";
import useBookingAdmin from "@/hooks/useBookingAdmin";

const TEAL = "#0f766e";

const formatDateTime = (value: string) => {
  const date = new Date(value);

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminBookingsPage() {
  const {
    bookings,
    loading,

    date,
    setDate,
    status,
    setStatus,
    handleFilter,

    page,
    totalPages,
    handlePageChange,

    selectedBooking,
    showDetailModal,
    handleDetail,
    handleCloseDetail,

    handleStatusChange,
    statusSubmitting,

    staffs,
    staffsLoading,
    showStaffModal,
    handleCloseStaffModal,
    selectedStaffId,
    setSelectedStaffId,
    handleAssignStaff,
    submitting,

    showCancelModal,
    cancellationReason,
    setCancellationReason,
    handleCancelClick,
    handleCloseCancelModal,
    handleConfirmCancel,
    cancelSubmitting,
  } = useBookingAdmin();

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">
          Quản lý đặt lịch
        </h1>

        <p className="text-secondary mb-0">
          Xem, xác nhận, hoàn thành hoặc hủy lịch.
        </p>
      </div>

      {/* Filter */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-3 p-md-4">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group controlId="adminBookingDate">
                <Form.Label>Ngày</Form.Label>

                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="adminBookingStatus">
                <Form.Label>Trạng thái</Form.Label>

                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="Pending">Chờ xác nhận</option>
                  <option value="Confirmed">Đã xác nhận</option>
                  <option value="Completed">Hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Button
                className="w-100 border-0 fw-semibold"
                style={{ background: TEAL }}
                onClick={handleFilter}
              >
                <i className="bi bi-funnel me-2" />
                Lọc
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Booking table */}
      <Card
        className="border-0 shadow-sm"
        style={{ borderRadius: 16 }}
      >
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã</th>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Nhân viên</th>
                <th>Thời gian</th>
                <th>Chi tiết</th>
                <th>Trạng thái</th>
                <th className="text-end">Hủy</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <div className="text-secondary mt-2">
                      Đang tải danh sách đặt lịch...
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-secondary py-5"
                  >
                    Không có lịch đặt nào.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="fw-semibold">
                      {booking.bookingCode}
                    </td>

                    <td>
                      <div>{booking.customerName}</div>
                      <div className="text-secondary small">
                        {booking.customerEmail}
                      </div>
                    </td>

                    <td>{booking.serviceName}</td>

                    <td>
                      {booking.staffName ?? (
                        <span className="text-secondary fst-italic">
                          Chưa phân công
                        </span>
                      )}
                    </td>

                    <td className="text-nowrap">
                      <div>
                        {formatDateTime(booking.startTime)}
                      </div>
                      <div className="text-secondary small">
                        đến {formatDateTime(booking.endTime)}
                      </div>
                    </td>

                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleDetail(booking)}
                      >
                        Chi tiết
                      </Button>
                    </td>

                    <td>
                      <div className="d-flex flex-column gap-2 align-items-start">
                        <StatusBadge
                          status={booking.statusBooking}
                        />

                        {booking.statusBooking !== "Cancelled" &&
                          booking.statusBooking !== "Completed" && (
                            <Form.Select
                              size="sm"
                              className="w-auto"
                              value=""
                              disabled={statusSubmitting}
                              onChange={(e) =>
                                handleStatusChange(
                                  booking,
                                  e.target.value,
                                  selectedStaffId
                                )
                              }
                            >
                              <option value="" disabled>
                                Cập nhật
                              </option>

                              {booking.statusBooking !== "Confirmed" && (
                                <option value="Confirmed">
                                  Xác nhận
                                </option>
                              )}

                              {booking.statusBooking !== "Completed" && (
                                <option value="Completed">
                                  Hoàn thành
                                </option>
                              )}
                            </Form.Select>
                          )}
                      </div>
                    </td>

                    <td className="text-end">
                      {booking.statusBooking !== "Cancelled" &&
                        booking.statusBooking !== "Completed" && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                              handleCancelClick(booking)
                            }
                          >
                            Hủy
                          </Button>
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination className="mb-0">
            <Pagination.Prev
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            />

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === page}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            ))}

            <Pagination.Next
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            />
          </Pagination>
        </div>
      )}

      {/* Booking detail modal */}
      <Modal
        show={showDetailModal}
        onHide={handleCloseDetail}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đặt lịch</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedBooking && (
            <Row className="g-3">
              <Col md={6}>
                <div className="text-secondary small">
                  Mã đặt lịch
                </div>
                <div className="fw-semibold">
                  {selectedBooking.bookingCode}
                </div>
              </Col>

              <Col md={6}>
                <div className="text-secondary small">
                  Trạng thái
                </div>
                <StatusBadge
                  status={selectedBooking.statusBooking}
                />
              </Col>

              <Col md={6}>
                <div className="text-secondary small">
                  Khách hàng
                </div>
                <div>{selectedBooking.customerName}</div>
              </Col>

              <Col md={6}>
                <div className="text-secondary small">
                  Email
                </div>
                <div>{selectedBooking.customerEmail}</div>
              </Col>

              <Col md={6}>
                <div className="text-secondary small">
                  Dịch vụ
                </div>
                <div>{selectedBooking.serviceName}</div>
              </Col>

              <Col md={6}>
                <div className="text-secondary small">
                  Nhân viên
                </div>
                <div>
                  {selectedBooking.staffName ?? "Chưa phân công"}
                </div>
              </Col>

              <Col md={6}>
                <div className="text-secondary small">
                  Bắt đầu
                </div>
                <div>
                  {formatDateTime(selectedBooking.startTime)}
                </div>
              </Col>

              <Col md={6}>
                <div className="text-secondary small">
                  Kết thúc
                </div>
                <div>
                  {formatDateTime(selectedBooking.endTime)}
                </div>
              </Col>

              <Col md={12}>
                <div className="text-secondary small">
                  Ghi chú khách hàng
                </div>
                <div>
                  {selectedBooking.customerNote || "Không có"}
                </div>
              </Col>

              {selectedBooking.cancellationReason && (
                <Col md={12}>
                  <div className="text-secondary small">
                    Lý do hủy
                  </div>
                  <div>
                    {selectedBooking.cancellationReason}
                  </div>
                </Col>
              )}
            </Row>
          )}
        </Modal.Body>
      </Modal>

      {/* Cancel booking modal */}
      <Modal
        show={showCancelModal}
        onHide={handleCloseCancelModal}
        centered
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirmCancel();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Hủy đặt lịch</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId="adminCancelReason">
              <Form.Label>Lý do hủy</Form.Label>

              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập lý do hủy"
                value={cancellationReason}
                onChange={(e) =>
                  setCancellationReason(e.target.value)
                }
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              type="submit"
              variant="danger"
              disabled={
                cancelSubmitting ||
                !cancellationReason.trim()
              }
            >
              {cancelSubmitting ? (
                <>
                  <Spinner
                    size="sm"
                    animation="border"
                    className="me-2"
                  />
                  Đang hủy...
                </>
              ) : (
                "Xác nhận hủy"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Assign staff modal */}
      <Modal
        show={showStaffModal}
        onHide={handleCloseStaffModal}
        centered
      >
        <Form onSubmit={handleAssignStaff}>
          <Modal.Header closeButton>
            <Modal.Title>Chọn nhân viên</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p className="text-secondary">
              Booking này chưa có nhân viên. Hệ thống sẽ tìm nhân viên
              phù hợp trước khi cập nhật trạng thái.
            </p>

            {staffsLoading ? (
              <div className="text-center py-3">
                <Spinner size="sm" animation="border" className="me-2" />
                Đang tìm nhân viên phù hợp...
              </div>
            ) : staffs.length === 0 ? (
              <Alert variant="warning" className="mb-0">
                Không có nhân viên phù hợp cho booking này.
              </Alert>
            ) : (
              <Form.Group controlId="adminAssignStaff">
                <Form.Label>Nhân viên</Form.Label>

                <Form.Select
                  value={selectedStaffId}
                  onChange={(e) =>
                    setSelectedStaffId(Number(e.target.value))
                  }
                  required
                >
                  <option value={0} disabled>
                    Chọn nhân viên
                  </option>

                  {staffs.map((staff) => (
                    <option
                      key={staff.id}
                      value={staff.id}
                    >
                      {staff.fullName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              type="submit"
              className="border-0"
              style={{ background: TEAL }}
              disabled={submitting || !selectedStaffId}
            >
              {submitting ? (
                <>
                  <Spinner
                    size="sm"
                    animation="border"
                    className="me-2"
                  />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}