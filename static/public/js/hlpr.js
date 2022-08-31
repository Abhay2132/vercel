(async function () {

	window.hide = (tag) => (tag.style.display = "none");
	window.wait = (n = 0) => new Promise((a) => setTimeout(a, n));
	window.log = (...a) => console.log(...a);
	window.elog = (...a) => console.error(...a);
	
	window.pressed = function (tag, bs = false) {
		tag.style.transition = "0.2s";
		tag.style.transform = "translateY(3px)";
		if (bs) tag.style.boxShadow = "0px 1px 1px #666";
		setTimeout(() => {
			tag.style.transform = "translateY(0px)";
			if (bs) tag.style.boxShadow = "0px 4px 1px #666";
		}, 300);
	};

	window.downloadFile = function (file) {
		return new Promise((res) => {
			const link = document.createElement("a");
			link.style.display = "none";
			link.href = URL.createObjectURL(file);
			if (file.name) link.download = file.name;
			document.body.appendChild(link);
			link.click();
			setTimeout(() => {
				URL.revokeObjectURL(link.href);
				link.parentNode.removeChild(link);
				res("Download Started !");
			}, 0);
		});
	};

	window.sp = {
		off: function () {
			const sp = $("#sidePanel");
			sp.style.transform = "translateX(-250px)";
			sp.style.opacity = "0";
			return window.sp;
		},
		on: function () {
			const sp = $("#sidePanel");
			sp.style.transform = "translateX(0px)";
			sp.style.opacity = "1";
			return window.sp;
		},
		t: function (cb) {
			const sp = $("#sidePanel");
			//this.isOn = sp.style.opacity == '1';
			const isOn = sp.style.opacity == "1";
			if (!isOn) {
				window.sp.on();
			} else {
				window.sp.off();
			}
			if (typeof cb == "function") cb();
			return window.sp;
		},
	};

	window.hmbgr = {
		on: function () {
			let [hr1, hr2, hr3] = $("#hmbgr").children;
			hr1.style.width = "25px";
			hr1.style.transform = "translateY(7.5px) rotate(-45deg)";
			hr2.style.transform = "rotate(45deg)";
			hr3.style.transform = "translateY(-7.5px) rotate(-45deg)";
			return window.hmbgr;
		},
		off: function () {
			let [hr1, hr2, hr3] = $("#hmbgr").children;
			hr1.style.width = "18px";
			hr1.style.transform = "translateY(0px) rotate(0deg)";
			hr2.style.transform = "rotate(0deg)";
			hr3.style.transform = "translateY(0px) rotate(0deg)";
			return window.hmbgr;
		},
		t: function (cb = false) {
			const isOn =
				$("#hmbgr").children[1].style.transform ==
				"rotate(45deg)";
			if (!isOn) {
				window.hmbgr.on();
			} else {
				window.hmbgr.off();
			}

			if (cb) cb();
			return window.hmbgr;
		},
	};

	window._getH = (tag) =>
		window.getComputedStyle(tag).getPropertyValue("height");

	window._toggleHeight = function (id, height, toggle) {
		const me = this;
		this.id = id;
		this.tag = (i) => document.querySelector(i);
		this.tag(id).style.transition = "0.2s";
		this.h = height || _getH(this.tag(id));
		this.t = () => {
			me.tag(me.id).style.height =
				me.tag(me.id).style.height == "0px" ? me.h : "0px";
		};
		if (toggle) this.t();
	};

	window.onLoad = async (func) => {
		while (!["complete", "interactive"].includes(document.readyState))
			await new Promise((res) => setTimeout(res, 100));
		return typeof func === "function" ? func() : func;
	};
})();
