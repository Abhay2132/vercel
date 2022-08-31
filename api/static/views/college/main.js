window._thmbgr = function (hmbgr,cb = false) {
	let [hr1, hr2, hr3] = hmbgr.children;

	if (!window.hmbgrOn) {
		hr1.style.transform = "translateY(10.5px) rotate(-45deg)";
		hr2.style.transform = "rotate(45deg)";
		hr3.style.transform = "translateY(-10.5px) rotate(-45deg)";
		window.hmbgrOn = true;
	} else {
		hr1.style.transform = "translateY(0px) rotate(0deg)";
		hr2.style.transform = "rotate(0deg)";
		hr3.style.transform = "translateY(0px) rotate(0deg)";
		window.hmbgrOn = false;
	}

	if (cb) return cb();
};

(async function (){
	while ( ! ( document.readyState == "interactive" || document.readyState == "complete" ) ) await (new Promise( res => setTimeout( res , 20)))
	document.body.innerHTML += "<STYLE>.hmbgr {flex-shrink: 0;height: 40px;width: 40px;background: #333;border-radius: 5px;box-sizing: border-box;position: relative;display : inline-block;text-align: center;}.hmbgr > hr {width: 20px;border: 1px solid #fff;border-radius: 5px;margin: 0px;margin-top: 8.5px;margin-left: 9px;transition: 0.3s;transform-origin: 50% 50%;}</STYLE>"
	for(let hmbgr of document.querySelectorAll(".hmbgr")){
		hmbgr.innerHTML = "<hr /><hr /><hr /> "
		let onclickEvent =  hmbgr.getAttribute("onclick")
		hmbgr.onclick = ""
		hmbgr.addEventListener("click", function () { _thmbgr(this,(eval(onclickEvent))) });
	}
})()

window.pressed = function (tag, bs = false) {
	tag.style.transition = "0.2s";
	tag.style.transform = "translateY(3px)";
	if (bs) tag.style.boxShadow = "0px 1px 1px #666";
	setTimeout(() => {
		tag.style.transform = "translateY(0px)";
		if (bs) tag.style.boxShadow = "0px 4px 1px #666";
	}, 300);
};

window._getH = (tag) => window.getComputedStyle(tag).getPropertyValue("height")

window._toggleHeight = function ( id, height , toggle){
	const me = this; 
	this.id = id;
	this.tag = i => document.querySelector( i );
	this.tag(id).style.transition = "0.2s"
	this.h = height || _getH(this.tag(id))
	this.t = () => {me.tag(me.id).style.height = me.tag(me.id).style.height == "0px" ? me.h : "0px";}
	if(toggle) this.t ()
}

window._tmenu = new _toggleHeight("#links", null, matchMedia("(max-width: 768px)").matches);
(async function () {
	window._slidesPos = 1
	while ( ! (document.readyState == "interactive" || document.readyState == "complete" ) ) await (new Promise(res => setTimeout(res, 200)))
	let [ left, right ] = document.querySelector(".slides_nav").children;
	
	function cycle ( n , min = 0, max =4) {
		if ( n < min ) return max;
		if ( n > max ) return min;
		return n
	}
	
	window._qs = q => document.querySelector(q)
	/*
	left.addEventListener("click" , function (){
		_slidesPos = cycle(_slidesPos-1 , 1, _qs(".slides").children.length, true)
		this.href = "#slide"+_slidesPos}, _qs(".slides").children.length)
	right.addEventListener("click" , function (){
		_slidesPos = cycle(_slidesPos+1, 1, 5)
		this.href = "#slide"+_slidesPos})
	//right.click()
	*/
	function slideTo (a) {
		console.log({a})
		n = cycle(a);
		x = screen.width * n;
		console.log(n,x)
		_qs(".slides").scrollTo(x, 0);
	}
	var n = 0;
	left.addEventListener("click", () => slideTo(--n));
	
	right.addEventListener("click", () => slideTo(cycle(++n)))
})()














