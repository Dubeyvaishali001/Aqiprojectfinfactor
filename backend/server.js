require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { setCache, getCache } = require("./cache");

const app = express();
app.use(cors());

app.get("/api/aqi/:city", async (req, res) => {
    const city = req.params.city.toLowerCase();
      console.log("CITY RECEIVED:", city);

    // 1. Check Cache
    const cached = getCache(city);
    if (cached) {
        return res.json({ source: "cache", ...cached });
    }

    try {
        // 2. Call the AQICN API
        const url = `https://api.waqi.info/feed/${city}/?token=${process.env.API_KEY}`;

        const response = await axios.get(url);

        if (response.data.status !== "ok") {
            return res.status(404).json({ error: "City not found" });
        }

        const result = {
            city: response.data.data.city.name,
            aqi: response.data.data.aqi,
            dominentpol: response.data.data.dominentpol,
            iaqi: response.data.data.iaqi,
            time: response.data.data.time.s
        };

        setCache(city, result);

        res.json({ source: "api", ...result });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
