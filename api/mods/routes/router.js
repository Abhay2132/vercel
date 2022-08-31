const router = require("express").Router();

router.use((req,res) => {
	const {url, method, query} = req;

	if (query.index) return res.render("index", {mainHeading : "Coding Noob", title : "Coding Noob"})

	const pwd = "" + require("path").resolve();
	res.end([url, method, pwd].join(" "));
})

module.exports = router;