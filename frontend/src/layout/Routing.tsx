import { Route, Routes } from "react-router-dom";
import { Home } from "../home/pages/Home";
import { lazy, Suspense } from "react";
import { ProjectsLayout } from "../features/projects/pages/ProjectsLayout";
import { AccountSettings } from "../features/settings/components/AccountSettings";
import { DisplaySettings } from "../features/settings/components/DisplaySettings";
import { SecuritySettings } from "../features/settings/components/SecuritySettings";
import { ProtectedRoute } from "../features/authentication/components/ProtectedRoute";

const SignInPage = lazy(() => import("../features/authentication/pages/SignInPage"));
const SignUpPage = lazy(() => import("../features/authentication/pages/SignUpPage"));
const ProjectFeedPages = lazy(() => import("../features/projects/pages/ProjectsFeedPage"));
const ProjectDetailsPage = lazy(() => import("../features/projects/pages/ProjectDetailsPage"));
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("../shared/pages/NotFoundPage"));
const SettingsPage = lazy(() => import("../features/settings/pages/SettingsPage"));


export function Routing() {
    return (
        <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SuspenseWrapper><SignInPage /></SuspenseWrapper>} />
            <Route path="/sign-up" element={<SuspenseWrapper><SignUpPage /></SuspenseWrapper>} />

            <Route element={<ProtectedRoute />}>
               
                <Route element={<ProjectsLayout />}>
                    <Route path="/feed" element={<SuspenseWrapper><ProjectFeedPages /></SuspenseWrapper>} />
                    <Route path="/projects/:id" element={<SuspenseWrapper><ProjectDetailsPage /></SuspenseWrapper>} />
                </Route>

                <Route path="/u/:id" element={<SuspenseWrapper><ProfilePage /></SuspenseWrapper>} />

                <Route path="/settings" element={<SuspenseWrapper><SettingsPage /></SuspenseWrapper>}>
                    <Route index element={<SuspenseWrapper><AccountSettings /></SuspenseWrapper>} />
                    <Route path="security" element={<SuspenseWrapper><SecuritySettings /></SuspenseWrapper>} />
                    <Route path="display" element={<SuspenseWrapper><DisplaySettings /></SuspenseWrapper>} />
                    <Route path="account" element={<SuspenseWrapper><AccountSettings /></SuspenseWrapper>} />
                </Route>
            </Route>

            <Route path="*" element={<SuspenseWrapper><NotFoundPage /></SuspenseWrapper>} />
        
        </Routes>
    );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    );
}
