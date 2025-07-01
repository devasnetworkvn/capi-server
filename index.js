const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/capi', async (req, res) => {
  const event = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PIXEL_ID}/events`,
      {
        data: [
          {
            event_name: event.event_name,
            event_time: Math.floor(new Date().getTime() / 1000),
            action_source: "website",
            user_data: event.user_data,
            custom_data: event.custom_data || {},
          }
        ],
        access_token: process.env.ACCESS_TOKEN
      }
    );
    res.status(200).send(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send({ error: "Failed to send event to Facebook" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
