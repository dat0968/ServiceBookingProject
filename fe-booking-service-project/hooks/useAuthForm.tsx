import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/services/authService";
export function useAuthForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [validated, setValidated] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "danger",
    });
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        setValidated(true);
        setError("");
        if (!form.checkValidity()) {
            return;
        }

        setSubmitting(true);

        try {
            const response = await login({ email: email.trim(), password });
            const returnUrl = searchParams.get("returnUrl") || "/";
            setToast({
                show: true,
                message: "Đăng nhập thành công.",
                type: "success",
            });
            setTimeout(() => {
                // router.push(returnUrl);
                if (response.role == 'Customer') {
                    router.push(returnUrl);
                }
                else{
                    router.push('/admin/services');
                }
            }, 2000)
        } catch {
            setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    }
    return {
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
        toast,
        setToast
    };
}