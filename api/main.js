const {createServer } = require("http");
const port = process.env.PORT || 3000;
const exp = require("express");
const app = exp();

app.get("*", (req,res) =>{
	res.end("YOUR SERVER IS RUNNIN AT PORT " + port);
})

module.exports = createServer(app)
.listen(port, () => console.log("Server started at ", (port)));