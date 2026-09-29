"use client";

import { Toast, ToastContainer } from "react-bootstrap";
import { AppToastProps } from "@/types/AppToastProps";

export default function AppToast(data : AppToastProps) {
    return (
        <ToastContainer
            position="top-end"
            className="p-3"
            style={{ zIndex: 9999 }}
        >
            <Toast
                show={data.show}
                onClose={data.onClose}
                delay={3000}
                autohide
                bg={data.type}
            >
                <Toast.Header>
                    <strong className="me-auto">
                        {data.type === "success"
                            ? "Thành công"
                            : "Lỗi"}
                    </strong>
                </Toast.Header>

                <Toast.Body className="text-white">
                    {data.message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}