const router = require("express").Router();

router.use((req,res) => {
	const {url, method} = req;
	res.end(url + " " + method);
})

module.exports = router;