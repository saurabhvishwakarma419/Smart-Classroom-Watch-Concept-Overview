const FocusAnalytics = require('../models/FocusAnalytics');
const { spawn } = require('child_process');
const path = require('path');

// @desc    Process sensor data and calculate focus score
exports.processSensorData = async (req, res) => {
  try {
    const { studentId, classId, sensorData } = req.body;

    // Call Python analytics engine
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../../analytics/focus_algorithm.py'),
      JSON.stringify(sensorData)
    ]);

    let focusScore = 0;

    pythonProcess.stdout.on('data', (data) => {
      const result = JSON.parse(data.toString());
      focusScore = result.focusScore;
    });

    pythonProcess.on('close', async (code) => {
      if (code === 0) {
        // Save analytics data
        const analytics = await FocusAnalytics.create({
          studentId,
          classId,
          sessionDate: new Date(),
          startTime: sensorData.startTime,
          endTime: sensorData.endTime,
          focusScore,
          distractionCount: sensorData.distractionCount || 0,
          heartRateAvg: sensorData.heartRateAvg,
          movementScore: sensorData.movementScore,
          rawSensorData: sensorData
        });

        res.json({
          success: true,
          focusScore,
          analytics
        });
      } else {
        res.status(500).json({ error: 'Analytics processing failed' });
      }
    });
  } catch (error) {
    console.error('Process sensor data error:', error);
    res.status(500).json({ error: 'Failed to process sensor data' });
  }
};

// @desc    Get student focus data
exports.getStudentFocusData = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, limit = 30 } = req.query;

    const query = { studentId };
    
    if (startDate || endDate) {
      query.sessionDate = {};
      if (startDate) query.sessionDate.$gte = new Date(startDate);
      if (endDate) query.sessionDate.$lte = new Date(endDate);
    }

    const focusData = await FocusAnalytics.find(query)
      .sort({ sessionDate: -1 })
      .limit(parseInt(limit));

    const avgFocusScore = focusData.reduce((sum, item) => sum + item.focusScore, 0) / focusData.length;
    const totalDistractions = focusData.reduce((sum, item) => sum + item.distractionCount, 0);

    res.json({
      success: true,
      focusData,
      summary: {
        averageFocusScore: avgFocusScore.toFixed(2),
        totalSessions: focusData.length,
        totalDistractions,
        trend: calculateTrend(focusData)
      }
    });
  } catch (error) {
    console.error('Get student focus data error:', error);
    res.status(500).json({ error: 'Failed to fetch focus data' });
  }
};

// @desc    Get class analytics
exports.getClassAnalytics = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    const query = { classId };
    
    if (date) {
      const targetDate = new Date(date);
      query.sessionDate = targetDate;
    }

    const analytics = await FocusAnalytics.find(query)
      .populate('studentId', 'firstName lastName studentId');

    const avgClassFocus = analytics.reduce((sum, item) => sum + item.focusScore, 0) / analytics.length;
    const engagedStudents = analytics.filter(a => a.focusScore >= 70).length;

    res.json({
      success: true,
      analytics,
      summary: {
        averageClassFocus: avgClassFocus.toFixed(2),
        totalStudents: analytics.length,
        engagedStudents,
        engagementRate: ((engagedStudents / analytics.length) * 100).toFixed(2) + '%'
      }
    });
  } catch (error) {
    console.error('Get class analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch class analytics' });
  }
};

// @desc    Get student trends
exports.getStudentTrends = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const focusData = await FocusAnalytics.find({
      studentId,
      sessionDate: { $gte: startDate }
    }).sort({ sessionDate: 1 });

    const trends = {
      focusScoreTrend: focusData.map(d => ({ date: d.sessionDate, score: d.focusScore })),
      avgFocusScore: (focusData.reduce((sum, d) => sum + d.focusScore, 0) / focusData.length).toFixed(2),
      improvement: calculateImprovement(focusData)
    };

    res.json({
      success: true,
      trends
    });
  } catch (error) {
    console.error('Get student trends error:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
};

// @desc    Get dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAnalytics = await FocusAnalytics.find({
      sessionDate: { $gte: today }
    });

    const avgFocus = todayAnalytics.reduce((sum, a) => sum + a.focusScore, 0) / todayAnalytics.length || 0;
    const highPerformers = todayAnalytics.filter(a => a.focusScore >= 80).length;
    const needsAttention = todayAnalytics.filter(a => a.focusScore < 50).length;

    res.json({
      success: true,
      dashboard: {
        todayAvgFocus: avgFocus.toFixed(2),
        totalSessions: todayAnalytics.length,
        highPerformers,
        needsAttention,
        trends: {
          improving: highPerformers,
          declining: needsAttention
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Helper: Calculate trend
function calculateTrend(data) {
  if (data.length < 2) return 'stable';
  
  const recent = data.slice(0, Math.min(5, data.length));
  const older = data.slice(Math.min(5, data.length));
  
  const recentAvg = recent.reduce((sum, d) => sum + d.focusScore, 0) / recent.length;
  const olderAvg = older.reduce((sum, d) => sum + d.focusScore, 0) / older.length || recentAvg;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 5) return 'improving';
  if (diff < -5) return 'declining';
  return 'stable';
}

// Helper: Calculate improvement percentage
function calculateImprovement(data) {
  if (data.length < 2) return 0;
  
  const firstWeek = data.slice(0, 7);
  const lastWeek = data.slice(-7);
  
  const firstAvg = firstWeek.reduce((sum, d) => sum + d.focusScore, 0) / firstWeek.length;
  const lastAvg = lastWeek.reduce((sum, d) => sum + d.focusScore, 0) / lastWeek.length;
  
  return (((lastAvg - firstAvg) / firstAvg) * 100).toFixed(2);
}
