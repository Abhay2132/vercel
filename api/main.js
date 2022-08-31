const {createServer } = require("http");
const port = process.env.PORT || 3000;

module.exports = createServer((req, res) =>{
	res.end("Hi Sir, Your server started at port " + port);
})
.listen(port, () => console.log("Server started at ", (port)));