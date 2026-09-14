import { ToastContainer } from "react-toastify";
import { useTheme } from "../contexts/ThemeContext";

export function ToastContainerConfig() {

    const { theme } = useTheme();
    return (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            draggable={false}
            theme={theme === "dark" ? "dark" : "light"}
        />
    );
}