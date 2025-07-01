const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PIXEL_ID = process.env.PIXEL_ID;

app.post("/capi", async (req, res) => {
  try {
    const {
      event_name,
      event_time = Math.floor(Date.now() / 1000),
      event_source_url,
      action_source = "website",
      user_data,
      custom_data = {},
    } = req.body;

    const eventData = {
      event_name,
      event_time,
      event_source_url,
      action_source,
      user_data,
      custom_data: {
        ...custom_data,
        currency: "THB", // 👈 Luôn dùng THB cho thị trường Thái
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        data: [eventData],
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("CAPI Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 CAPI Gateway running on port ${PORT}`);
});
