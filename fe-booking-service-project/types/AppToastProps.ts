export interface AppToastProps {
    show: boolean;
    message: string;
    type: "success" | "danger";
    onClose: () => void;
}