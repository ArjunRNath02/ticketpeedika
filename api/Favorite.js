const express = require('express');
const router = express.Router();

const Favorite = require('./../models/Favorite');

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

// Route to remove a favorite movie
router.delete('/remove-favorite/:userId/:movieId', async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    // Check if the user's favorite movie exists
    const favoriteMovie = await Favorite.findOneAndDelete({ userId, movieId });

    if (favoriteMovie) {
      res.json({
        status: 'SUCCESS',
        message: 'Favorite movie removed successfully.',
      });
    } else {
      res.status(404).json({
        status: 'FAILED',
        message: 'Favorite movie not found or already removed.',
      });
    }
  } catch (error) {
    console.error('Error removing favorite movie:', error);
    res.status(500).json({
      status: 'FAILED',
      message: 'An error occurred while removing favorite movie.',
    });
  }
});

module.exports = router;
