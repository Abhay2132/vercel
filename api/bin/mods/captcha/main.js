const {x,y, fp, text, bgp, genHash, rand} = require("./hlpr.js");
const jimp = require("jimp");

module.exports = async function (req, res,  next) {
	const cid = req.query.id || Date.now();
	const cp = j(sdir, 'files', 'captcha'+cid+".jpg");
	const bg = await jimp.read(bgp);
	const mask = await jimp.read(j(pdir, "imgs", 'masks', "mask"+rand(1, 9)+".png"));
	const font = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
	text.text = genHash();
	let name = await new Promise( a => {
			bg.print(font, x, y, text, bg.bitmap.width, (err, image, { x, y }) => {
			image.quality(10)
			image.blit(mask, 0,0); 
			image.write(cp, () => a(basename(cp)));
		})
	});
	!isPro && log(text.text);
	res.sendFile(cp);
}

