(async function() {
	delete window.t_uc;

	window.t_uc = {
		uc : $(".uc-menu"),
		off : function(){
			this.uc.style.opacity = 0;
			this.uc.style.transform = "translateY(20px)";
		},
		on : function(){
			this.uc.style.opacity = 1;
			this.uc.style.transform = "translateY(0px)";
		},
		t : function(){
			const isOn = this.uc.style.transform == "translateY(0px)";
			isOn ? this.off() : this.on();
		}
	}

	t_uc.off();
})();