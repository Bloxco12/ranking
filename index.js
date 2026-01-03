const express = require("express");
const rbx = require("noblox.js");

const app = express();

const groupId = 706503944;
const cookie = "_CAEaAhADIhwKBGR1aWQSFDE2NTc5MTgzMDY2MDM1NTc3NzA4KAM.a5VaUzF015j0r-LOnD1QPwTu7t9RM_G8L6C-JGzg0-ZpwpwQQ1Dr9F5aKH6mMv265Szm9EIVJp-HrttaG7NSbh0yfgdtvWXirk_MJRPrksP75fAscPxeAOMiBmhh35fMEA1gOzlAXUyjg414kcpCQL8lIwiHk6qz15zZk1np6SEGlFPlmq4HOkUYY9Z7R9BC8g02Xp6OMkkldngKt0Q3_rs0oyfFns_-IHDPpDmHHDMQCHUtQA_-139rKDPl-rj7kvSOUUpcSAiE2De_ML6I0VvjIrv8D19ifq4h9dJyxCmWPYXM9YB8UJSCUlkMVAqUe2vHoFnkwHEJoX26VuYLvGCSThFl5BLDNxfyIyKqoFIzE8Pc9fovSVtVdi1-XpsO66KoF58NGVJNTGaTqSUPYjmrYQ7bpSeawHxHq-uaXEqt0wP7cWpDAEyzVomDULaxZLyBjGlrtAgBPJf6ov6HeWDKHBrY6UuPHvV8ZAFeKimS-FPkniFlujcSPJ449p5_0OPLUNOPzGbLeWnf5HsdoLyGBZ0JL2shPNK2EFe6bA3LeM-js4FlYbAr9-dXPeiprFwCgASYt1f7vVnVrfvgvDlI6sr5SzsJnNTL6JMDccA1B_mYZoqsJwn0HazkLQxYnYEjAgzg-df7vrp4iq3Jz4TFxttIDuKYfs409_sa8fgNYsOKnIgmswWtatog3Z76tYPwroPLUdX7tapt9t_8vIa9eNh0bHGihmLnIFiMbgNpJ1gW8JrNRn3nw1RqfkdG9d2QSLIhqQk73FxTzydy_Jvk6_umEW6qJbO_OR31gEnDPfRe";

// Start server immediately
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

// Roblox login in the background
let isLoggedIn = false;
async function loginRoblox() {
  try {
    await rbx.setCookie(cookie);
    const currentUser = await rbx.getCurrentUser();
    console.log("✅ Logged in as:", currentUser.UserName);
    isLoggedIn = true;
  } catch (err) {
    console.error("❌ Roblox login failed:", err.message);
    setTimeout(loginRoblox, 30000); // retry every 30 seconds
  }
}
loginRoblox();

// Routes
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
