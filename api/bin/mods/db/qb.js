const { createConnection, EntitySchema, getConnection } = require("typeorm"),
	{ join: j } = require("path"),
	entities = (function () {
		let ent_obj = {};
		require("fs")
			.readdirSync(j(__dirname, "entities"))
			.forEach((ent) => {
				if (ent.endsWith(".json"))
					ent_obj[ent.slice(0, -5)] = new EntitySchema(
						require("./entities/" + ent)
					);
			});
		return ent_obj;
	})(),
	config = {
		synchronize: true,
		entities: Object.values(entities),
	};
Object.assign(
	config,
	!!process.env.DATABASE_URL
		? { type: "postgres", url: process.env.DATABASE_URL }
		: {
				type: "postgres",
				host: "localhost",
				port: 5432,
				username: "abhay",
				database: "nexpp",
				password: "india",
		  }
);

if (require("os").platform() !== "android" || !!process.env.DATABASE_URL)
	Object.assign(config, {
		ssl: true,
		extra: {
			ssl: {
				rejectUnauthorized: false,
			},
		},
	});

function getqb(entity, cn = "default") {
	return new Promise((res) => {
		if (!Object.keys(entities).includes(entity))
			return res(
				{ error: "Entity not found !" },
				console.error({ error: "Entity not found !" })
			);
		getRepo(entity, { cn }).then((repo) => {
			if (repo.error) return res(repo.error);
			let qb;
			try {
				qb = repo.createQueryBuilder(entity);
			} catch (e) {
				qb = { error: e };
			}
			res(qb);
		});
	});
}

async function getConn(cn = "default") {
	let conn;
	try {
		conn = await getConnection(cn);
	} catch (e) {
		try {
			conn = await createConnection({ ...config, name: cn });
		} catch (e) {
			return { error: e };
		}
	}
	return conn;
}

const getRepo = async (entitiy, cn = "default") => {
	let conn = await getConn(cn);
	if (conn.error) return { error: conn.error };
	return conn.getRepository(entities[entitiy]);
};

module.exports = {
	getqb: getqb,
	getConn: getConn,
	getRepo: getRepo,
	entities: entities,
};
