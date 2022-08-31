const fs = require("fs"),
	beautify = (str) =>
		require("prettier").format(
			typeof str == "object" ? JSON.stringify(str) : str,
			{ useTabs: false, parser: "json" }
		)

let isDir = ( dir ) => new Promise ( res => {
	if ( ! fs.existsSync(dir)) return res(false)
	fs.stat(dir, (e, stat) => {
		if ( e ) return res(false, log(e))
		return res(stat.isDirectory())
	})
})

let ls = ( dir ) => new Promise( res => {
	fs.readdir(dir, (e, f) => {
		if (e) return res(log(e))
		res(f)
	})
})

let getD = file => new Promise( res => {
	fs.stat(file, (e, s) => {
		if (e) return res(log(e))
		let {mtimeMs, size} = s
		res({mtimeMs, size})
	})
})

function VS (c) {
	 // configs
		if ( ! c.vdir ) throw new Error("vdir not defined !")
		this.dirs = c.dirs || {}
		this.ignores = c.ignores || []
		this.vdir = c.vdir || ""
		this.useS = !! c.useS
	
	let getVers = vdir => new Promise ( res => {
		fs.readFile(j(vdir, "versions.json"), async (e, d) => {
			if (e) return res(e)
			d = d.toString()
			if ( d.length < 1 ) return res((await this.init()))
			res(JSON.parse(d))
		})
	})
	
	this.init = async function () {
		let vers = {},
			me = this
		for(let dir in this.dirs){
			let dp = this.dirs[dir]
			if ( ! (await isDir (dp)) ) continue
			let files = await ls(dp)
			for(let file of files){
				if ((await isDir (j(dp, file)))) continue
				if ( me.ignores.includes(file)) continue
				let {mtimeMs = false, size = false} = (await getD(j(dp, file))) || {}
				if ( ! mtimeMs || ! size) continue;
				vers[j(dir,file)] = {
					version : 1,
					mTime : mtimeMs,
					length : size,
					path : j(dp, file)
				}
			}
		}
		fs.writeFile(j(this.vdir, "versions.json"), beautify(vers), (e) => (!e || log(e)))
		return vers
	}
	
	this.c4u = async function (useS = false, forInit = false) { // check 4 update
		if ( ! fs.existsSync(j(this.vdir, "versions.json")))
			await this.init ()
		useS = useS || this.useS
		let vers = await getVers(this.vdir),
			newVers = {},
			updated = {}
		for ( let v in vers ) {
			newVers[v] = vers[v]
			let {path, mTime, length, version} = vers[v]
			let {mtimeMs = false, size = false} = (await getD(path)) || {}
			if ( ! mtimeMs || ! size) continue;
			if ( useS ){
				if ( length != size ){
					newVers[v].version = version + 1
					newVers[v].length = size
					updated[v] = version + 1
				}
			} else {
				if ( mtimeMs != mTime ) {
					newVers[v].version = version + 1
					newVers[v].mTime = mtimeMs
					updated[v] = version + 1
				}
			}
		}
		fs.writeFile(j(this.vdir, "versions.json"), beautify(newVers), (e) => (!e || !log(e)))
		
		let newVs = {}
		for(let v in newVers) {
			newVs[v] = newVers[v].version
		}
		return {updated, newVs : beautify(newVs)};
	}

}

module.exports = VS
