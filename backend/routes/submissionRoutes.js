// backend/routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, teacherMiddleware, studentMiddleware } = require('../middleware/authMiddleware');
const {
  submitAssignment,
  getMySubmissions,
  getAllSubmissions,
  gradeSubmission
} = require('../controllers/submissionController');

// Student routes
router.post('/', authMiddleware, studentMiddleware, submitAssignment); // Submit assignment
router.get('/my', authMiddleware, studentMiddleware, getMySubmissions); // Get my submissions

// Teacher routes
router.get('/', authMiddleware, teacherMiddleware, getAllSubmissions); // Get all submissions
router.put('/:id/grade', authMiddleware, teacherMiddleware, gradeSubmission); // Grade submission

module.exports = router;