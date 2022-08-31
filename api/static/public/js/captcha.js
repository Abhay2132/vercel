(async function () {
	window.newCaptcha = (a)=>{
		a.remove();
		const img = document.createElement("img");
		img.src = '/captcha?id=' + Date.now();
		img.onclick = () => newCaptcha(img);
		$(".captcha").appendChild(img);
		//document.body.appendChild(img);
	}
})();