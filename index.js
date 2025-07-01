const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

// ✅ Cấu hình CORS để cho phép mọi domain (trong quá trình test)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Thay * bằng domain thật nếu muốn chặn
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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
        currency: "THB", // Đảm bảo Facebook CAPI hiểu đúng đơn vị tiền
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      { data: [eventData] }
    );

    return res.status(200).json({
      success: true,
      message: "Event sent to Facebook CAPI successfully",
      fb_response: response.data,
    });
  } catch (error) {
    console.error("❌ Facebook CAPI Error:", error?.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send event to Facebook CAPI",
      error: error?.response?.data || error.message,
    });
  }
});

module.exports = app;
