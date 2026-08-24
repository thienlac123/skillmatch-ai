import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import CreateJob from "./pages/CreateJob";
import JobDetail from "./pages/JobDetail";
import MatchResult from "./pages/MatchResult";
import Roadmaps from "./pages/Roadmap";
import RoadmapDetail from "./pages/RoadmapDetail";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import Applicants from "./pages/Applicants";
import Conversation from "./pages/Conversation";
import FreelancerProfile from "./pages/FreelancerProfile";
import Conversations from "./pages/Conversations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/new"
          element={
            <ProtectedRoute>
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/applicants"
          element={
            <ProtectedRoute>
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancers/:id"
          element={
            <ProtectedRoute>
              <FreelancerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/apply"
          element={
            <ProtectedRoute>
              <ApplyJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversations/:id"
          element={
            <ProtectedRoute>
              <Conversation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversations"
          element={
            <ProtectedRoute>
              <Conversations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches/:id"
          element={
            <ProtectedRoute>
              <MatchResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmaps"
          element={
            <ProtectedRoute>
              <Roadmaps />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmaps/new"
          element={
            <ProtectedRoute>
              <Roadmaps />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmaps/:id"
          element={
            <ProtectedRoute>
              <RoadmapDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;