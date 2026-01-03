const express = require("express");
const rbx = require("noblox.js");

const app = express();

/* PUBLIC – OK TO HARDCODE */
const groupId = 706503944; // your group ID here

/* SECRET – MUST BE ENV VAR */
const cookie = process.env.ROBLOX_COOKIE;

app.use(express.static("public"));

async function startApp() {
  try {
    await rbx.setCookie(cookie);
    const currentUser = await rbx.getCurrentUser();
    console.log("Logged in as:", currentUser.UserName);
  } catch (err) {
    console.error("Login failed:", err);
  }
}
startApp();

app.get("/ranker", async (req, res) => {
  try {
    const userId = Number(req.query.userid);
    const rank = Number(req.query.rank);

    if (!userId || !rank) {
      return res.status(400).json({ error: "Missing userid or rank" });
    }

    await rbx.setRank(groupId, userId, rank);
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to rank user" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Running on port", port);
});
