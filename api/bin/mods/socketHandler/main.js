const {liveReload} = require("../hlpr");
const {genHash} = require("../captcha/hlpr");

module.exports = async function (socket) {
	if ( ! isPro ) {
		const name = genHash(16);
		log("new socket added from", socket.handshake.address);
		global.sockets[name] = socket;
		socket.on("disconnect", () => delete global.sockets[name]);
		//socket.broadcast.emit("reload");
	}
}