(async function () {
	window._imgC = async function () {
		const _getDatURL = (name, src) =>
			new Promise(async (res) => {
				let lsc = localStorage.getItem(name) || false;
				if (lsc) return res(lsc);
				if (!lsc) res(src);
				fetch("/img", {
					body: JSON.stringify({ url: src }),
					headers: new Headers({ "Content-Type": "application/json" }),
					method: "POST",
				})
					.then((data) => data.text())
					.then((txt) => {
						txt = "data:image/jpeg;base64," + txt;
						res(txt);
						localStorage.setItem(name, txt);
					});
			});

		while (!["complete", "interactive"].includes(document.readyState))
			await new Promise((res) => setTimeout(res, 10));

		document.querySelectorAll("img").forEach(async (img) => {
			let src = img.getAttribute("data-src");
			if (!src) return;
			let name = src.split("/")[src.split("/").length - 1];
			img.src = await _getDatURL(name, src);
		});
	};

	_imgC();
})();
