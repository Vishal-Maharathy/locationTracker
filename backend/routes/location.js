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


module.exports = router;