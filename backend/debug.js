process.on("uncaughtException", (e) => { console.error("REAL ERROR:", e); process.exit(1); });
process.on("unhandledRejection", (e) => { console.error("REAL REJECTION:", e); process.exit(1); });

const app = require("./app");
app.listen(5000, () => console.log(">>> Server listening on port 5000"));