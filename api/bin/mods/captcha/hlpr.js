const jimp = require("jimp");
const path = require("path");

const chars =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSLUVWXYZ1234567890+_#@!?;:*";
	
function genHash(size = 8) {
	let hash = "";
	for (let i = 0; i < size; i++) {
		hash += chars[Math.floor(Math.random() * chars.length)];
	}
	return hash;
}

const bgp = j(pdir, 'imgs', 'bg.jpg');

let x = 0;
let y = 15;
let fp = j(pdir, 'font', 'f.fnt');
let text = {
	text: "" + genHash(), //Math.floor(Math.random() * Math.pow(10, 6)),
	alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
	alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
};

function rand (a,b) {
	if ( b < a ) { let c = a ; a = b ; b= c };
	return Math.floor((Math.random()*(b-a+1)) + a)
}

module.exports = {
	x,y, fp, text, bgp, genHash, rand
}