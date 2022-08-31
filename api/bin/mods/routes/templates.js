let routes = {
		"/": { "view": "index", "title": "Coding Noob", "mainHeading": "Coding Noob" },
		"/index": { "view": "index", "title": "Coding Noob", "mainHeading": "Coding Noob" },
		"/?": { "view": "index", "title": "Coding Noob", "mainHeading": "Coding Noob" },
		"/imgD": { "view": "imgD", "title": "Image Downloader", "mainHeading": "Coding Noob" },
		"/fm": {"view": "fm",	"title": "File Manager",	"mainHeading": "File Manager"},
		"/ytdl": { "view": "ytdl", "title": "YouTube Video Downloader" , "mainHeading": "Coding Noob"},
		"/wu": { "view": "wu", "title": "WhatsUp" , "mainHeading": "WhatsUp"},
		"/signup": { "view": "signup", "title": "SignUp" , "mainHeading": "SignUp"}
	};

if ( ! isPro ) {
	
}

module.exports = routes;
