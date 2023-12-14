const router = require('express').Router();
const locationSchema = require('../models/locationSchema').locationSchema;

router.get('/getLocation', async (req, res) => {
  try {
    const userId = req.query.userId;
    const targetLocation = await locationSchema.findOne({ userId: userId }).sort({ timestamp: -1 });
    console.log(targetLocation)
    res.status(200).json({ success: true, location: targetLocation });
  } catch (error) {
    console.error('Error fetching target location:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/postLocation', async (req, res) => {
  try {
    let body = req.body;
    let targetLocation = await locationSchema.create(body);
    res.status(200).json({ success: true, location: targetLocation });
  } catch (error) {
    console.error('Error posting target location:', error);
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
});
router.post('/getUserLocations', async (req, res) => {
  try {
    const { latitude, longitude, range } = req.body;
    // Assuming you have a Mongoose model named UserLocation with fields 'latitude' and 'longitude'
    const usersAround = await UserLocation.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: range * 1000, // Convert range to meters
        },
      },
    });

    res.status(200).json({ usersAround });
  } catch (err) {
    console.error('Error fetching user locations:', error);
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
})
module.exports = router;