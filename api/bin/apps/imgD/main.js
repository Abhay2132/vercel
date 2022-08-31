const {ImgD, parseURL : pu, isDead, isD} = require("./imgD"),
	ddir = j(sdir, "files", "imgD"),
	fs = require("fs")

module.exports = async (req, res) => {
	let url = req.body.url || false
	if ( ! url ) return res.json({error : "url missing !"})
	let {dir} = pu(url)
	if ( ! fs.existsSync(j(ddir, dir, "stats.json")) || !! isDead(url) || isD(url) ){
		//log("Starting Download !",  ! fs.existsSync(j(ddir, dir, "stats.json")) , !! isDead(url, true) , isD(url) )
		let imgD = new ImgD();
		let {status, done, dlnk = "", imgs = 0, downloaded = 0} = await imgD.init(url, true);
		return res.json({status : status , done : done, dlnk : dlnk, downloading : downloaded+"/"+ imgs})
	}
	let {status, done, dlnk = "", imgs = 0, downloaded = 0} = JSON.parse(fs.readFileSync(j(ddir, dir, "stats.json")))
	return res.json({status : status , done : done, dlnk : dlnk, downloading : downloaded+"/"+ imgs})
}