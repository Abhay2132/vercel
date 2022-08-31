(async function () {
	if (document.title != "File Manager") {
		delete window._fm;
		return;
	}
	
	var scrollTick;
	function scrollNav(x = 1) {
		let _pwd = $("#pwd");
		x += 10;
		_pwd.scrollTo(++x, 0);
		if (x > _pwd.scrollWidth) return window.cancelAnimationFrame(scrollTick);
		scrollTick = window.requestAnimationFrame(() => scrollNav(x));
	}

	_fileManager = function (pwd = "") {
		this.bn = location.href.split("/")[location.href.split("/").length - 1];
		const me = this;
		this.pwd = pwd;
		this.ce = (name, ih) => {
			let tag = document.createElement(name);
			tag.innerHTML = ih;
			return tag;
		};

		this.rendering = false;
		this.forceStop = false;

		this.stopRender = (cb) =>
			new Promise(async (a) => {
				me.forceStop = true;
				while (me.rendering) await wait(10);
				me.forceStop = false;
				a(typeof cb == "function" && cb());
			});

		this.setPwd = (pwd = me.pwd) => {
			pwd = pwd.slice(1).split("/");
			let _pwd = $("#pwd");
			let fdir = pwd.shift();
			fdir = fdir.length > 0 ? fdir : "/";
			_pwd.innerHTML = "<span>" + fdir + "</span>";
			for (let d of pwd)
				_pwd.innerHTML +=
					'<div class="rightArrow"></div><span> ' + d + " </span>";
			//window.requestAnimationFrame(() => scrollNav(_pwd.scrollLeft));
			_pwd.scrollTo(_pwd.scrollWidth, 0);
		};

		this.open = async (dir) => {
			let ls =
				(await (
					await fetch("/fm", {
						method: "POST",
						headers: new Headers({ "Content-Type": "application/json" }),
						body: JSON.stringify({ opr: "ls", path: dir }),
					})
				).text()) || false;
			try {
				ls = JSON.parse(ls);
			} catch (e) {
				return log(ls);
			}
			if (ls.error) return log({ls, fetch_error : ls.error});
			me.pwd = ls.pwd;
			if (ls) me.stopRender(() => me.render(ls));
		};

		this.wait = (n) => new Promise((res) => setTimeout(res, n));

		this.render = async (ls) => {
			if (this.rendering) return;
			this.rendering = true;
			me.setPwd();
			var barsP = document.querySelector(".files-container"),
				bars = barsP.children,
				n = bars.length;
			while (n--) barsP.removeChild(bars[n]);

			let upDir = me.pwd.split("/").at(-2);
			// log({upDir});
			barsP.appendChild(me.newgb(upDir));
			$(".upDir").innerHTML = upDir;//me.pwd.split("/")[me.pwd.split("/").length - 2];
			await wait(1);
			for (let dir of ls.dirs) {
				if (me.forceStop) break;
				let newDir = me.newDir(dir);
				barsP.appendChild(newDir);
				_imgC();
				await wait(20);
				me.slideUp(newDir);
			}

			for (let file of ls.files) {
				if (me.forceStop) break;
				let newFile = me.newFile(file);
				barsP.appendChild(newFile);
				_imgC();
				await wait(20);
				me.slideUp(newFile);
			}
			//me.configLinks(me.pwd);
			this.rendering = false;
		};

		this.slideUp = (tag) => {
			tag.style.opacity = 1;
			tag.style.transform = "translateY(0px) scale(1)";
		};

		this.newDir = (name) => {
			let div = document.createElement("div");
			div.className = "folder";
			div.innerHTML =
				"<img data-src='/icons/folder.png' /> <span class='name'> " +
				name +
				'</span> <div class="open-btn" onclick = " ' +
				"_fm.open(_fm.pwd + '/" +
				name +
				"'.trim())\"" +
				"> Open </div> ";
			return div;
		};

		this.newFile = (name) => {
			let file = document.createElement("div");
			file.className = "file";
			file.innerHTML =
				"<img data-src='/icons/file.png' /> <span class='name'> " +
				name +
				"</span>";
			return file;
		};

		this.newgb = (name) => {
			//log(name)
			let div = document.createElement("div");
			div.className = "gb ovrflw-hdn pos-rel hbr(chd-div(right-0p))";
			div.innerHTML =
				"<img data-src='/icons/back.png' /> <span class='name upDir'> " +
				name +
				" </span><div class=\"back-btn\"  onclick=\"_fm.open(_fm.pwd.split('/').slice(0, -1).join('/'))\"> Back </div> ";
			return div;
		};

		this.configLinks = (pwd) => {
			$(".upDir").innerHTML = me.pwd.split("/")[me.pwd.split("/").length - 2];
			me.setPwd(pwd);
			//history.pushState("", "Title", "/fm" + me.pwd)
			//me.history.push(me.pwd);
		};
	};

	async function _fmConfig() {
		window._fm = new _fileManager(pwd);
		_fm.open(pwd);
	}
	_fmConfig();
})();
