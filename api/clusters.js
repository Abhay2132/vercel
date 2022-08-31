module.exports = function () {
	const cluster = require("cluster");
	const app = require("./bin/index");

	if (cluster.isMaster) {
		console.log(`Master ${process.pid} is running`);
		const WORKERS = process.env.WEB_CONCURRENCY || 1;
		for (let i = 0; i < WORKERS; i++) {
			cluster.fork();
		}
		cluster.on("exit", (worker, code, signal) => {
			console.log(`worker ${worker.process.pid} died`);
		});
	} else {
		app();
		console.log(`Worker ${process.pid} started`);
	}
};