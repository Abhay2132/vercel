const {createServer } = require("http");

module.exports = createServer((req, res) =>{
	res.end("Hi Sir");
})
.listen(process.env.PORT || 3000, () => console.log("Server started at ", (process.env.PORT || 3000)));