require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Twilio } = require("twilio");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const BOT = process.env.TWILIO_WHATSAPP_FROM;

// ---------------------------
// RECEIVE WHATSAPP MESSAGES
// ---------------------------
app.post("/webhook", async (req, res) => {
  const from = req.body.From;          // whatsapp:+91xxxx
  const body = req.body.Body || "";    // text message

  const latitude = req.body.Latitude;
  const longitude = req.body.Longitude;

  console.log("📩 Incoming raw payload:", req.body);

  // ✅ CASE 1: User sent location
  if (latitude && longitude) {
    console.log("📍 USER LOCATION RECEIVED");
    console.log("Latitude :", latitude);
    console.log("Longitude:", longitude);

    // await client.messages.create({
    //   from: BOT,
    //   to: from,
    //   body: `Location received ✅\nLatitude: ${latitude}\nLongitude: ${longitude}`
    // });

    return res.sendStatus(200);
  }

  // ✅ CASE 2: Normal greeting / text
  console.log("💬 USER MESSAGE:", body);

  await client.messages.create({
    from: BOT,
    to: from,
    body: "Hello 👋\nPlease share your location 📍 to continue."
  });

  res.sendStatus(200);
});

// ---------------------------
// SEND MESSAGE (TEST HELPER)
// ---------------------------
app.get("/test-send", async (req, res) => {
  try {
    const msg = await client.messages.create({
      from: BOT,
      to: "whatsapp:+91YOURNUMBER", // must be sandbox-joined
      body: "WhatsApp bot is working 🚀"
    });

    res.send("Sent! SID: " + msg.sid);
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// ---------------------------
app.listen(process.env.PORT, () =>
  console.log("🚀 Server running on port " + process.env.PORT)
);
