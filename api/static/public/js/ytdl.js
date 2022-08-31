(async function () {
	if (document.title != "YouTube Video Downloader") {
		delete window.toggle_avTab;
		delete window.getVQ;
		return;
	}
	$("input#url").value = localStorage.getItem("lastYtdlVideo") || "";
	window.getVQ = () => {
		ytdl_error();
		document.querySelector("#panel").style.opacity = "0";
		$(".loader").style.display = "block";
		let url = document.querySelector("#url").value.trim() || "";
		if (url.length < 1) return;
		localStorage.setItem("lastYtdlVideo", url);
		fetch("/ytdl/getd", {
			method: "POST",
			body: JSON.stringify({ url: url }),
			headers: new Headers({ "Content-Type": "application/json" }),
		})
			.then((res) => res.json())
			.then((data) => renderD(data));
	};

	function renderD(data) {
		$(".loader").style.display = "none";
		if (data.error) return ytdl_error(data.error);
		document.querySelector("#vif").src = data.iframeUrl;
		document.querySelector("#vif").style.background =
			'url("' + data.thumbnail + '")';
		$("#vif").style.backgroundSize = "contain";
		document.querySelector("#vn").innerHTML = `${
			data.title
		} <div class="t-c fw-600"> ( ${getTime(data.dur)} ) </div>`;
		let vqp = document.querySelector("#vPanel"),
			aqp = document.querySelector("#aPanel");
		vqp.innerHTML = "";
		aqp.innerHTML = "";
		for (let q in data.vqs) {
			let qBar = qNode.cloneNode(true);
			qBar.children[0].textContent = q;
			qBar.children[1].textContent = calcSize(data.vqs[q].size);
			let { height } = data.vqs[q];
			qBar.children[2].children[0].href = `/ytdl/download?url=${document
				.querySelector("#url")
				.value.trim()}&q=${height}&v=1`;
			vqp.appendChild(qBar);
		}
		for (let q in data.aqs) {
			let qBar = qNode.cloneNode(true);
			qBar.children[0].textContent = q;
			qBar.children[1].textContent = calcSize(data.aqs[q]);
			qBar.children[2].children[0].href = `/ytdl/download?url=${document
				.querySelector("#url")
				.value.trim()}&q=${q}&a=1`;
			aqp.appendChild(qBar);
		}
		document.querySelector("#panel").style.opacity = "1";
	}

	var qNode;

	onLoad(function () {
		if (document.querySelector(".quality"))
			qNode = document.querySelector(".quality").cloneNode(true);
	});

	function calcSize(size) {
		let inmb = (size / (1024 * 1024)).toFixed(2) + " MB";
		return inmb;
	}

	function getTime(secs) {
		let min = parseInt(secs / 60),
			sec = min > 0 ? secs % 60 : secs;
		return min > 0 ? `${min}m ${sec}secs` : `${sec} secs`;
	}

	function ytdl_error(msg = false) {
		let errTag = $("#ytdl_err");
		if (!msg) return (errTag.style.display = "none");
		errTag.textContent = msg;
		errTag.style.display = "block";
	}

	window.toggle_avTab = function (tag) {
		for (let c of tag.parentNode.children) c.style.border = "none";
		tag.style.borderBottom = "2px solid";
		if (tag.textContent.trim() == "Audio") {
			$("#vPanel").style.display = "none";
			$("#aPanel").style.display = "block";
		}
		if (tag.textContent.trim() == "Video") {
			$("#aPanel").style.display = "none";
			$("#vPanel").style.display = "block";
		}
	};
})();
