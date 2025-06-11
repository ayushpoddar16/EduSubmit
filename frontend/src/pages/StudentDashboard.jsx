import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Award,
  FileText,
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
// Add these imports for proper logout functionality
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  // Add these hooks for proper logout
  const { logout, user } = useAuth(); // Get user from auth context instead of hardcoding
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all assignments (created by teachers)
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAssignments(data.assignments);
      } else {
        console.error("Error fetching assignments:", data.message);
        setAssignments([]);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch student's submissions
  const fetchMySubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/submissions/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMySubmissions(data.submissions);
      } else {
        console.error("Error fetching submissions:", data.message);
        setMySubmissions([]);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setMySubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchMySubmissions();
  }, []);

  // Submit assignment
  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionContent.trim()) {
      alert("Please select an assignment and provide content");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignmentId: selectedAssignment._id,
          content: submissionContent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Assignment submitted successfully!");
        setSubmissionContent("");
        setSelectedAssignment(null);
        setActiveTab("submissions");
        fetchMySubmissions(); // Refresh submissions
      } else {
        alert(data.message || "Error submitting assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Error submitting assignment");
    } finally {
      setLoading(false);
    }
  };

  // Fixed logout function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout(); // Call the actual logout function from context
      navigate("/login"); // Navigate to login page
    }
  };

  const isSubmitted = (assignmentId) => {
    return mySubmissions.some((sub) => sub.assignment._id === assignmentId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.description &&
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    totalAssignments: assignments.length,
    completedAssignments: mySubmissions.length,
    averageGrade:
      mySubmissions.filter((s) => s.grade !== null).length > 0
        ? Math.round(
            mySubmissions
              .filter((s) => s.grade !== null)
              .reduce((sum, s) => sum + s.grade, 0) /
              mySubmissions.filter((s) => s.grade !== null).length
          )
        : 0,
    pendingAssignments: assignments.filter((a) => !isSubmitted(a._id)).length,
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );

  // Add fallback for user data
  const displayUser = user || {
    name: "Student User",
    email: "student@example.com",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Student Portal
                </h1>
                <p className="text-sm text-gray-500">Academic Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {displayUser.name}
                  </p>
                  <p className="text-xs text-gray-500">{displayUser.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
          {[
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "assignments", label: "Assignments", icon: FileText },
            { id: "submit", label: "Submit Work", icon: CheckCircle },
            { id: "submissions", label: "My Work", icon: BookOpen },
            { id: "grades", label: "Grades", icon: Award },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === id
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {displayUser.name}!
              </h2>
              <p className="text-gray-600">
                Here's your academic progress overview
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Assignments
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalAssignments}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.completedAssignments}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Average Grade
                    </p>
                    <p
                      className={`text-2xl font-bold ${getGradeColor(
                        stats.averageGrade
                      )}`}
                    >
                      {stats.averageGrade}%
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.pendingAssignments}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Upcoming Assignments */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upcoming Deadlines
              </h3>
              <div className="space-y-4">
                {assignments.slice(0, 3).map((assignment) => (
                  <div
                    key={assignment._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {assignment.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {assignment.dueDate
                          ? `Due: ${new Date(
                              assignment.dueDate
                            ).toLocaleDateString()}`
                          : "No due date"}
                      </p>
                    </div>
                    {!isSubmitted(assignment._id) && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
                {assignments.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No assignments available yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Assignments
              </h2>
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : filteredAssignments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {assignments.length === 0
                    ? "No assignments available yet."
                    : "No assignments found matching your search."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredAssignments.map((assignment) => {
                  const submitted = isSubmitted(assignment._id);

                  return (
                    <div
                      key={assignment._id}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              {assignment.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                Assignment
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4">
                            {assignment.description}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>
                                By: {assignment.teacher?.name || "Teacher"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                Created:{" "}
                                {new Date(
                                  assignment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {assignment.dueDate && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Due:{" "}
                                  {new Date(
                                    assignment.dueDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          {submitted ? (
                            <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              <CheckCircle className="h-4 w-4" />
                              <span>Submitted</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setActiveTab("submit");
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                            >
                              Submit Work
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Submit Tab */}
        {activeTab === "submit" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Submit Assignment
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Assignment
                  </label>
                  <select
                    value={selectedAssignment?._id || ""}
                    onChange={(e) => {
                      const assignment = assignments.find(
                        (a) => a._id === e.target.value
                      );
                      setSelectedAssignment(assignment);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Choose an assignment...</option>
                    {assignments
                      .filter((a) => !isSubmitted(a._id))
                      .map((assignment) => (
                        <option key={assignment._id} value={assignment._id}>
                          {assignment.title}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedAssignment && (
                  <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <h3 className="text-lg font-bold text-purple-900 mb-2">
                      {selectedAssignment.title}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {selectedAssignment.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-purple-600" />
                        <span>
                          Teacher:{" "}
                          {selectedAssignment.teacher?.name || "Teacher"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span>
                          Created:{" "}
                          {new Date(
                            selectedAssignment.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedAssignment.dueDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span>
                            Due:{" "}
                            {new Date(
                              selectedAssignment.dueDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Your Submission
                  </label>
                  <textarea
                    rows={12}
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Write your assignment submission here..."
                    required
                    // ADD THESE ATTRIBUTES:
                    onPaste={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}
                    onKeyDown={(e) => {
                      // Block Ctrl+V, Ctrl+A, Ctrl+C, Ctrl+X, Ctrl+Z, Ctrl+Y
                      if (
                        e.ctrlKey &&
                        ["v", "a", "c", "x", "z", "y"].includes(
                          e.key.toLowerCase()
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onContextMenu={(e) => e.preventDefault()} // Disable right-click menu
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {submissionContent.length} characters
                  </p>
                </div>

                <button
                  onClick={handleSubmitAssignment}
                  disabled={
                    !selectedAssignment || !submissionContent.trim() || loading
                  }
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Assignment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Submissions</h2>

            {loading ? (
              <LoadingSpinner />
            ) : mySubmissions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {mySubmissions.map((submission) => (
                  <div
                    key={submission._id}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {submission.assignment.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            Submitted:{" "}
                            {new Date(
                              submission.submittedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {submission.grade !== null ? (
                          <div>
                            <p
                              className={`text-2xl font-bold ${getGradeColor(
                                submission.grade
                              )}`}
                            >
                              {submission.grade}/100
                            </p>
                            <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              <Award className="h-4 w-4" />
                              <span>Graded</span>
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                            <Clock className="h-4 w-4" />
                            <span>Pending Grade</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Your Submission:
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {submission.content}
                        </p>
                      </div>

                      {submission.feedback && (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <h4 className="font-medium text-gray-800 mb-2">
                            Teacher Feedback:
                          </h4>
                          <p className="text-gray-700">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === "grades" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Grades</h2>

            {mySubmissions.filter((s) => s.grade !== null).length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No grades available yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {mySubmissions
                  .filter((s) => s.grade !== null)
                  .map((submission) => (
                    <div
                      key={submission._id}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {submission.assignment.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Submitted:{" "}
                              {new Date(
                                submission.submittedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-center">
                          <p
                            className={`text-3xl font-bold ${getGradeColor(
                              submission.grade
                            )}`}
                          >
                            {submission.grade}%
                          </p>
                        </div>
                      </div>

                      {submission.feedback && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            Teacher Feedback:
                          </p>
                          <p className="text-blue-800 text-sm">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
