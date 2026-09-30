"use client";

import { Alert, Spinner, Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import useWorkScheduleAdmin from "@/hooks/useWorkScheduleAdmin";
import AppToast from "@/components/app-toast";
const TEAL = "#0f766e";

export default function AdminSchedulesPage() {
  const {
    schedules,
    loading,
    error,
    fetchSchedules,
    staffs,
    staffsLoading,
    fetchStaffs,
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
    handleDelete,
    toast,
    setToast
  } = useWorkScheduleAdmin();
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: "#0f172a" }}>
            Lịch làm việc
          </h1>
          <p className="text-secondary mb-0">Gán ca làm cho nhân viên theo ngày.</p>
        </div>
        <Button onClick={handleAdd} className="border-0 fw-semibold" style={{ background: TEAL }}>
          Thêm lịch
        </Button>
      </div>

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
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center text-danger py-4">
                    {error}
                  </td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Chưa có lịch làm việc.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.staffName}</td>
                    <td>{schedule.workDate}</td>
                    <td>{schedule.startTime.slice(0, 5)}</td>
                    <td>{schedule.endTime.slice(0, 5)}</td>
                    <td className="text-end">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleEdit(schedule)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal}
        onHide={handleClose}
        centered
        backdrop={submitting ? "static" : true}
        keyboard={!submitting}
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton={!submitting}>
            <Modal.Title>
              {isEditing ? "Cập nhật lịch làm việc" : "Thêm lịch làm việc"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {formError && (
              <Alert variant="danger">
                {formError}
              </Alert>
            )}

            <Form.Select
              name="staffId"
              value={form.staffId}
              onChange={handleChange}
              required
              disabled={staffsLoading}
            >
              <option value={0} disabled>
                {staffsLoading ? "Đang tải nhân viên..." : "Chọn nhân viên"}
              </option>

              {staffs.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.fullName}
                </option>
              ))}
            </Form.Select>

            <Form.Group className="mb-3" controlId="scheduleDate">
              <Form.Label>Ngày làm</Form.Label>
              <Form.Control
                type="date"
                name="workDate"
                value={form.workDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="scheduleStart">
                  <Form.Label>Giờ bắt đầu</Form.Label>
                  <Form.Control
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="scheduleEnd">
                  <Form.Label>Giờ kết thúc</Form.Label>
                  <Form.Control
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
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
                isEditing ? "Cập nhật" : "Thêm lịch"
              )}
            </Button>
          </Modal.Footer>
        </Form>
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
    </>
  );
}
