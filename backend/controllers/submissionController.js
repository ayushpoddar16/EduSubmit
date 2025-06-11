// backend/controllers/submissionController.js - FIXED VERSION
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

// Submit assignment (allows multiple attempts)
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, content } = req.body;
    const studentId = req.user.id || req.user._id;

    // Validate required fields
    if (!assignmentId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Assignment ID and content are required'
      });
    }

    // ADD ADDITIONAL VALIDATION
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated properly'
      });
    }

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Get next attempt number for this student-assignment combination
    const attemptNumber = await Submission.getNextAttemptNumber(assignmentId, studentId);

    // Create new submission
    const submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      content,
      attemptNumber
    });

    await submission.save();

    // Populate assignment and student details
    await submission.populate([
      { path: 'assignment', select: 'title description' },
      { path: 'student', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: `Assignment submitted successfully (Attempt #${attemptNumber})`,
      submission
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting assignment',
      error: error.message
    });
  }
};

// Get student's own submissions
const getMySubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const submissions = await Submission.find({ student: studentId })
      .populate('assignment', 'title description dueDate')
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
};

// Get all submissions (teacher only) - FIXED VERSION
const getAllSubmissions = async (req, res) => {
  try {
    const teacherId = req.user.id; // Get the current teacher's ID
    const { assignmentId } = req.query;
    
    let filter = {};
    
    if (assignmentId) {
      // If specific assignment ID is provided, check if it belongs to this teacher
      const assignment = await Assignment.findOne({ 
        _id: assignmentId, 
        teacher: teacherId 
      });
      
      if (!assignment) {
        return res.status(403).json({
          success: false,
          message: 'You can only view submissions for your own assignments'
        });
      }
      
      filter.assignment = assignmentId;
    } else {
      // If no specific assignment, get all assignments created by this teacher
      const teacherAssignments = await Assignment.find({ teacher: teacherId }).select('_id');
      const assignmentIds = teacherAssignments.map(a => a._id);
      
      if (assignmentIds.length === 0) {
        return res.json({
          success: true,
          submissions: []
        });
      }
      
      filter.assignment = { $in: assignmentIds };
    }

    const submissions = await Submission.find(filter)
      .populate('assignment', 'title description')
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
};

// Grade submission (teacher only)
const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    // Validate grade
    if (grade < 0 || grade > 100) {
      return res.status(400).json({
        success: false,
        message: 'Grade must be between 0 and 100'
      });
    }

    const submission = await Submission.findByIdAndUpdate(
      id,
      { 
        grade: parseFloat(grade), 
        feedback: feedback || '' 
      },
      { new: true }
    ).populate([
      { path: 'assignment', select: 'title description' },
      { path: 'student', select: 'name email' }
    ]);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Submission graded successfully',
      submission
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error grading submission',
      error: error.message
    });
  }
};

// Get latest submission for each assignment (for student dashboard)
const getLatestSubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const submissions = await Submission.aggregate([
      { $match: { student: mongoose.Types.ObjectId(studentId) } },
      { $sort: { attemptNumber: -1 } },
      { $group: {
          _id: '$assignment',
          latestSubmission: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$latestSubmission' } }
    ]);

    await Submission.populate(submissions, [
      { path: 'assignment', select: 'title description dueDate' },
      { path: 'student', select: 'name email' }
    ]);

    res.json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error('Error fetching latest submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest submissions',
      error: error.message
    });
  }
};

module.exports = {
  submitAssignment,
  getMySubmissions,
  getAllSubmissions,
  gradeSubmission,
  getLatestSubmissions
};