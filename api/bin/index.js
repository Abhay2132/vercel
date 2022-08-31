module.exports = async () => {
	// const heapdump = require("heapdump");
	// heapdump.writeSnapshot();
	let __sat = global.__sat || Date.now();
	if (!Array.prototype.at)
		Array.prototype.at = function (n) {
			if (typeof n !== "number") return;
			let a = parseInt(n);
			return a < 0 ? this[this.length + n] : this[n];
		};
	const fs = require("fs");
	const path = require("path");
	global.log = (...args) => console.log(...args);
	global.elog = (...args) => console.error(...args);
	global.j = require("path").join;
	global.basename = require("path").basename;
	global.sdir = path.resolve("src", "static");
	global.pdir = j(sdir, "public");
	global._port = process.env.PORT || 3000;
	global.isPro = (process.env.NODE_ENV || "").toLowerCase() === "production";
	global.isA = require("os").platform() == "android";
	global.stdout = (...a) => process.stdout.write(a.join(" "));
	if ( ! isPro ) global.sockets = {};
	if( typeof global.__appV == "undefined" ) global.__appV = 0 

	//console.clear();
	isPro || console.log(require("colors").green("Starting Server !"))
	
	if (fs.existsSync(j(sdir, "files"))) fs.rm(j(sdir, "files"), {recursive : true}, () =>{})

	const exp = require("express"),
		app = exp();
	const bodyParser = require("body-parser"),
		compression = require("compression"),
		hlpr = require("./mods/hlpr"),
		exec = require("child_process").exec,
		engine = await require("./mods/templateEngine")(),
		cors = require("cors"),
		cookieParser = require("cookie-parser"),
		{ logger, liveReload } = hlpr,
		router = require("./mods/routes/router"),
		server = require("http").createServer(app),
		{getData} = require("./mods/getCJ/hlprs"),
		{Server} = require("socket.io"),
		io = new Server(server);

	app.use(cors());
	app.engine(".hbs", engine);
	app.set("view engine", ".hbs");
	app.set("views", j(__dirname, "..", "static", "views"));
	
	app.use(logger);
	
	app.use(cookieParser());
	app.use(exp.static(j(sdir, "public")));
	app.use(exp.json());
	app.use(compression());
	if ( typeof global.__c4u !== "undefined" ) app.use(__c4u); 
	
	app.use(router)
	io.on("connection", require("./mods/socketHandler/main"));
	server.listen(_port, async () => {
		log(`Server started at localhost:${_port} in ${isPro ? "pro" : "dev"} mode \n( version : ${__appV} ) in ${require("colors").yellow(Date.now() - __sat+"ms")}`)
		if ( ! isPro ) liveReload();
		if ( isPro ) global._cj_data = await getData();
		require("fs").existsSync(j(sdir, "files")) && require("fs").rm(j(sdir, "files"), {recursive: true}, ()=>{});
	})
}