const fs = require("fs");

function api(req, res, next) {
	let { opr, path = false} = req.body;
	if (opr == "ls") return res.json(ls(path));
	return res.json({ error: "invalid data is req. body" , body : JSON.stringify(req.body)});
}

function ls(path = j(sdir, "..")) {
	//log(path)
	let dirs = [],
		files = [];
	path = path || j(sdir, "..")
	let ls = false;
	try {
		ls = fs.readdirSync(path)
	} catch (e) { return { error : e.code }}
	ls.forEach((file) => {
		if (fs.statSync(j(path, file)).isFile()) files.push(file);
		else dirs.push(file);
	});
	return { dirs: dirs, files: files, pwd: path };
}

module.exports = {
	ls: ls,
	api: api,
};
