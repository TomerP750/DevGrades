import { Route, Routes } from "react-router-dom";
import { Home } from "../home/pages/Home";


export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    )
}