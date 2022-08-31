if (!Array.prototype.at)
	Array.prototype.at = function (n) {
		return this[n < 0 ? this.length + n : n] || null;
	};

const cacheF = {
	files: [],
	av: parseInt(localStorage.getItem("fileV") || "0"),
	lsS: () => {
		let s = 1;
		try {
			localStorage.getItem("");
		} catch (e) {
			s = !1;
		}
		return s;
	},
	getF: function (url, f) {
		return new Promise((res) => {
			if (f)
				fetch(url)
					.then((d) => d.text())
					.then((t) =>
						this.lsS()
							? localStorage.setItem(url, t, res(t), (this.getM = "L"))
							: (res(t), (this.getM = "L"))
					);
			else {
				res(localStorage.getItem(url) || "");
				this.getM = "C";
			}
		});
	},
	logs: [],
	addFile: (file = !1, data = !1, type = !1) => {
		if (!file || !data || !type) return console.log({ file, data, type });
		let id = file.replace(/[^a-zA-Z0-9_]/g, "_");
		let tag = document.createElement(type);
		if (tag.parentNode) tag.parentNode.removeChild(tag);
		tag.setAttribute("id", id);
		tag.setAttribute("class", "cached_file");
		tag.innerHTML = data;
		document.body.appendChild(tag);
	},
	init: async function ({
		logging = false,
		appV = 0,
		ignore = [],
		cb = () => {},
		uc = false,
		ex = "main",
	}) {
		// uc :- use cache
		this.logs = { appV, files: [], ignore, ex };
		let sT = Date.now();
		let f = !appV || this.av != appV;
		if (uc) f = !1;
		document.querySelectorAll(".cached_file").forEach((t) => t.remove());
		for (let file of this.files) {
			if (ignore.includes(file)) continue;
			let st = Date.now();
			let data = await this.getF(file, f);
			if (file.endsWith(".js")) this.addFile(file, data, "script");
			else if (file.endsWith(".css")) this.addFile(file, data, "style");
			this.logs.files.push(
				this.getM +
					" : " +
					file.split("/").at(-1) +
					" " +
					(Date.now() - st) +
					"ms"
			);
		}
		if (logging)
			(this.logs.timeE = Date.now() - sT + "ms"), console.log(this.logs);

		localStorage.setItem("fileV", appV);
		if (typeof cb == "function") return cb();
		return;
	},
};
