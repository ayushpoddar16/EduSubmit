// backend/routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, teacherMiddleware } = require('../middleware/authMiddleware');
const {
  createAssignment,
  getAssignments,
  getTeacherAssignments,
  deleteAssignment
} = require('../controllers/assignmentController');

// Student routes
router.get('/', authMiddleware, getAssignments); // Get all assignments

// Teacher routes
router.post('/', authMiddleware, teacherMiddleware, createAssignment); // Create assignment
router.get('/teacher', authMiddleware, teacherMiddleware, getTeacherAssignments); // Get teacher's assignments
router.delete('/:id', authMiddleware, teacherMiddleware, deleteAssignment); // Delete assignment

module.exports = router;