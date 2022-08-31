const hbs = require("express-handlebars"),
	fs = require("fs"),
	{minify} = require("uglify-js")
	
let getJS = (name) => new Promise( res => {
	fs.readFile(j(sdir, "public", "js", name), (err, txt) => {
		if ( err) return res(err)
		if ( ! isPro ) return res(txt.toString());
		res(minify(txt.toString()).code || "")
	})
})

module.exports = async () => {
	let getCJ = await getJS("getCJ.js");
	
	let engine = hbs.create({
		defaultLayout: "main",
		helpers: {
			isDev() {
				return ! isPro;
			},
			isPro () {
				return isPro;
			},
			pwd () {
				return __dirname;
			},
			appV () {
				return __appV;
			},
			getCJ () {
				return getCJ;
			}
		},
		extname: ".hbs",
	}).engine;
	return engine;
};


