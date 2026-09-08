import { Route, Routes } from "react-router-dom";
import { Home } from "../home/pages/Home";
import { lazy, Suspense } from "react";

const SignInPage = lazy(() => import("../features/authentication/pages/SignInPage"));
const SignUpPage = lazy(() => import("../features/authentication/pages/SignUpPage"));
const ProjectFeedPages = lazy(() => import("../features/projects/pages/ProjectsFeedPage"));
const ProjectDetailsPage = lazy(() => import("../features/projects/pages/ProjectDetailsPage"));
const NotFoundPage = lazy(() => import("../shared/pages/NotFoundPage"));

export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SuspenseWrapper><SignInPage /></SuspenseWrapper>} />
            <Route path="/sign-up" element={<SuspenseWrapper><SignUpPage /></SuspenseWrapper>} />
        

            <Route path="/projects" element={<SuspenseWrapper><ProjectFeedPages /></SuspenseWrapper>} />
            <Route path="/projects/:id" element={<SuspenseWrapper><ProjectDetailsPage /></SuspenseWrapper>} />
            <Route path="*" element={<SuspenseWrapper><NotFoundPage /></SuspenseWrapper>} />
        
        </Routes>
    )
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    )
}
