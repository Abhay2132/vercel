(async function () {
	if (document.title != "WhatsUp") {
		delete window.t_fab;
		return;
	}

	window.t_fab = {
		fab_opts : $(".fab-opts"),
		btn : $(".fab > [icon=plus]"),
		off : function () {
			this.btn.style.transform = 'rotate(0deg)';
			this.fab_opts.style.height = '0';
			this.fab_opts.style.opacity = '0';
		},
		on : function () {
			this.btn.style.transform = 'rotate(225deg)';
			this.fab_opts.style.height = 55 * 3 + 'px';
			this.fab_opts.style.opacity = '1';
		},
		t : function (cb) {
			const isOn = this.fab_opts.style.opacity == '1';
			isOn ? this.off() : this.on();
			if ( typeof cb == 'function') cb();
		}
	}

})();
