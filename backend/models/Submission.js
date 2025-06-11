// backend/models/Submission.js - FIXED VERSION
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignment', 
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  grade: { 
    type: Number, 
    min: 0, 
    max: 100,
    default: null
  },
  feedback: { 
    type: String,
    default: ''
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  // Add attempt number to allow multiple submissions
  attemptNumber: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Create compound index for uniqueness per attempt
// This allows multiple submissions per assignment-student pair
submissionSchema.index({ assignment: 1, student: 1, attemptNumber: 1 }, { unique: true });

// Method to get next attempt number
submissionSchema.statics.getNextAttemptNumber = async function(assignmentId, studentId) {
  const lastSubmission = await this.findOne({ 
    assignment: assignmentId, 
    student: studentId 
  }).sort({ attemptNumber: -1 });
  
  return lastSubmission ? lastSubmission.attemptNumber + 1 : 1;
};

module.exports = mongoose.model('Submission', submissionSchema);