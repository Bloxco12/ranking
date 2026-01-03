const express = require("express");
const rbx = require("noblox.js");

const app = express();

// ----------------------------
// CONFIG
// ----------------------------
const groupId = 706503944; // your group ID
const cookie = process.env.ROBLOX_COOKIE; // must be set in Railway env

// Serve static files if needed
app.use(express.static("public"));

// ----------------------------
// LOGIN TO ROBLOX
// ----------------------------
let isLoggedIn = false;

async function startApp() {
  if (!cookie) {
    console.error("❌ ROBLOX_COOKIE is not set!");
    return;
  }

  try {
    await rbx.setCookie(cookie);
    const currentUser = await rbx.getCurrentUser();
    console.log("✅ Logged in as:", currentUser.UserName);
    isLoggedIn = true;
  } catch (err) {
    console.error("❌ Failed to log in to Roblox:", err.message);
    isLoggedIn = false; // app keeps running
  }
}

startApp();

// ----------------------------
// ROUTES
// ----------------------------
app.get("/ranker", async (req, res) => {
  if (!isLoggedIn) {
    return res.status(503).json({ error: "Roblox login not ready yet!" });
  }

  try {
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

// Test route
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
