// Updated App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import AuthProvider
import { AuthProvider } from "./context/AuthContext";
// Import ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

// Import your separate HomePage component
import HomePage from "./pages/HomePage"; // ADD THIS - adjust path if needed

// New pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// Final App with Routing
const App = () => {
  return (
    <AuthProvider> {/* WRAP EVERYTHING IN AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
                     
          {/* Protected Routes */}
          <Route 
             path="/teacher-dashboard" 
             element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
           />
          <Route 
             path="/student-dashboard" 
             element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
           />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;