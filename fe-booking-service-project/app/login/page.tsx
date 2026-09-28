"use client";

import { Alert, Button, Card, Form, InputGroup, Spinner } from "react-bootstrap";
import { useAuthForm } from "@/hooks/useAuthForm";

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    setError,
    validated,
    submitting,
    handleSubmit,
  } = useAuthForm();

  return (
    <div
      className="w-100 d-flex justify-content-center align-items-center px-3"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #0f766e 0%, #115e59 42%, #0f172a 100%)",
      }}
    >
      <Card
        className="border-0 shadow-lg"
        style={{ width: "100%", maxWidth: 440, borderRadius: 16 }}
      >
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <Card.Title as="h1" className="fs-4 fw-bold mb-1">
              Đăng nhập
            </Card.Title>
            <p className="text-secondary mb-0">
              Đặt lịch dịch vụ nhanh chóng, tiện lợi
            </p>
          </div>

          {error ? (
            <Alert variant="danger" className="py-2" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          ) : null}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập email hợp lệ.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </Button>
                <Form.Control.Feedback type="invalid">
                  Mật khẩu phải có ít nhất 6 ký tự.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-2 fw-semibold border-0"
              style={{ background: "#0f766e" }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
