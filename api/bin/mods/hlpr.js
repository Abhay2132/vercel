const fs = require("fs"),
	colors = require("colors"),
	https = require("https"),
	http = require("http"),
	out = file => {
		let dir = file.split("/"); dir.pop()
		dir = dir.join("/");
		fs.mkdirSync(dir, {recursive : true});
		return fs.createWriteStream(file)
	},
	hbs = require("handlebars"),
	templates = require("./routes/templates"),
	path = require("path"),
	{minify} = require("uglify-js"),
	cc = require("clean-css"),
	em = require("events")
	
const logger = (req, res, next) => {
		let st = Date.now();
		let mc = {
			GET: "green",
			POST: "yellow",
			PUT: "blue",
			DELETE: "magenta",
		};
		let clr = mc[req.method] || "grey";
		clr = colors[clr](req.method)
		res.on("finish", () => {
		let method = res.statusCode >= 400 ? colors.bgRed(clr)  : clr
		if ( req.url == "/reload") return //log({reload})
		log(method, req.url, colors.yellow(Date.now() - st + "ms"))
		})
		next();
	}
	
const _get = ( url , dest , dev) => new Promise( async resolve => {
	if(dev) console.log(dev)
	let cb = ( r, res, des ) => {
		if ( des ) {
			r.pipe(out(des))
			r.on("end", res);
		} 
		else {
			let data = ""
			r.on("data" , chunk => (data += chunk))
			r.on("end", () => res(data));
		}
	}
	let req = ""
	if( url.startsWith("https")) req = https.get(url, r => cb(r, resolve,dest) )
	else if ( url.startsWith("http")) req = http.get(url, r => cb(r, resolve, dest))
	else return resolve(false)
	req.on("error", (e) => resolve({error : e}))
})

function getView (req, res) {
	let { view = false } = req.body || {}
	if ( ! view ) return res.json({ error : "View name is not defined !"})
	if (! getT(view)) return res.json({ error : "View not found !"})
	fs.readFile(j(sdir, "views", view+".hbs"), (error, txt) => {
		if ( error ) return res.json({error : error.message})
		txt = txt.toString()
		let temp = hbs.compile(txt)
		let {title, mainHeading } = getT(view)
		return res.json({ body : temp(), title, mainHeading})
	})
}

function getT(v = "") {
	for( let t in templates ) if ( templates [t].view === v ) return templates[t]
	return false
}

function download (res= false, file = false, cb = ()=>{}) {
	return new Promise (async r => {
		let error = (errM) =>  { let e = new Error(errM); r(e) ; log (e) ; return cb(e); }
		if ( ! res ) return error("Response Obect is mot defined");
		if ( ! fs.existsSync(file)) return error(`${file} not found !`);
		let fileStats = await (new Promise(a => fs.stat(file, (er, s) => a(er || s))))
		if ( ! fileStats.isFile()) return error(`${file} is not a file !`) 
		let data = fs.createReadStream(file);
		res.header("Content-Length", fileStats.size)
		res.header("Content-Disposition",`attachment; filename=${require("path").basename(file)}`);
		
		res.on("finish", () => cb(null, file, r()))
		data.pipe(res);
	})
}

function readFile (file ) {
	return new Promise( res => {
		if ( ! fs.existsSync(file)) return res("")
		fs.readFile(file, (err, data ) => res(err || data.toString()))
	})
}

function ext ( a, s = "/" ) {
	return a.split(s).at(-1).split("?")[0].split(".").at(-1)
}

function watcher (dirs, cb) {
	for(let dir of dirs ) {
		fs.watch(dir, cb);
		let files = fs.readdirSync(dir);
		for(let file of files ) {
			file = j(dir,file);
			let stat = fs.statSync(file);
			if (stat.isDirectory()) watcher([file], cb);
		}
	}
}

function reload () {
	for(let name in global.sockets ) {
		let socket = global.sockets[name];
		console.log({name});
		socket.emit("reload");
	}
}

function liveReload () {
	let dir2W = [j(sdir, "views"), pdir]
	global.reloadClients = {}
	watcher(dir2W, (e,f) => {
		log(e,f);
		reload ();
		//for(let client in global.reloadClients) global.reloadClients[client] = true;
	});
}

module.exports = {
	logger,
	_get,
	getView,
	download,
	ext,
	liveReload
};