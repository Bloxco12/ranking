/*INSERT GROUP ID AND COOKIE BELOW*/

var groupId = 706503944 // << Replace 12345 with your Group Id
var cookie = "_CAEaAhADIhwKBGR1aWQSFDE2NTc5MTgzMDY2MDM1NTc3NzA4KAM.a5VaUzF015j0r-LOnD1QPwTu7t9RM_G8L6C-JGzg0-ZpwpwQQ1Dr9F5aKH6mMv265Szm9EIVJp-HrttaG7NSbh0yfgdtvWXirk_MJRPrksP75fAscPxeAOMiBmhh35fMEA1gOzlAXUyjg414kcpCQL8lIwiHk6qz15zZk1np6SEGlFPlmq4HOkUYY9Z7R9BC8g02Xp6OMkkldngKt0Q3_rs0oyfFns_-IHDPpDmHHDMQCHUtQA_-139rKDPl-rj7kvSOUUpcSAiE2De_ML6I0VvjIrv8D19ifq4h9dJyxCmWPYXM9YB8UJSCUlkMVAqUe2vHoFnkwHEJoX26VuYLvGCSThFl5BLDNxfyIyKqoFIzE8Pc9fovSVtVdi1-XpsO66KoF58NGVJNTGaTqSUPYjmrYQ7bpSeawHxHq-uaXEqt0wP7cWpDAEyzVomDULaxZLyBjGlrtAgBPJf6ov6HeWDKHBrY6UuPHvV8ZAFeKimS-FPkniFlujcSPJ449p5_0OPLUNOPzGbLeWnf5HsdoLyGBZ0JL2shPNK2EFe6bA3LeM-js4FlYbAr9-dXPeiprFwCgASYt1f7vVnVrfvgvDlI6sr5SzsJnNTL6JMDccA1B_mYZoqsJwn0HazkLQxYnYEjAgzg-df7vrp4iq3Jz4TFxttIDuKYfs409_sa8fgNYsOKnIgmswWtatog3Z76tYPwroPLUdX7tapt9t_8vIa9eNh0bHGihmLnIFiMbgNpJ1gW8JrNRn3nw1RqfkdG9d2QSLIhqQk73FxTzydy_Jvk6_umEW6qJbO_OR31gEnDPfRe" // << Put your account cookie inside of the quotes

/*INSERT GROUP ID AND COOKIE ABOVE*/


const express = require("express");
const rbx = require("noblox.js");
const app = express();

app.use(express.static("public"));

async function startApp() {
  await rbx.setCookie(cookie);
  let currentUser = await rbx.getCurrentUser();
  console.log(currentUser.UserName);
}
startApp();

app.get("/ranker", (req, res) => {
    var User = req.param("userid");
    var Rank = req.param("rank");
  
    rbx.setRank(groupId, parseInt(User), parseInt(Rank));
    res.json("Ranked!");
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
