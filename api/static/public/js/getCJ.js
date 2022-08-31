const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

const _getCJ = {
	av: parseInt(localStorage.getItem("appV") || "0"),
	getF: function() {
		//console.log({av : this.av});
		const av = this.av;
		return new Promise((res) => {
			let dataHandler = (t, a, w) => { // text , resolve : a , ls.setItem : w 
				var data = false,
					error = !1;
				try { data = JSON.parse(t); } catch (e) { error = e; }
				if (error) return res({ error });
				a(data);
				if (w) localStorage.setItem("CJ", t);
			};
			let cj = localStorage.getItem("CJ") || false;
			//console.log({ av , __appV , isDev , cj} ,this.av != __appV || isDev || !cj)
			if (av != __appV || isDev || !cj)
				fetch("/getCJ")
				.then((d) => d.text())
				.then((t) => dataHandler(t, res, 1))
				.catch(e => res({ error: e }));
			else dataHandler(cj, res);
		});
	},
	init: async function(d = {}) {
		const { a = false, cb = () => {} } = d;
		if (a) console.time(a);
		const data = await this.getF();
		// console.log(data.view);
		const { css = '', js = '', error = false } = data;
		if (error) return console.log(error);
		$("#cj_css") && $("#cj_css").remove();
		$("#cj_js") && $("#cj_js").remove();
		const style = document.createElement("style");
		const script = document.createElement("script");

		style.innerHTML = css;
		script.innerHTML = js;
		style.setAttribute("id", "cj_css");
		script.setAttribute("id", "cj_js");
		document.body.appendChild(style);
		document.body.appendChild(script);
		
		localStorage.setItem("appV", __appV)
		if (a) console.timeEnd(a);
		cb();
	}
}

async function setView(view, p = false) {
	hmbgr.off();
	sp.off();
	const ls_views = JSON.parse(localStorage.getItem("CJ")).view;
	if (ls_views.hasOwnProperty(view)) {
		let { mainHeading, title, html } = ls_views[view];
		const body = $("#body");
		const delay = 300;
		body.style.transition = delay + "ms";
		body.style.transform = 'translateY(100px)';
		body.style.opacity = '0';
		await wait(delay);
		body.innerHTML = html;
		$("#mainH").innerHTML = mainHeading;
		document.title = title;
		await wait(1);
		body.style.transform = 'translateY(0px)';
		body.style.opacity = '1';
	}
	_getCJ.init({ });
	if (p) history.pushState({ view }, "", view);
	else history.replaceState({view}, "", view);
	// log(p ? "state pushed" : 'state replaced !', view)
}

function _ca() {
	$$("[view]").forEach(v => {
		if (!!v.getAttribute("listeneradded")) return;// log("listener not Added : ", v.getAttribute("view"));
		// log("listener added : ", v.getAttribute("view"), v.getAttribute("listeneradded"));
		v.setAttribute("listeneradded", "true");
		v.addEventListener("click", async function(e) {
			e.preventDefault();
			let view = v.getAttribute("view");
			await setView(view, location.href.split("/").at(-1) != view);
		})
	})
}

window.onpopstate = async function(e) {
	if (!e.state) return;
	// log("popped state : ", e.state)
	await setView(e.state.view);
};

window.viewportTicker = window.requestAnimationFrame(setViewport)

function setViewport() {
	$("#sidePanel").style.height = window.innerHeight - 50 + "px";
	$("body").style.height = window.innerHeight + "px";
	$("#wa-app") && ($("#wa-app").style.height = window.innerHeight - 50 + "px");
	window.requestAnimationFrame(setViewport)
}