const fs = require("fs"),
	ddir = j(sdir, "files", "imgD"),
	elog = (...a) => console.error(...a),
	{ parse } = require("node-html-parser"),
	bn = require("path").basename,
	ext = (f) =>
		typeof f !== "string"
			? false
			: f.split(".").length > 1
			? f.split(".").at(-1)
			: false,
	pn = (url) => require("url").parse(url).pathname,
	stdout = (...a) => process.stdout.write(a.join(" ")),
	beautify = (str) =>
		require("prettier").format(
			typeof str == "object" ? JSON.stringify(str) : str,
			{ useTabs: false, parser: "json" }
		), //require("./beautify").json(str, spc),
	upStats = (url, stats) =>
		fs.writeFileSync(
			j(ddir, parseURL(url).dir, "stats.json"),
			beautify(JSON.stringify(stats))
		),
	{ _get } = require("../../mods/hlpr"),
	rl = require("readline"),
	slogoff = false;

const fetch = (url) =>
	new Promise(async (res) => {
		/*
		let htm = await _get(url);
		if (
			htm.includes("Cloudflare Ray ID") ||
			htm.includes("Why do I have to complete a CAPTCHA?") ||
			htm.length < 1
		) {
			stats.usePupp = true;
			htm = await _get("https:pupp21.herokuapp.com/gethtm?url=" + url);
		}*/
		require("child_process").exec(`curl "${url}"`, (e, stdout, stderr) => res(stdout))
		//return res(htm);
	});

const init = (url, flag, usePupp) =>
	new Promise(async (res) => {
		var stats = {
			status: 1,
			url: url,
			done: false,
			tick: Date.now(),
			sat: Date.now(),
			failed: [],
			dlnk: "",
			usePupp: !!usePupp,
		};
		if (flag) res(stats);
		let { dir, hostN, p } = parseURL(url);
		if (fs.existsSync(j(ddir, dir)))
			fs.rmSync(j(ddir, dir), { recursive: true });
		if (!fs.existsSync(j(ddir, dir)))
			fs.mkdirSync(j(ddir, dir), { recursive: true });
		stats.status = 2;
		stats.dlnk = "download?file=" + j("imgD", dir, dir + ".zip");
		if (!isDead(url)) return log("imgD cancelled !");
		
		upStats(url, stats);
		let tick = setInterval(() => {
			stats.tick = Date.now();
			stats.timeElapsed =
				parseFloat((Date.now() - stats.sat) / 1000).toFixed(2) + "s";
			upStats(url, stats);
			slog(stats);
		}, 1000);
		let i = 0,
			imgU = (img) =>
				img.getAttribute("src").startsWith("http")
					? img.getAttribute("src")
					: j(p + "//" + hostN, img.getAttribute("src"));
		var htm = await fetch(url);
		if ( !isPro) fs.writeFile(j(ddir, dir, "source.htm"),  htm, () => {})
		if (htm.error) return res(log("Error : Unable to get html"));
		let dom = await parse(htm),
			imgs = dom.querySelectorAll("img");

		// if (!imgs.length) return init(url, 0, 1);

		stats.imgs = imgs.length;
		stats.status = 3;
		let getAlt = (img) => (img.getAttribute("alt") || "").slice(0, 10) || "";
		imgs = imgs.filter((img) => !!img.getAttribute("src"));
		imgs = imgs.map((img) => ({
			url: imgU(img),
			name: imgN(img, ++i),
			alt: getAlt(img),
		}));
		slog(stats);
		upStats(url, stats);

		for (let img of imgs) {
			let d = await _get(img.url, j(ddir, dir, img.name));
			d
				? stats.failed.push(img.url)
				: (stats.downloaded = imgs.indexOf(img) + 1);
			upStats(url, stats);
			//		stdout(d ? "!" : ".");
			slog(stats);
		}

		let zip = new require("adm-zip-node")();
		let files = fs
			.readdirSync(j(ddir, dir))
			.filter((file) => file !== "stats.json" || file !== "source.htm");
		files.forEach((file) => zip.addLocalFile(j(ddir, dir, file)));
		stats.status = 4;
		let zipPath = j(ddir, dir, dir + ".zip")
		zip.writeZip(zipPath);
		isPro && files.forEach((file) => fs.rmSync(j(ddir, dir, file)));

		stats.tick = Date.now();
		stats.done = true;
		upStats(url, stats);
		clearInterval(tick);
		slog(stats);
		stats.imgLnks = {}
		res();
	});

const isDead = (url, dev) => {
	let { dir } = parseURL(url),
		stats = "";
	try {
		stats = JSON.parse(fs.readFileSync(j(ddir, dir, "stats.json")));
	} catch (e) {
		return e;
	}
	let tick = parseInt((Date.now() - stats.tick) / 1000) < 5;
	if (dev)
		log(
			" ! ( %s : %i || %s ) ",
			tick,
			parseInt((Date.now() - stats.tick) / 1000),
			stats.done
		);
	return !(tick || stats.done);
};

function parseURL(url) {
	if (!url) return false;
	let u = require("url").parse(url),
		dir = j(u.hostname, u.pathname).replace(/[\/]/g, "_").replace(/[+]/g, "-");

	if (dir.endsWith("_")) dir = dir.slice(0, -1);
	return { dir: dir, hostN: u.host, p: u.protocol };
}

const imgN = (img, i) => {
	let exts = ["jpg", "gif", "png"];
	let alt = (img.getAttribute("alt") || "").replace(/[\/\s]/g, "_").slice(0, 40),
		src = (img.getAttribute("src") || "").replace(/\//g, "_"),
		name = bn(pn(src)),
		extnsn = exts.includes(ext(name)) ? ext(name) : "gif";
	name = `${i}. ${alt || name}.${extnsn}`
	log(name)
	return name
};

const slog = (stats) =>
	new Promise((res) => {
		if (process.env.NODE_ENV) return res();
		console.clear();
		rl.cursorTo(process.stdout, 0, 0);
		stdout(beautify({ ...stats, isDead: isDead(stats.url) }, "  "));

		res();
	});

const jsonFile = (fp) => JSON.parse(fs.readFileSync(fp));
function isD(url) { // is Done
	let { dir } = parseURL(url);
	if (!fs.existsSync(j(ddir, dir, "stats.json"))) return false;
	let { done } = jsonFile(j(ddir, dir, "stats.json"));
	return !fs.existsSync(j(ddir, dir, dir + ".zip")) && done;
}

function ImgD () {
	this.init = init;
}

module.exports = {
	isDead,
	parseURL,
	isD, // is Done
	ImgD,
};

/*

1. Job Started 
2. Fetching html
3. downloading imgs
4. Zipping Files

*/
