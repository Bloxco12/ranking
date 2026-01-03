// index.js
const express = require("express");
const rbx = require("noblox.js");

const app = express();

// ----------------------------
// CONFIG
// ----------------------------

// Your public group ID (hardcoded)
const groupId = 706503944;

// Secret Roblox cookie
const cookie = process.env.ROBLOX_COOKIE;

// Optional API key for security
const apiKey = process.env.API_KEY || null;

// Serve static files if needed
app.use(express.static("public"));

// ----------------------------
// LOGIN TO ROBLOX
// ----------------------------
async function startApp() {
  if (!cookie) {
    console.error("❌ ROBLOX_COOKIE is not set in environment variables!");
    process.exit(1); // stop the app if cookie missing
  }

  try {
    await rbx.setCookie(cookie);
    const currentUser = await rbx.getCurrentUser();
    console.log("✅ Logged in as:", currentUser.UserName);
  } catch (err) {
    console.error("❌ Failed to log in to Roblox:", err.message);
    process.exit(1); // stop app if login fails
  }
}

startApp();

// ----------------------------
// ROUTES
// ----------------------------
app.get("/ranker", async (req, res) => {
  try {
    // Optional API key check
    if (apiKey && req.query.key !== apiKey) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const userId = Number(req.query.userid);
    const rank = Number(req.query.rank);

    if (!userId || !rank) {
      return res.status(400).json({ error: "Missing userid or rank" });
    }

    await rbx.setRank(groupId, userId, rank);
    console.log(`Ranked user ${userId} to ${rank}`);
    res.json({ success: true, message: `Ranked user ${userId} to ${rank}` });
  } catch (err) {
    console.error("❌ Error ranking user:", err.message);
    res.status(500).json({ error: "Failed to rank user", details: err.message });
  }
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Roblox Ranker is running!");
});

// ----------------------------
// START SERVER
// ----------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
