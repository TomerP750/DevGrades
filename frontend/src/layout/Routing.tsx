import { Route, Routes } from "react-router-dom";
import { SignInPage } from "../features/authentication/pages/SignInPage";
import { SignUpPage } from "../features/authentication/pages/SignUpPage";
import { Home } from "../home/pages/Home";


export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
    )
}