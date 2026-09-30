"use client";

import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Form,
    Modal,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";

import useStaffAdmin from "@/hooks/useStaffAdmin";

const TEAL = "#0f766e";

export default function AdminStaffsPage() {
    const {
        staffs,
        search,
        setSearch,

        loading,
        submitting,
        error,

        showModal,
        editingStaff,

        form,
        formError,

        handleSearch,
        handleChange,

        handleCreate,
        handleEdit,
        handleCloseModal,
        handleSubmit,

        handleChangeStatus,
    } = useStaffAdmin();

    return (
        <>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
                <div>
                    <h1
                        className="h3 fw-bold mb-1"
                        style={{ color: "#0f172a" }}
                    >
                        Nhân viên
                    </h1>

                    <p className="text-secondary mb-0">
                        Thêm, sửa và bật/tắt tài khoản nhân viên.
                    </p>
                </div>

                <Button
                    className="border-0 fw-semibold"
                    style={{ background: TEAL }}
                    onClick={handleCreate}
                >
                    Thêm nhân viên
                </Button>
            </div>

            {/* Search */}
            <Card
                className="border-0 shadow-sm mb-4"
                style={{ borderRadius: 16 }}
            >
                <Card.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}
                    >
                        <Row className="g-2">
                            <Col md={10}>
                                <Form.Control
                                    placeholder="Tìm kiếm theo tên hoặc email..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />
                            </Col>

                            <Col md={2}>
                                <Button
                                    type="submit"
                                    variant="outline-secondary"
                                    className="w-100"
                                >
                                    Tìm kiếm
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Error */}
            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
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
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Trạng thái</th>
                                <th className="text-end">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-5"
                                    >
                                        <Spinner
                                            animation="border"
                                            size="sm"
                                            className="me-2"
                                        />
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : staffs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center text-secondary py-5"
                                    >
                                        Không có nhân viên.
                                    </td>
                                </tr>
                            ) : (
                                staffs.map((staff) => (
                                    <tr key={staff.id}>
                                        <td className="fw-semibold">
                                            {staff.fullName}
                                        </td>

                                        <td>
                                            {staff.email}
                                        </td>

                                        <td>
                                            {staff.isActive ? (
                                                <Badge bg="success">
                                                    Đang làm
                                                </Badge>
                                            ) : (
                                                <Badge bg="secondary">
                                                    Ngưng
                                                </Badge>
                                            )}
                                        </td>

                                        <td className="text-end">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() =>
                                                    handleEdit(staff)
                                                }
                                            >
                                                Sửa
                                            </Button>

                                            <Button
                                                variant={
                                                    staff.isActive
                                                        ? "outline-warning"
                                                        : "outline-success"
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    handleChangeStatus(
                                                        staff
                                                    )
                                                }
                                            >
                                                {staff.isActive
                                                    ? "Tắt"
                                                    : "Bật"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Create / Edit modal */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
            >
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {editingStaff
                                ? "Sửa nhân viên"
                                : "Thêm nhân viên"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {formError && (
                            <Alert variant="danger">
                                {formError}
                            </Alert>
                        )}

                        <Form.Group
                            className="mb-3"
                            controlId="staffName"
                        >
                            <Form.Label>
                                Họ tên
                            </Form.Label>

                            <Form.Control
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Nguyễn Văn A"
                                disabled={submitting}
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="staffEmail"
                        >
                            <Form.Label>
                                Email
                            </Form.Label>

                            <Form.Control
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="staff@email.com"
                                disabled={submitting}
                            />
                        </Form.Group>

                        <Form.Check
                            type="switch"
                            id="staffActive"
                            name="isActive"
                            label="Đang làm việc"
                            checked={form.isActive}
                            onChange={handleChange}
                            disabled={submitting}
                        />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                            disabled={submitting}
                        >
                            Đóng
                        </Button>

                        <Button
                            type="submit"
                            className="border-0"
                            style={{ background: TEAL }}
                            disabled={submitting}
                        >
                            {submitting
                                ? "Đang lưu..."
                                : "Lưu"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}