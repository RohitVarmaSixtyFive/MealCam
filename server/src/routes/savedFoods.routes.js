const express = require('express');
const SavedFood = require('../models/SavedFood');
const auth = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/saved-foods - Get user's saved foods
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      sortBy = 'usageCount' 
    } = req.query;

    const query = { userId: req.user._id };

    // Category filtering
    if (category) {
      query.category = category;
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === 'usageCount') {
      sortOptions.usageCount = -1;
    } else if (sortBy === 'name') {
      sortOptions.name = 1;
    } else if (sortBy === 'recent') {
      sortOptions.updatedAt = -1;
    }

    const savedFoods = await SavedFood.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SavedFood.countDocuments(query);

    res.json({
      savedFoods,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get saved foods error:', error);
    res.status(500).json({
      error: 'Failed to fetch saved foods',
      message: 'Something went wrong while fetching saved foods'
    });
  }
});

// GET /api/saved-foods/:id - Get specific saved food
router.get('/:id', async (req, res) => {
  try {
    const savedFood = await SavedFood.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!savedFood) {
      return res.status(404).json({
        error: 'Saved food not found',
        message: 'The requested saved food does not exist'
      });
    }

    res.json({ savedFood });
  } catch (error) {
    console.error('Get saved food error:', error);
    res.status(500).json({
      error: 'Failed to fetch saved food',
      message: 'Something went wrong while fetching the saved food'
    });
  }
});

// POST /api/saved-foods - Create new saved food
router.post('/', async (req, res) => {
  try {
    const savedFoodData = {
      ...req.body,
      userId: req.user._id
    };

    const savedFood = new SavedFood(savedFoodData);
    await savedFood.save();

    res.status(201).json({
      message: 'Saved food created successfully',
      savedFood
    });
  } catch (error) {
    console.error('Create saved food error:', error);
    res.status(500).json({
      error: 'Failed to create saved food',
      message: 'Something went wrong while creating the saved food'
    });
  }
});

// PUT /api/saved-foods/:id - Update saved food
router.put('/:id', async (req, res) => {
  try {
    const savedFood = await SavedFood.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!savedFood) {
      return res.status(404).json({
        error: 'Saved food not found',
        message: 'The requested saved food does not exist'
      });
    }

    res.json({
      message: 'Saved food updated successfully',
      savedFood
    });
  } catch (error) {
    console.error('Update saved food error:', error);
    res.status(500).json({
      error: 'Failed to update saved food',
      message: 'Something went wrong while updating the saved food'
    });
  }
});

// DELETE /api/saved-foods/:id - Delete saved food
router.delete('/:id', async (req, res) => {
  try {
    const savedFood = await SavedFood.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!savedFood) {
      return res.status(404).json({
        error: 'Saved food not found',
        message: 'The requested saved food does not exist'
      });
    }

    res.json({
      message: 'Saved food deleted successfully'
    });
  } catch (error) {
    console.error('Delete saved food error:', error);
    res.status(500).json({
      error: 'Failed to delete saved food',
      message: 'Something went wrong while deleting the saved food'
    });
  }
});

// POST /api/saved-foods/:id/use - Increment usage count
router.post('/:id/use', async (req, res) => {
  try {
    const savedFood = await SavedFood.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $inc: { usageCount: 1 } },
      { new: true }
    );

    if (!savedFood) {
      return res.status(404).json({
        error: 'Saved food not found',
        message: 'The requested saved food does not exist'
      });
    }

    res.json({
      message: 'Usage count updated',
      savedFood
    });
  } catch (error) {
    console.error('Update usage count error:', error);
    res.status(500).json({
      error: 'Failed to update usage count',
      message: 'Something went wrong while updating the usage count'
    });
  }
});

module.exports = router;
