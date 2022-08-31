const {Router} = require("express");

Router.use((req,res) => {
	const {url, method} = req;
	res.end(url + " " + method);
})

module.exports = Router;