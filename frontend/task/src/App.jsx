import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/UserProfile";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import EditUserForm from "./components/EditUserForm";
import ViewUserDetails from "./components/viewUserDetail";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/edit/:userId"
              element={
                <ProtectedRoute adminOnly={true}>
                  <EditUserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:userId"
              element={
                <ProtectedRoute adminOnly={true}>
                  <ViewUserDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
