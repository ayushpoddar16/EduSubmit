// backend/controllers/assignmentController.js
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// Create new assignment (Teacher only)
const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and description are required' 
      });
    }

    const assignment = new Assignment({
      title,
      description,
      teacher: req.user.id, // From auth middleware
      dueDate: dueDate ? new Date(dueDate) : null
    });

    await assignment.save();
    
    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get all assignments for students
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      assignments
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get assignments created by teacher
const getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      assignments
    });
  } catch (error) {
    console.error('Get teacher assignments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Delete assignment (Teacher only)
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findOneAndDelete({
      _id: id,
      teacher: req.user.id
    });
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // Also delete related submissions
    await Submission.deleteMany({ assignment: id });
    
    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getTeacherAssignments,
  deleteAssignment
};