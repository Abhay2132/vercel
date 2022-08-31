(async function () {
	if (document.title != "Image Downloader") return;
	const pb = new progressBar();
	const dblk = (...tags) =>
		tags.forEach((tag) => (tag.style.display = "block"));

	const getsc = (s, dd) => {
		let sc = {
			// status Codes
			1: "Job Started",
			2: "Fetching html",
			3: "Downloading imgs " + "(" + dd + ")",
			4: "Zipping Files",
		};
		return sc[s];
	};

	const imgD = (url = false) => {
		url = url || document.querySelector("#website_url").value;
		if (!url) return;
		dbtn();
		dblk($("#pbc"), pb.glare);
		fetch("/imgD", {
			method: "POST",
			headers: new Headers({ "Content-Type": "application/json" }),
			body: JSON.stringify({ url: url }),
		})
			.then((res) => res.json())
			.then((data) => logger(data, url));
	};

	function logger(data, url) {
		let { status, done, dlnk = false, downloading: dd } = data,
			w = done
				? "100%"
				: status == 3 && dd != "0/0"
				? eval(dd) * 100 + "%"
				: (status / 5) * 100 + "%",
			t = done ? "Ready To Download !" : getsc(status, dd);
		pb.update({ text: t, width: w });
		done ? (dbtn(dlnk), hide(pb.glare)) : setTimeout(() => imgD(url), 1000);
	}

	function dbtn(url) {
		let dbtn = $("#dbtn");
		url
			? (dblk(dbtn),
			  dbtn.addEventListener("click", () =>
					setTimeout(() => {
						location.href = url;
					}, 700)
			  ))
			: hide(dbtn);
		//$("#dbtn").href = url;
	}

	async function onload(cb, ...args) {
		while (document.readyState != "complete")
			await new Promise((res) => setTimeout(res, 500));
		if (args.length) cb(...args);
		cb();
	}

	// log("Adding form handler !")
	onload(() => {
		pb.init(document.querySelector("#pbc"));
		let form = document.querySelector("#siteURL_form");
		// console.log("configuring the form submit event ...");
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			imgD();
		});
	});
})();
