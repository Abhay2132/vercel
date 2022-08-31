const { getqb, entities, getRepo } = require("../db/qb"),
	{ existsSync, rm } = require("fs");

function download(req, res) {
	let token = req.query.token + "";
	getqb("dtkns").then((q) => {
		q.where("dtkns.token = :token", { token })
			.getOne()
			.then((result) => {
				if (!result)
					return res.status(404).json({ error: "Download token is INVALID !" });
				let { uri, dod } = result;
				if (!existsSync(uri))
					return res.status(404).json({ error: "Sorry , File not Found ! " });
				res.download(
					uri,
					() => !dod || rm(uri, (err) => err ? log(err) : del(token).then(r => log("Deleted %s and %s", uri, JSON.stringify(r))))
				);
			});
	});
}

async function add(token, uri, dod = false) {
	if (!require("fs").existsSync(uri))
		return { error: `ENOENT : "${uri}" file does not exist !` };
	let repo = await getRepo("dtkns");
	let r = await repo.save({ token: token, uri: uri, dod: dod });
	return r;
}

function del(token) {
	return new Promise((res) => {
		getqb("dtkns").then((q) => {
			q.delete()
				.where("dtkns.token = :token", { token })
				.execute()
				.then((r) => res(r));
		});
	});
}

module.exports = {
	d: download,
	add: add,
};
