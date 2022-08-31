const ytdl = require("ytdl-core"),
	{ spawn } = require("child_process"),
	ffmpeg = isA ? "/data/data/com.termux/files/home/ffmpeg" : 
		(process.env.ffmpeg || require('@ffmpeg-installer/ffmpeg').path),// ! isA ? ( isPro ? require('@ffmpeg-installer/ffmpeg').path /*"/app/vendor/ffmpeg/ffmpeg"*/ : "/usr/bin/ffmpeg" ) : "/data/data/com.termux/files/usr/bin/ffmpeg",
	{ bs, getInfo } = require("./hlpr"),
	beautify = (str) =>
		require("prettier").format(
			typeof str == "object" ? JSON.stringify(str) : str,
			{ useTabs: true, parser: "json" }
		);

log(ffmpeg);
async function getD(req, res) {
	let {url = false} = req.body || {};
	if (!url) return res.json({ error: "url is missing !" });
	let err
	let vqs = {}; // video quality & size
	let aqs = {}; // audio quality and size
	let data = { vqs: {}, aqs : {} },
		info
	try {
	info = await getInfo(url);
	} catch (e) { err = e ; log(e) }
	if (err) return res.json({error : err.message})
	
	let { title, dur, iframeUrl, thumbnail, formats } = info;
	data.title = title;
	data.dur = dur;
	data.iframeUrl = iframeUrl;
	data.thumbnail = thumbnail;
	
	formats.forEach((f) => {
		let ql = f.qualityLabel;
		if (!!f.height && ql.at(-1) == "p" && !!f.contentLength && !! f.mimeType.startsWith("video"))
			vqs[ql] = {size : f.contentLength, height : f.height }
		if (!! f.mimeType.startsWith("audio") && f.contentLength )
			aqs[f.bitrate + " kbps"] = f.contentLength
		
		//log(f.height, ql.at(-1),f.contentLength,f.hasVideo,f.qualityLabel,vqs, aqs);
	});
	let svks = bs(Object.keys(vqs)),
		saks = bs(Object.keys(aqs))
	svks.forEach((k) => (data.vqs[k] = vqs[k]));
	saks.forEach((k) => (data.aqs[k] = aqs[k]));

	return res.json(data);
}

async function dl(req, res) {
	let { url = false, q = false , a = false, v = false} = req.query || {};
	if (!(url && q)) return res.status(401).end("url / quality missing in query");
	q = parseInt(q);
	log({ url, q , a, v});
	//log("dl");
	if ( a ) return dlAudio(url, q, res);
	let err;
	//log("getting info !")
	let {title, formats} = await getInfo(url);
	let name = title.replace(/[^a-zA-Z_0-9]/g ,"_")
	while(name.includes("__")) name = name.replace("__", "_")
	let videoF;
	//log({name})
	try {
		log(q)
		videoF = await ytdl.chooseFormat(formats, {
			filter: (f) => f.height == parseInt(q) && !!f.contentLength && !!f.hasVideo,
		});
	} catch (e) {
		err = e;
		console.log({videoF_error : e});
	}

	if (err) return res.end(beautify({url, q : q+'', error : err.message, fs : formats.map(f => ({height : ''+f.height}))  }));

	let audio = ytdl(url);
	let video = ytdl(url, { quality: videoF.itag });

	let ff = spawn(
		ffmpeg,
		[
			"-v","panic",
			"-i","pipe:3",
			"-i","pipe:4",
			"-map","0:a",
			"-map","1:v",
			"-c:a","copy",
			"-c:v","copy",
			"-f","matroska",
			"pipe:5",
		],
		{
			stdio: ["inherit", "inherit", "inherit", "pipe", "pipe", "pipe"],
		}
	);

	res.header("Content-Type", "video/x-matroska");
	res.header(
		"Content-Disposition",
		`attachment; filename=${name}_${q}.mkv`
	);
	
	let dps = 0; // deadPipes
	ff.on("close", () => dps =! 3 ? ++dps : res.end());
	audio.on("close", () => dps =! 3  ? ++dps : res.end());
	video.on("close", () => dps =! 3  ? ++dps : res.end());

	audio.pipe(ff.stdio[3]);
	video.pipe(ff.stdio[4]);
	//log("piping")
	ff.stdio[5].pipe(res);
}

async function dlAudio ( url, q, res) {
	if ( !url || !q ) return res.json({error : "url / q is missing !", url : url, q :q })
	
	let err;
	let {title, formats} = await getInfo(url);
	let name = title.replace(/[^a-zA-Z_0-9]/g ,"_")
	while(name.includes("__")) name = name.replace("__", "_")
	let audioF;
	try {
		audioF = await ytdl.chooseFormat(formats, {
			filter: (f) => f.audioBitrate == parseInt(q) && !!f.contentLength && !!f.hasAudio,
		});
	} catch (e) {
		err = e;
		console.log(e);
	}

	if (err) return res.end(err.message);

	let audio = ytdl(url, { quality: audioF.itag });
	res.header("Content-Type", "audio/mp3");
	res.header(
		"Content-Disposition",
		`attachment; filename=${name}_${q}kbps.mp3`
	);
	audio.pipe(res)
}

module.exports = {
	getD: getD,
	dl: dl,
};
