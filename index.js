const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

// ✅ Cấu hình CORS để tránh bị chặn từ trình duyệt
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://www.matichon.xyz");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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
        currency: "THB", // ✅ Luôn dùng THB cho thị trường Thái
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        data: [eventData],
      }
    );

    res.status(200).json({ success: true, fb_response: response.data });
  } catch (error) {
    console.error("❌ Error sending to CAPI:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// ✅ Start server (Vercel sẽ ignore phần này nhưng vẫn nên có cho local test)
app.listen(3000, () => {
  console.log("CAPI Gateway is running on port 3000");
});
