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
            await login({ email: email.trim(), password });
            const returnUrl = searchParams.get("returnUrl") || "/";
            router.push(returnUrl);
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
    };
}