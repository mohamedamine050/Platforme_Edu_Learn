import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Offers from "./pages/Offers";
import Matiere from "./pages/Matiere";
import Assistance from "./pages/Assistance";
import Chapitres from "./pages/Chapitres";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import PrivateRoute from "./component/PrivateRoute";
import MatiereRedirect from "./component/MatiereRedirect";
import AdminRoute from "./component/AdminRoute";
import AdminLayout from "./component/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminChapters from "./pages/admin/AdminChapters";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminResources from "./pages/admin/AdminResources";
import AdminUsers from "./pages/admin/AdminUsers";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/assistance" element={<Assistance />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes — require authentication */}
        <Route element={<PrivateRoute />}>
          <Route path="/matiere" element={<MatiereRedirect />} />
          <Route path="/classes/:classId/courses" element={<Matiere />} />
          <Route path="/classes/:classId/courses/:courseId/chapters" element={<Chapitres />} />
          <Route path="/classes/:classId/courses/:courseId/chapters/:chapterId" element={<Video />} />
          <Route path="/profile" element={<Profile />} />
          {/* URL inconnue : passe par PrivateRoute → non connecté = /signin, connecté = accueil. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Admin routes — require ADMIN role */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="chapters" element={<AdminChapters />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;