const ytdl = require("ytdl-core");

function bs(arr) {
	var i, j, temp;
	var swapped, n = arr.length
	for (i = 0; i < n - 1; i++) {
		swapped = false;
		for (j = 0; j < n - i - 1; j++) {
			if (parseInt(arr[j]) > parseInt(arr[j + 1])) {
				temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
				swapped = true;
			}
		}
		if (swapped == false) break;
	}
	return arr
}

async function getInfo (url) {
	let info = await ytdl.getInfo(url);
	let data = {};
	data.title = info.videoDetails.title;
	data.dur = info.player_response.videoDetails.lengthSeconds;
	data.iframeUrl = info.player_response.microformat.playerMicroformatRenderer.embed.iframeUrl;
	data.thumbnail =  info.player_response.videoDetails.thumbnail.thumbnails.at(-1).url;
	data.formats = info.formats;
	//console.log(data);
	return data;
}


module.exports = {
	bs ,
	getInfo
}