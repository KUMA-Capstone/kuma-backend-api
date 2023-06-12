const sql = require('../config/database');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const http = require('http');

// API Get All Moods entries
const getAllMoods = async (req, res) => {
  const userId = req.user.userId;

  const query = 'SELECT * FROM moods';
  sql.query(query, (err, result) => {
    if (err) {
      console.error('Error retrieving mood entries:', err);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
    } else {
      res.json({ error: false, message: 'success', uploadResult: result });
    }
  });
};


// API Update Mood by UserId
const updateMoodByUserId = (req, res) => {
  const { id, date, sub_mood, activities, story  } = req.body;
  const userId = req.user.userId;
  console.log(userId);

  if (!id || !date || !sub_mood || !activities || !story) {
    res.status(400).json({ error: true, message: 'Missing required fields in request body' });
    return;
  }

  const query = `UPDATE moods SET date = '${date}', sub_mood = '${sub_mood}', activities = '${JSON.stringify(activities)}', story = '${story}' WHERE id = '${id}' AND userId = '${userId}'`;
  sql.query(query, (err, result) => {
    if (err) {
      console.error('Error updating mood:', err);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: true, message: 'Mood entry not found or user is not authorized' });
    } else {
      const updatedMoodEntry = {
        id,
        date,
        sub_mood,
        activities,
        story,
        userId,
      };
      res.json({ error: false, message: 'success', uploadResult: updatedMoodEntry });
    }
  });
};

// API Entry New Mood and ML Prediction
const newMoodEntry = async (req, res) => {
  const { date, sub_mood, activities, story } = req.body;
  const userId = req.user.userId;

  if (!date || !sub_mood || !activities || !story) {
    res.status(400).json({ error: true, message: 'Missing required fields in request body' });
    return;
  }

  const currentDate = new Date().toISOString().slice(0, 10);

  const checkQuery = `SELECT * FROM moods WHERE userId = '${userId}' AND date = '${currentDate}'`;
  sql.query(checkQuery, async (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking mood entry:', checkErr);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
    } else if (checkResult.length > 0) {
      res.status(400).json({ error: true, message: 'You can only fill it once a day' });
    } else {
      try {
        const predictionResponse = await axios.post('https://flask-run-kt5kvwwsya-et.a.run.app/predict', {
          activities,
          sub_mood,
          story
        });
  
        const { prediction } = predictionResponse.data;
        console.log(prediction);
  
        const query = `INSERT INTO moods (date, sub_mood, activities, story, userId, prediction) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [date, sub_mood, JSON.stringify(activities), story, userId, prediction];
  
        sql.query(query, values, (err, result) => {
          if (err) {
            console.error('Error adding mood:', err);
            res.status(500).json({ error: true, message: 'Internal Server Error' });
          } else {
            const newMoodEntry = {
              id: result.insertId,
              date,
              sub_mood,
              activities,
              story,
              userId: userId,
              prediction
            };
            res.status(201).json({ error: false, message: 'success', uploadResult: newMoodEntry });
          }
        });
      } catch (error) {
        console.error('Error making prediction request:', error);
        res.status(500).json({ error: true, message: 'Error Making Prediction' });
      }
    }
  });
};



// API Get User by Id
const getUserById = (req, res) => {
  const token = (req.headers.authorization).slice(7)
  console.log(token)
  
  const decoded = jwt.decode(token, {complete: true});
  const payload = decoded.payload;
  const userId = payload["userId"];

  const query = `SELECT id, userId, date, sub_mood, activities, story, prediction, created_at FROM moods WHERE userId = '${userId}'`;
  sql.query(query, (err, result) => {
    if (err) {
      console.error('Error retrieving user data:', err);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
    } else {
      const userData = result.map(entry => {
        return {
          id: entry.id,
          userId: entry.userId,
          date: entry.date,
          sub_mood: entry.sub_mood,
          activities: JSON.parse(entry.activities),
          story: entry.story,
          prediction: entry.prediction,
          created_at: entry.created_at
        };
      });
      res.json({ error: false, message: 'success', moodResult: userData });
    }
  });
};


module.exports = {
  getAllMoods,
  getUserById,
  updateMoodByUserId,
  newMoodEntry
};
