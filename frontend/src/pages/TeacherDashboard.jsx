import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Award, FileText, User, LogOut, CheckCircle, AlertCircle, TrendingUp, Users, Plus, Trash2 } from 'lucide-react';
// Add these imports for proper logout functionality
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  // Add these hooks for proper logout
  const { logout, user } = useAuth(); // Get user from auth context instead of hardcoding
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Assignment creation form
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  // Fixed logout function
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout(); // Call the actual logout function from context
      navigate('/login'); // Navigate to login page
    }
  };

  // Fetch teacher's assignments
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/assignments/teacher', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAssignments(data.assignments);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/submissions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  // Create assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAssignment)
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Assignment created successfully!');
        setNewAssignment({ title: '', description: '', dueDate: '' });
        fetchAssignments();
      } else {
        alert(data.message || 'Error creating assignment');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment');
    }
  };

  // Delete assignment
  const handleDeleteAssignment = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/assignments/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (data.success) {
          alert('Assignment deleted successfully!');
          fetchAssignments();
          fetchSubmissions();
        } else {
          alert(data.message || 'Error deleting assignment');
        }
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Error deleting assignment');
      }
    }
  };

  // Grade submission
  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/submissions/${submissionId}/grade`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ grade: parseInt(grade), feedback })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Submission graded successfully!');
        fetchSubmissions();
      } else {
        alert(data.message || 'Error grading submission');
      }
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Error grading submission');
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );

  // Add fallback for user data
  const displayUser = user || { name: 'Teacher User', email: 'teacher@example.com' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header - Same as Student Dashboard */}
      <nav className="bg-white shadow-lg border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Teacher Portal</h1>
                <p className="text-sm text-gray-500">Academic Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{displayUser.name}</p>
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
        {/* Tab Navigation - Same style as Student Dashboard */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'create', label: 'Create Assignment', icon: Plus },
            { id: 'assignments', label: 'My Assignments', icon: FileText },
            { id: 'submissions', label: 'Submissions', icon: Users }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === id 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {displayUser.name}!</h2>
              <p className="text-gray-600">Here's your teaching overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                    <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Grades</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {submissions.filter(s => s.grade === null).length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Assignment</h2>
              <form onSubmit={handleCreateAssignment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter assignment title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter assignment description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Due Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Create Assignment
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>
            {loading ? (
              <LoadingSpinner />
            ) : assignments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No assignments created yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{assignment.title}</h3>
                        <p className="text-gray-600 mb-4">{assignment.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {assignment.dueDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteAssignment(assignment._id)}
                        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Student Submissions</h2>
            {loading ? (
              <LoadingSpinner />
            ) : submissions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {submissions.map((submission) => (
                  <div key={submission._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {submission.assignment?.title || 'Unknown Assignment'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span>
                            Student: {submission.student?.name || 'Unknown Student'} 
                            {submission.student?.email && ` (${submission.student.email})`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Submitted: {new Date(submission.submittedAt).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {submission.grade !== null ? (
                          <div>
                            <p className="text-2xl font-bold text-green-600 mb-1">
                              {submission.grade}/100
                            </p>
                            <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              <Award className="h-4 w-4" />
                              <span>Graded</span>
                            </span>
                            {submission.feedback && (
                              <p className="text-sm text-gray-600 mt-2">
                                Feedback: {submission.feedback}
                              </p>
                            )}
                          </div>
                        ) : (
                          <GradeForm 
                            submissionId={submission._id}
                            onGrade={handleGradeSubmission}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Submission Content:</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{submission.content}</p>
                    </div>
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

// Grade form component
const GradeForm = ({ submissionId, onGrade }) => {
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (grade < 0 || grade > 100) {
      alert('Grade must be between 0 and 100');
      return;
    }
    onGrade(submissionId, grade, feedback);
    setGrade('');
    setFeedback('');
  };

  return (
    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          min="0"
          max="100"
          required
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Grade (0-100)"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <textarea
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Feedback (optional)"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
        >
          Submit Grade
        </button>
      </form>
    </div>
  );
};

export default TeacherDashboard;