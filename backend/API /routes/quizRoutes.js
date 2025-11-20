const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { auth, authorize } = require('../middleware/auth');

// @route   POST /api/quizzes/create
// @desc    Create new quiz
// @access  Private (Teacher)
router.post('/create', auth, authorize('teacher', 'admin'), quizController.createQuiz);

// @route   GET /api/quizzes/active
// @desc    Get active quizzes for student
// @access  Private (Student)
router.get('/active', auth, quizController.getActiveQuizzes);

// @route   POST /api/quizzes/submit
// @desc    Submit quiz response
// @access  Private (Student)
router.post('/submit', auth, authorize('student'), quizController.submitResponse);

// @route   GET /api/quizzes/:quizId/results
// @desc    Get quiz results
// @access  Private (Teacher, Admin)
router.get('/:quizId/results', auth, authorize('teacher', 'admin'), quizController.getQuizResults);

// @route   GET /api/quizzes/history/:studentId
// @desc    Get student quiz history
// @access  Private
router.get('/history/:studentId', auth, quizController.getQuizHistory);

// @route   DELETE /api/quizzes/:quizId
// @desc    Delete quiz
// @access  Private (Teacher, Admin)
router.delete('/:quizId', auth, authorize('teacher', 'admin'), quizController.deleteQuiz);

module.exports = router;
