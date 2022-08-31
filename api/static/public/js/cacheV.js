(async function() {
	/*
	const views = ["index", "fm", "ytdl", "imgD", "nb"];
	var lastPushedState = "";

	async function getV(view, f = false) {
		let vd = localStorage.getItem(view + ".hbs");
		if (!f && vd) return JSON.parse(vd);
		let req = await fetch("/getView", {
				method: "POST",
				headers: new Headers({ "Content-Type": "application/json" }),
				body: JSON.stringify({ view }),
			}),
			data = (await req.json()) || {};
		localStorage.setItem(view + ".hbs", JSON.stringify(data));
		return data;
	}

	if (__appV == 0 || __appV != parseInt(localStorage.getItem("viewV") || "0"))
		for (let v of views) await getV(v, 1);
	localStorage.setItem("viewV", __appV);

	async function setView(view, ps = 1, ex) {
		let v = await getV(view);
		const tag = $("#body");
		let { body, title, mainHeading } = v;
		
	let delay = 300
	tag.style.transition = (delay / 1000).toFixed(1) + "s";
	tag.style.opacity = 0;
	//tag.style.transform = "translateY(200px)";
	tag.style.transform = "rotateY(90deg)";
	await wait(delay);
	
		tag.innerHTML = body;
		document.title = title;
		$("#mainH").textContent = mainHeading;
		
	await wait(10);
	tag.style.opacity = 1;
	tag.style.transform = "";
	
		//if ( isDev ) log("setting View", {view})
		_getCJ.init()
		//ca("setView")
		if (ps && lastPushedState != view) {
			lastPushedState = view
			history.pushState({ view }, "", view);
		}
	}

	function ca(db) {
		//if ( isDev ) log("Configuring anchors from" , db)
		for (let a of $$("a")) {
			let view = a.getAttribute("view") || false;
			let added = a.getAttribute("listenerAdded") || false;
			if (!view || added) continue;
			a.addEventListener("click", async function (e) {
				e.preventDefault();
				a.setAttribute("listenerAdded", true);
				await setView(view, 1);
					window.hmbgr.off();
					window.sp.off();
			});
		}
	}

	window.onpopstate = async function (e) {
		await setView(e.state.view, 0);
	};

	ca("root");

	window._ca() = function() {
		$$("[view]").forEach(v => {
			v.addEventListener("click", async function(e) {
				e.preventDefault();
				const me = e.target;
				let view = me.getAttribute("view");
				log({ view });
				const ls_views = JSON.parse(localStorage.getItem("getCJ")).

				_getCJ.init(window._ca);
			})
		})
	}
	*/
})();