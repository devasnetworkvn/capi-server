const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  const { event_source_url, action_source, user_data, custom_data } = req.body;

  const PIXEL_ID = process.env.PIXEL_ID;
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

  // Lấy timestamp hiện tại
  const event_time = Math.floor(Date.now() / 1000);

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time,
        event_source_url,
        action_source,
        user_data,
        custom_data: {
          ...custom_data,
          currency: "THB",
        },
      },
    ],
  };

  try {
    const fbRes = await axios.post(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    res.status(200).json({ success: true, response: fbRes.data });
  } catch (err) {
    console.error("❌ CAPI error:", err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err?.response?.data || err.message,
    });
  }
};
