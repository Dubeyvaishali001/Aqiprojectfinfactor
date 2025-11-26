const express = require('express');
const router = express.Router();
const aqicnService = require('../services/aqicnService');

router.get('/', async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({ error: "city query is required" });
    }

    const info = await aqicnService.getCityAQI(city);
    if (!info) return res.status(404).json({ error: "City not found" });

    res.json(info);
  } catch (err) {
    console.error("AQI Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
