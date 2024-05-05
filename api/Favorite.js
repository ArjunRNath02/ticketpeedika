const express = require('express');
const router = express.Router();

const Favorite = require('../models/Favorite');

// Add Favorite Movie
router.post('/add-favorite', async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    const existingFavorite = await Favorite.findOne({ userId, movieId });
    if (existingFavorite) {
      return res.json({ status: 'FAILED', message: 'Movie already in favorites' });
    }

    const newFavorite = new Favorite({ userId, movieId });
    await newFavorite.save();

    res.json({ status: 'SUCCESS', message: 'Movie added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ status: 'FAILED', message: 'An error occurred while adding favorite' });
  }
});

// Get Favorite Movies by User
router.get('/get-favorites/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const favorites = await Favorite.find({ userId }).select('movieId');
    res.json({ status: 'SUCCESS', data: favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ status: 'FAILED', message: 'An error occurred while fetching favorites' });
  }
});

module.exports = router;
