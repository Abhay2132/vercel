const {css , js , views } = require("./files");
const fs = require("fs");
const {minify} = require("uglify-js");
const cc = require('clean-css');
const viewsData = require("../routes/templates");
const hbs = require("handlebars");

const read = (file) => new Promise ( a => fs.readFile(file, (e, d) => {
	//a(e || (isPro && file.endsWith(".js") ? minify(d.toString()).code : new cc().minify(d.toString()).styles) )
	if ( e) return a(e.stack);
	d = d.toString();
	if ( isPro) {
		if (file.endsWith(".js")) d = minify(d).code;
		if (file.endsWith(".css")) d = new cc().minify(d).styles;
	}
	a(d)
}));

const mergeFiles = (files = [], dir = false) => new Promise ( async a => {
	if ( ! dir ) return a({error : "dir is not specdied"});
	var content = '';
	dir = j(pdir, dir);
	
	for(let file of files) content += await read(j(dir, file));
	a(content);
});

async function getData(){
	const data = {};
	data.css = await mergeFiles(css, "css")
	data.js = await mergeFiles(js, "js")
	data.view = await getViews(views);
	return data;
}

async function getViews(views) {
	v = {};
	for(let view of views){
		let text = await read(j(sdir, "views", view+".hbs"));
		let d = {};
		d.html = hbs.compile(text)();
		let {title, mainHeading } = getT(view)
		d.mainHeading = mainHeading;
		d.title = title;
		v[view] = d;
		// console.log("getT : ", getT(view))
	}
	return v;
}

function getT(v = "") {
	if (viewsData.hasOwnProperty("/"+v)) return viewsData["/"+v]
	return !!console.log(v, viewsData);
}

module.exports = {
	getData
}