const express = require("express");
const rbx = require("noblox.js");

const app = express();

const groupId = 706503944;
const cookie = process.env.ROBLOX_COOKIE;

// Serve static files
app.use(express.static("public"));

let isLoggedIn = false;

// Start server immediately
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

// ----------------------
// Background Roblox login
// ----------------------
async function loginRoblox() {
  if (!cookie) {
    console.error("❌ ROBLOX_COOKIE not set!");
    return;
  }

  try {
    await rbx.setCookie(cookie);
    const currentUser = await rbx.getCurrentUser();
    console.log("✅ Logged in as:", currentUser.UserName);
    isLoggedIn = true;
  } catch (err) {
    console.error("❌ Roblox login failed:", err.message);
    // Retry login in 30 seconds
    setTimeout(loginRoblox, 30000);
  }
}

loginRoblox();

// ----------------------
// Routes
// ----------------------
app.get("/", (req, res) => res.send("Roblox Ranker is running!"));

app.get("/ranker", async (req, res) => {
  if (!isLoggedIn) return res.status(503).json({ error: "Roblox login not ready yet!" });

  const userId = Number(req.query.userid);
  const rank = Number(req.query.rank);

  if (!userId || !rank) return res.status(400).json({ error: "Missing userid or rank" });

  try {
    await rbx.setRank(groupId, userId, rank);
    console.log(`Ranked user ${userId} to ${rank}`);
    res.json({ success: true, message: `Ranked user ${userId} to ${rank}` });
  } catch (err) {
    console.error("❌ Failed to rank:", err.message);
    res.status(500).json({ error: "Failed to rank user", details: err.message });
  }
});
