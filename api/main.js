const { createServer } = require("http");
const port = process.env.PORT || 3000;
const exp = require("express");
const app = exp();
const router = require("./mods/routes/router");
const engine = require("./mods/templateEngine");
const path = require("path")

global.j = path.join;
global.sdir = path.resolve("static");
global.isPro = (process.env.NODE_ENV || "").toLowerCase() == "production";
global.__appV = 1;

app.engine(".hbs", engine);
app.set("view engine", ".hbs");
app.set("views", path.resolve("static", "views"));

app.use(router);

module.exports = createServer(app)
	.listen(port, () => console.log("Server started at ", (port)));