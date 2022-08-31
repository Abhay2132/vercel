const { createServer } = require("http");
const port = process.env.PORT || 3000;
const fs = require("fs");

module.exports = createServer((req, res) => {
		fs.writeFileSync("data.txt", "Hello World !");
		const hello = fs.readFileSync("data.txt");
		res.end(data + " | EXPRESS");
	})
	.listen(port, () => console.log("Server started at ", (port)));