const fs = require("fs"),
	{ format } = require("prettier");

function writeV(versions) {
	let stringified = JSON.stringify(versions);
	let json = format(stringified, { useTabs: true, parser: "json" });
	fs.writeFileSync(j(pdir, "versions.json"), json);
}

function init(m = "") {
	if (fs.existsSync(j(pdir, "versions.json"))) return;
	let js = fs.readdirSync(j(pdir, "js")),
		css = fs.readdirSync(j(pdir, "css")),
		newVs = {};

	js.forEach((file) => {
		let a = "/js/" + file;
		let { size } = fs.statSync(j(pdir, a));
		newVs[a] = { version: 1, size: size };
	});
	css.forEach((file) => {
		let a = "/css/" + file;
		let { size } = fs.statSync(j(pdir, a));
		newVs[a] = { version: 1, size: size };
	});
	writeV(newVs);
}

function getVersion(file) {
	init("getVersion");
	let versions = jsonFile(j(pdir, "versions.json"));
	let v = {};
	if (versions[file]) v[file] = versions[file].version;
	else v.error = `File "${file}" not found !`;
	return v;
}

function c4u() {
	init("c4u");
	let v = jsonFile(j(pdir, "versions.json")),
		resp = {},
		keys = Object.keys(v);
	for (let file in v) {
		let { size } = fs.statSync(j(pdir, file));
		if (size !== v[file].size) {
			v[file].version++;
			v[file].size = size;
		}
		resp[file] = v[file].version;
	}
	writeV(v);
	return resp;
}

function getVersions(files) {
	let vs = {};
	files.forEach((file) => Object.assign(vs, getVersion(file)));
	return vs;
}

const jsonFile = (fp) => JSON.parse(fs.readFileSync(fp));

module.exports = {
	getV: getVersion,
	c4u: c4u,
	getVs: getVersions,
};
